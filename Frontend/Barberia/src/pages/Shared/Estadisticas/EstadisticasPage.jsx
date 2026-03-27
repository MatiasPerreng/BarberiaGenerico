import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuthContext } from "../../../auth/AuthContext";
import { getGanancias } from "../../../services/estadisticas";
import API_URL from "../../../services/api";
import "./EstadisticasPage.css";

const formatMoneda = (n) => {
  try {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);
  } catch {
    return `$ ${Number(n) || 0}`;
  }
};

const formatPeriodo = (p, agrupacion) => {
  if (p == null || typeof p !== "string") return String(p ?? "-");
  if (agrupacion === "mes" && /^\d{4}-\d{2}$/.test(p)) {
    const [y, m] = p.split("-");
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${meses[parseInt(m, 10) - 1]} ${y}`;
  }
  if (agrupacion === "anio") return p;
  return p;
};

export default function EstadisticasPage() {
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agrupacion, setAgrupacion] = useState("mes");
  const [barberos, setBarberos] = useState([]);
  const [idBarbero, setIdBarbero] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { agrupacion, id_barbero: idBarbero || undefined };
        const res = await getGanancias(params);
        if (!cancelled) setData(res);
      } catch {
        if (!cancelled) setError("No se pudieron cargar las estadisticas.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [agrupacion, idBarbero]);

  useEffect(() => {
    if (!isAdmin) return;
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/barberos/activos`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => setBarberos(Array.isArray(list) ? list : []))
      .catch(() => setBarberos([]));
  }, [isAdmin]);

  const chartData = Array.isArray(data?.por_periodo)
    ? data.por_periodo.map((p) => ({
      periodo: formatPeriodo(p?.periodo, agrupacion),
      total: Number(p?.total) || 0,
      turnos: Number(p?.cantidad_turnos) || 0,
    }))
    : [];

  return (
    <div className="estadisticas-page">
      <h1>{isAdmin ? "Estadisticas de la barberia" : "Mis ganancias"}</h1>

      <div className="estadisticas-filtros">
        <div className="estadisticas-agrupacion">
          <label>Agrupar por:</label>
          <select value={agrupacion} onChange={(e) => setAgrupacion(e.target.value)}>
            <option value="dia">Dia</option>
            <option value="mes">Mes</option>
            <option value="anio">Anio</option>
          </select>
        </div>

        {isAdmin && (
          <div className="estadisticas-barbero">
            <label>Barbero:</label>
            <select value={idBarbero} onChange={(e) => setIdBarbero(e.target.value)}>
              <option value="">Todos</option>
              {barberos.map((b) => (
                <option key={b.id_barbero} value={b.id_barbero}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && <p className="estadisticas-loading">Cargando...</p>}
      {error && <p className="estadisticas-error">{error}</p>}

      {data && !loading && (
        <>
          <div className="estadisticas-resumen admin-cards">
            <div className="admin-card success">
              <h3>Hoy</h3>
              <p>{formatMoneda(data.resumen?.hoy)}</p>
            </div>
            <div className="admin-card primary">
              <h3>Este mes</h3>
              <p>{formatMoneda(data.resumen?.este_mes)}</p>
            </div>
            <div className="admin-card">
              <h3>Este anio</h3>
              <p>{formatMoneda(data.resumen?.este_anio)}</p>
            </div>
          </div>

          <div className="estadisticas-chart-container">
            <h2>Ganancias por periodo</h2>
            {chartData.length > 0 ? (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                    <XAxis
                      dataKey="periodo"
                      tick={{ fontSize: 12 }}
                      angle={chartData.length > 6 ? -45 : 0}
                      textAnchor={chartData.length > 6 ? "end" : "middle"}
                    />
                    <YAxis tickFormatter={(v) => formatMoneda(v)} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => formatMoneda(value)}
                      labelFormatter={(label) => `Periodo: ${label}`}
                    />
                    <Bar dataKey="total" fill="#007aff" radius={[4, 4, 0, 0]} name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="estadisticas-empty">No hay datos en el periodo seleccionado.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import BarberoAgendaList from "../../components/Barbero/BarberoAgendaList/BarberoAgendaList";
import BarberoDaySummary from "../../components/Barbero/BarberoDaySummary";
import API_URL from "../../services/api";
import "./BarberAgenda.css";

const BarberAgenda = () => {
  // 📅 Día seleccionado (por defecto HOY)
  const [fecha, setFecha] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`${API_URL}/visitas/mi-agenda?fecha=${fecha}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setTurnos(data || []);
      })
      .catch(() => {
        if (isMounted) setTurnos([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [fecha]);

  return (
    <div className="barbero-agenda-page">
      <h1>Mi agenda</h1>

      {/* =========================
         RESUMEN + FILTRO (COMPONENTE CORRECTO)
      ========================= */}
      <BarberoDaySummary
        turnos={turnos}
        fecha={fecha}
        onChangeFecha={setFecha}
      />

      {/* =========================
         LISTADO
      ========================= */}
      {loading && <p>Cargando agenda…</p>}

      {!loading && turnos.length === 0 && (
        <p className="agenda-empty">
          No tenés turnos para este día
        </p>
      )}

      {!loading && turnos.length > 0 && (
        <BarberoAgendaList
          turnos={turnos}
          onSelectTurno={() => { }}
        />
      )}
    </div>
  );
};

export default BarberAgenda;

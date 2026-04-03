import { useEffect, useState } from "react";
import BarberoDaySummary from "../../components/Barbero/BarberoDaySummary";
import BarberoAgendaList from "../../components/Barbero/BarberoAgendaList/BarberoAgendaList";
import BarberoTurnoModal from "../../components/Barbero/BarberoTurnoModal";
import { getAgendaBarbero } from "../../services/barberos";
import "./BarberoDashboard.css";

const BarberoDashboard = () => {
  const [fecha, setFecha] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [turnos, setTurnos] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    setError(null);

    getAgendaBarbero(fecha)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const normalizados = list.map((v) => ({
          id: v.id_visita,
          id_visita: v.id_visita,
          fecha_hora: v.fecha_hora,
          fechaHora: v.fecha_hora,

          hora: new Date(v.fecha_hora).toLocaleTimeString("es-UY", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),

          cliente_nombre: v.cliente_nombre,
          cliente_apellido: v.cliente_apellido,
          telefono: v.cliente_telefono || "",

          servicio: v.servicio_nombre,
          servicio_nombre: v.servicio_nombre,
          duracion: v.servicio_duracion,
          servicio_duracion: v.servicio_duracion,

          estado: v.estado || "CONFIRMADO",
          precio:
            v.servicio_precio ?? v.precio_al_reservar ?? v.precio ?? 0,
          servicio_precio:
            v.servicio_precio ?? v.precio_al_reservar ?? v.precio ?? 0,
          precio_al_reservar: v.precio_al_reservar ?? 0,
        }));
        if (!cancelado) setTurnos(normalizados);
      })
      .catch(() => {
        if (!cancelado) setError("No se pudo cargar tu agenda");
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [fecha]);

  const handleAtender = (id) => {
    setTurnos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, estado: "completado" } : t
      )
    );
    setTurnoSeleccionado(null);
  };

  const handleCancelar = (id, motivo) => {
    setTurnos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, estado: "cancelado", motivo }
          : t
      )
    );
    setTurnoSeleccionado(null);
  };

  if (loading) return <p>Cargando tu agenda…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="barbero-dashboard">
      <h1>Mi agenda</h1>

      <BarberoDaySummary
        turnos={turnos}
        fecha={fecha}
        onChangeFecha={setFecha}
      />

      <BarberoAgendaList turnos={turnos} />

      {turnoSeleccionado && (
        <BarberoTurnoModal
          turno={turnoSeleccionado}
          onClose={() => setTurnoSeleccionado(null)}
          onAtender={handleAtender}
          onCancelar={handleCancelar}
        />
      )}
    </div>
  );
};

export default BarberoDashboard;

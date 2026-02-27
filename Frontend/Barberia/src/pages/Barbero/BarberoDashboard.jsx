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
    setLoading(true);

    getAgendaBarbero(fecha)
      .then((data) => {
        const normalizados = data.map((v) => ({
          id: v.id_visita,
          fechaHora: v.fecha_hora,

          hora: new Date(v.fecha_hora).toLocaleTimeString("es-UY", {
            hour: "2-digit",
            minute: "2-digit",
          }),

          cliente_nombre: v.cliente_nombre,
          cliente_apellido: v.cliente_apellido,
          telefono: v.cliente_telefono || "",

          servicio: v.servicio_nombre,
          duracion: v.servicio_duracion,

          estado: v.estado || "CONFIRMADO",
          precio: v.precio || 0,
        }));

        setTurnos(normalizados);
      })
      .catch(() => {
        setError("No se pudo cargar tu agenda");
      })
      .finally(() => setLoading(false));
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

      <BarberoAgendaList
        turnos={turnos}
        onSelectTurno={setTurnoSeleccionado}
      />

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

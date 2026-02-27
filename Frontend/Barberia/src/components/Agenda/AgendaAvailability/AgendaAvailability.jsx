import { useEffect, useState, useMemo, useRef } from "react";
import Footer from "../../Footer/Footer";
import "./AgendaAvailability.css";
import { getDisponibilidad } from "../../../services/agenda";

const esHoraValida = (fecha, hora) => {
  const ahora = new Date();
  const [y, m, d] = fecha.split("-").map(Number);
  const [h, min] = hora.split(":").map(Number);
  const fechaHora = new Date(y, m - 1, d, h, min, 0, 0);
  return fechaHora > ahora;
};

const AgendaAvailability = ({ servicio, barbero, onSelectFechaHora, onVolver }) => {
  const hoy = useMemo(() => new Date(), []);
  const hoyISO = hoy.toISOString().split("T")[0];


  const fechaMax = useMemo(() => {
    const d = new Date(hoy);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 10);
    return d;
  }, [hoy]);

 
  const horariosRef = useRef(null);

  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());
  const [dias, setDias] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [disponibilidadDias, setDisponibilidadDias] = useState({});
  const [loadingMes, setLoadingMes] = useState(false);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // ============================
  // 1. Generar días del mes
  // ============================
  useEffect(() => {
    const primerDiaMes = new Date(anioActual, mesActual, 1);
    const offset = (primerDiaMes.getDay() + 6) % 7;
    const totalDias = new Date(anioActual, mesActual + 1, 0).getDate();
    const diasMes = [];

    const hoyBase = new Date(hoy);
    hoyBase.setHours(0, 0, 0, 0);

    for (let i = 0; i < offset; i++) {
      diasMes.push({ empty: true });
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const fechaObj = new Date(anioActual, mesActual, dia);
      fechaObj.setHours(0, 0, 0, 0);

      const fechaISO = fechaObj.toISOString().split("T")[0];

      const dentroDeRango =
        fechaObj >= hoyBase && fechaObj <= fechaMax;

      diasMes.push({
        dia,
        fecha: fechaISO,
        disponible: dentroDeRango,
      });
    }

    setDias(diasMes);
  }, [mesActual, anioActual, hoy, fechaMax]);

  // ============================
  // 2. Carga masiva de disponibilidad
  // ============================
  useEffect(() => {
    const cargarTodoElMes = async () => {
      if (dias.length === 0) return;

      const diasAConsultar = dias.filter(
        d =>
          d.fecha &&
          d.disponible &&
          disponibilidadDias[d.fecha] === undefined
      );

      if (diasAConsultar.length === 0) return;

      setLoadingMes(true);
      const nuevasDisponibilidades = { ...disponibilidadDias };

      try {
        await Promise.all(
          diasAConsultar.map(async (d) => {
            try {
              const data = await getDisponibilidad({
                fecha: d.fecha,
                id_servicio: servicio.id_servicio,
                id_barbero: barbero?.id_barbero,
              });

              const tieneTurnos = (data.turnos || []).some(hora =>
                d.fecha === hoyISO ? esHoraValida(d.fecha, hora) : true
              );

              nuevasDisponibilidades[d.fecha] = tieneTurnos;
            } catch {
              nuevasDisponibilidades[d.fecha] = false;
            }
          })
        );

        setDisponibilidadDias(nuevasDisponibilidades);
      } finally {
        setLoadingMes(false);
      }
    };

    cargarTodoElMes();
  }, [dias, servicio.id_servicio, barbero?.id_barbero, hoyISO]);

  // ============================
  // 3. Scroll automático cuando cargan los horarios
  // ============================
  useEffect(() => {
    if (horarios.length > 0 && horariosRef.current) {
      horariosRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [horarios]);

  const handleSelectDia = async (fecha) => {
    setFechaSeleccionada(fecha);
    setHorarios([]);

    try {
      const data = await getDisponibilidad({
        fecha,
        id_servicio: servicio.id_servicio,
        id_barbero: barbero?.id_barbero,
      });
      setHorarios(data.turnos || []);
    } catch {
      setHorarios([]);
    }
  };

  const cambiarMes = (delta) => {
    let nuevoMes = mesActual + delta;
    let nuevoAnio = anioActual;

    if (nuevoMes < 0) { nuevoMes = 11; nuevoAnio--; }
    else if (nuevoMes > 11) { nuevoMes = 0; nuevoAnio++; }

    setMesActual(nuevoMes);
    setAnioActual(nuevoAnio);
    setFechaSeleccionada(null);
    setHorarios([]);
  };

  return (
    <>
      <div className="aa-booking-overlay">
        <div className="aa-booking-container">
          <aside className="aa-booking-sidebar">
            <div className="aa-logo">
              <img src="/logo.jpg" alt="King Barber" />
            </div>

            <ul className="aa-steps">
              <li className="aa-step done">
                <span className="aa-step-number">✓</span>
                <p className="aa-step-text">Servicio</p>
              </li>
              <li className="aa-step done">
                <span className="aa-step-number">✓</span>
                <p className="aa-step-text">Personal</p>
              </li>
              <li className="aa-step active">
                <span className="aa-step-number">3</span>
                <p className="aa-step-text">Fecha y hora</p>
              </li>
              <li className="aa-step">
                <span className="aa-step-number">4</span>
                <p className="aa-step-text">Información</p>
              </li>
            </ul>

            <div className="af-sidebar-footer">
              <p>¿Tenés alguna pregunta?</p>
              <small>099 611 465</small>
            </div>
          </aside>

          <section className="aa-booking-content">
            <button className="aa-btn-volver" onClick={onVolver}>
              ← Volver
            </button>

            <h3>Selecciona la fecha y hora</h3>

            <div className="aa-calendar-header">
              <button className="aa-month-btn" onClick={() => cambiarMes(-1)}>‹</button>
              <span className="aa-month-label">
                {meses[mesActual]} {anioActual}
              </span>
              <button className="aa-month-btn" onClick={() => cambiarMes(1)}>›</button>
            </div>

            <div className="aa-calendar-weekdays">
              {diasSemana.map((d) => <span key={d}>{d}</span>)}
            </div>

            <div className={`aa-calendar-grid ${loadingMes ? "is-loading" : ""}`}>
              {dias.map((d, idx) =>
                d.empty ? (
                  <div key={`empty-${idx}`} className="aa-calendar-empty" />
                ) : (
                  <button
                    key={d.fecha}
                    disabled={!d.disponible || disponibilidadDias[d.fecha] === false}
                    className={`aa-calendar-day 
                      ${!d.disponible ? "disabled" : ""}
                      ${disponibilidadDias[d.fecha] === true ? "available" : ""}
                      ${disponibilidadDias[d.fecha] === false ? "full" : ""}
                      ${fechaSeleccionada === d.fecha ? "selected" : ""}
                    `}
                    onClick={() => handleSelectDia(d.fecha)}
                  >
                    {d.dia}
                  </button>
                )
              )}
            </div>

            <div ref={horariosRef} style={{ paddingTop: "10px" }}>
              {fechaSeleccionada && (
                <div className="aa-horarios-container">
                  <h4>
                    Horarios para el{" "}
                    {fechaSeleccionada.split("-").reverse().join("/")}
                  </h4>

                  <div className="aa-horarios-grid">
                    {horarios
                      .filter(h =>
                        fechaSeleccionada === hoyISO
                          ? esHoraValida(fechaSeleccionada, h)
                          : true
                      )
                      .map(hora => (
                        <button
                          key={hora}
                          className="aa-hora-card"
                          onClick={() =>
                            onSelectFechaHora(`${fechaSeleccionada} ${hora}`)
                          }
                        >
                          {hora}
                        </button>
                      ))}

                    {horarios.length === 0 && (
                      <p className="aa-no-horarios">
                        No hay turnos disponibles para este día.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AgendaAvailability;
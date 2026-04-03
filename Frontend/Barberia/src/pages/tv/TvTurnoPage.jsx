import { useEffect, useState, useRef } from "react";
import "./TvTurnoPage.css";
import API_URL from "../../services/api";


export default function TvAgendaPage() {
  const [enCurso, setEnCurso] = useState([]);
  const [proximos, setProximos] = useState([]);
  const [indiceProximo, setIndiceProximo] = useState(0);
  const [horaActual, setHoraActual] = useState("");
  const [minuteTick, setMinuteTick] = useState(false);

  const lastMinuteRef = useRef(null);

  /* ===================== RELOJ ===================== */
  useEffect(() => {
    const actualizarHora = () => {
      const now = new Date();
      setHoraActual(
        now.toLocaleTimeString("es-UY", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );

      const minuto = now.getMinutes();
      if (lastMinuteRef.current !== null && minuto !== lastMinuteRef.current) {
        setMinuteTick(true);
        setTimeout(() => setMinuteTick(false), 400);
      }
      lastMinuteRef.current = minuto;
    };

    actualizarHora();
    const reloj = setInterval(actualizarHora, 1000);
    return () => clearInterval(reloj);
  }, []);

  /* ===================== AGENDA ===================== */
  useEffect(() => {
    cargarAgenda();
    const interval = setInterval(cargarAgenda, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (proximos.length === 0) return;
    const rotador = setInterval(
      () => setIndiceProximo((i) => (i + 1) % proximos.length),
      5000
    );
    return () => clearInterval(rotador);
  }, [proximos]);

  const cargarAgenda = async () => {
    try {
      const res = await fetch(`${API_URL}/tv/agenda-estado`);
      const data = await res.json();
      setEnCurso(data.en_curso || []);
      setProximos(data.proximos || []);
      setIndiceProximo(0);
    } catch (err) {
      console.error("Error cargando TV agenda", err);
    }
  };

  const proximo = proximos[indiceProximo];
  const usarGrid = enCurso.length >= 3;

  return (
    <div className="tv-agenda-container tv-43">
      {/* ===================== HEADER ===================== */}
      <header className="tv-header">
        <div className="tv-brand">
          <div className="tv-brand-mark">
            <img src="/logo.jpg" alt="" className="tv-logo" />
          </div>
          <div className="tv-brand-lockup">
            <p className="tv-brand-name">
              <span className="tv-brand-king">KING</span>{" "}
              <span className="tv-brand-barber">BARBER</span>
            </p>
            <p className="tv-brand-sub">Agenda en pantalla</p>
          </div>
        </div>
        <div className={`tv-clock ${minuteTick ? "minute-tick" : ""}`}>
          {horaActual}
        </div>
      </header>

      {/* ===================== MAIN ===================== */}
      <main className="tv-main-content">
        {/* ---------- EN CURSO ---------- */}
        <section className="tv-section" aria-label="Servicios en curso">
          <div className="tv-section-header">
            <h2 className="tv-title">Servicios en curso</h2>
            <div className="live-badge" role="status">
              <span className="live-badge-dot" aria-hidden="true" />
              <span>En vivo</span>
            </div>
          </div>

          <div className={`tv-list ${usarGrid ? "tv-list-grid" : ""}`}>
            {enCurso.length === 0 ? (
              <div className="tv-empty-state">
                <p className="tv-empty-title">Sala en espera</p>
                <p className="tv-empty-sub">No hay servicios activos en este momento</p>
              </div>
            ) : (
              enCurso.slice(0, 4).map((s, i) => (
                <div
                  key={i}
                  className="tv-item tv-item--live"
                  style={{ animationDelay: `${i * 0.09}s` }}
                >
                  <div className="tv-item-bg" aria-hidden="true" />
                  <span className="tv-item-slot" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div className="tv-item-body">
                    <div className="tv-item-barbero-col">
                      <span className="tv-label">Barbero</span>
                      <div className="tv-barbero">{s.barbero}</div>
                    </div>
                    <div className="tv-item-detail-col">
                      <div className="tv-cliente">{s.cliente}</div>
                      <div className="tv-servicio">{s.servicio}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ---------- PRÓXIMO ---------- */}
        <section className="tv-section next" aria-label="Próximo turno">
          <h2 className="tv-title gold">Próximo servicio</h2>

          {proximo ? (
            <div className="tv-next-card tv-animate" key={indiceProximo}>
              <div className="tv-next-card-inner">
                {!proximo.es_hoy && (
                  <div className="tv-next-fecha">{proximo.fecha_texto}</div>
                )}

                <div className="tv-next-time-showcase">
                  <span className="tv-next-time-eyebrow">A las</span>
                  <div className="tv-next-hora">{proximo.hora}</div>
                </div>

                <div className="tv-next-details-stack">
                  <div className="tv-next-cliente-block">
                    <span className="tv-next-meta-label">Cliente</span>
                    <div className="tv-next-cliente-name">{proximo.cliente}</div>
                  </div>
                  <div className="tv-next-meta-inline">
                    <span className="tv-next-meta-label">Servicio</span>
                    <span className="tv-next-servicio-text">{proximo.servicio}</span>
                  </div>
                  <div className="tv-next-meta-inline tv-next-meta-inline--barber">
                    <span className="tv-next-meta-label">Barbero</span>
                    <strong className="tv-next-barbero-name">{proximo.barbero}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="tv-empty-state tv-empty-state--next">
              <p className="tv-empty-title">Sin turnos programados</p>
              <p className="tv-empty-sub">Los próximos turnos aparecerán aquí</p>
            </div>
          )}
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="tv-footer">
        <span className="tv-footer-line" />
        <div className="tv-footer-inner">
          <span className="tv-footer-credit">Desarrollo</span>
          <span className="tv-footer-dot" aria-hidden="true" />
          <span className="tv-footer-name">Matias Perreng</span>
        </div>
      </footer>
    </div>
  );
}

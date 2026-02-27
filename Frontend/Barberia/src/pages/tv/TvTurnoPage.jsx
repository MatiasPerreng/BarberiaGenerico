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
          <img src="/logo.jpg" alt="King Barber" className="tv-logo" />
          <span className="tv-brand-text">KING BARBER</span>
        </div>
        <div className={`tv-clock ${minuteTick ? "minute-tick" : ""}`}>
          {horaActual}
        </div>
      </header>

      {/* ===================== MAIN ===================== */}
      <main className="tv-main-content">
        {/* ---------- EN CURSO ---------- */}
        <section className="tv-section">
          <div className="tv-section-header">
            <h2 className="tv-title">SERVICIOS EN CURSO</h2>
            <div className="live-badge">EN VIVO</div>
          </div>

          <div className={`tv-list ${usarGrid ? "tv-list-grid" : ""}`}>
            {enCurso.slice(0, 4).map((s, i) => (
              <div key={i} className="tv-item">
                <div>
                  <span className="tv-label">BARBERO</span>
                  <div className="tv-barbero">{s.barbero}</div>
                </div>
                <div>
                  <div className="tv-servicio">{s.servicio}</div>
                  <div className="tv-cliente">{s.cliente}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- PRÓXIMO ---------- */}
        <section className="tv-section next">
          <h2 className="tv-title gold">PRÓXIMO SERVICIO</h2>

          {proximo && (
            <div className="tv-next-card tv-animate">
              {!proximo.es_hoy && (
                <div className="tv-next-fecha">
                  {proximo.fecha_texto}
                </div>
              )}

              <div className="tv-next-hora">{proximo.hora}</div>

              <div className="tv-next-text">
                <div className="tv-next-servicio">
                  {proximo.servicio}
                </div>
                <div className="tv-next-cliente">
                  {proximo.cliente}
                </div>
              </div>

              <div className="tv-next-barbero">
                con <strong>{proximo.barbero}</strong>
              </div>

              <div className="shimmer-effect" />
            </div>
          )}
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="tv-footer">
        <span>DEVELOPED BY</span>
        <strong>MATIAS PERRENG</strong>
      </footer>
    </div>
  );
}

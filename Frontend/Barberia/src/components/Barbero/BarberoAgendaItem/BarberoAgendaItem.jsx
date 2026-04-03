import getDiaTexto from '../../../../utils/date';
import whatsappIcon from '../../../assets/icons/whatsapp.svg';


const estadoVisualClass = (estado) => {
  const e = String(estado || "").toLowerCase();
  if (e === "completado") return "atendido";
  if (e === "cancelado") return "cancelado";
  return "reservado";
};

const BarberoAgendaItem = ({ turno }) => {
  const diaTexto = getDiaTexto(turno.fechaHora);

  const telefonoWsp = turno.telefono
    ? turno.telefono.replace(/\D/g, '')
    : null;

  const clienteNombre = `${turno.cliente_nombre || ""} ${turno.cliente_apellido || ""}`.trim();
  const esHoy = diaTexto === "Hoy";
  const diaMostrar =
    !diaTexto
      ? ""
      : esHoy
        ? "Hoy"
        : diaTexto.charAt(0).toUpperCase() + diaTexto.slice(1);

  return (
    <div
      className={`barbero-agenda-item estado-${estadoVisualClass(turno.estado)}`}
    >
      <div className="hora">
        <span className="hora-label">Hora</span>
        <span className="hora-valor">{turno.hora}</span>
      </div>

      <div className="info">
        <div className="agenda-info-main">
          <div className="agenda-info-row">
            <div className="agenda-col agenda-col-cliente">
              <span className="agenda-kicker">Cliente</span>
              <p className="agenda-cliente">{clienteNombre || "—"}</p>
              {diaMostrar && (
                <span
                  className={`agenda-contexto ${
                    esHoy ? "agenda-contexto--hoy" : "agenda-contexto--fecha"
                  }`}
                >
                  {diaMostrar}
                </span>
              )}
            </div>
            <div className="agenda-col agenda-col-servicio">
              <span className="agenda-kicker">Servicio</span>
              <p className="agenda-servicio">{turno.servicio}</p>
              <div className="agenda-meta">
                <span
                  className="agenda-chip agenda-chip-duracion"
                  aria-label="Duración estimada"
                >
                  {turno.duracion} min
                </span>
                {telefonoWsp && (
                  <a
                    href={`https://wa.me/598${telefonoWsp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wsp-link agenda-wsp"
                    title="Enviar WhatsApp"
                  >
                    <img
                      src={whatsappIcon}
                      alt=""
                      className="wsp-icon-agenda"
                      aria-hidden
                    />
                    <span className="agenda-wsp-text">WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <span className="estado">{turno.estado}</span>
    </div>
  );
};

export default BarberoAgendaItem;

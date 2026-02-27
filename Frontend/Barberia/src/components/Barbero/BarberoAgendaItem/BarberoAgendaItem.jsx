import getDiaTexto from '../../../../utils/date';
import whatsappIcon from '../../../assets/icons/whatsapp.svg';


const BarberoAgendaItem = ({ turno }) => {
  const diaTexto = getDiaTexto(turno.fechaHora);

  const telefonoWsp = turno.telefono
    ? turno.telefono.replace(/\D/g, '')
    : null;

  return (
    <div className={`barbero-agenda-item estado-${turno.estado}`}>
      <div className="hora">{turno.hora}</div>

      <div className="info">
        <p className="frase">
          <strong>{diaTexto}</strong> tenés{" "}
          <strong>{turno.servicio}</strong>{" "}
          con{" "}
          <strong>
            {turno.cliente_nombre} {turno.cliente_apellido}
          </strong>
        </p>

        <span className="extra">
          ⏱ {turno.duracion} min

          {telefonoWsp && (
            <a
              href={`https://wa.me/598${telefonoWsp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wsp-link"
              title="Enviar WhatsApp"
            >
            <img src={whatsappIcon} alt="WhatsApp" className='wsp-icon-agenda' />
       
            </a>
          )}
        </span>
      </div>

      <span className="estado">{turno.estado}</span>
    </div>
  );
};

export default BarberoAgendaItem;

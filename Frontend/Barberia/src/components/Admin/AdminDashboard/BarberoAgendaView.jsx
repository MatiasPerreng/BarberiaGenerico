import { useEffect, useState } from "react";
import API_URL from "../../../services/api";


const BarberoAgendaView = () => {
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/barberos/`)
      .then((res) => res.json())
      .then(setBarberos);
  }, []);

  return (
    <div className="barbero-agenda">
      {barberos.map((b) => (
        <div key={b.id_barbero} className="barbero-block">
          <h4>{b.nombre}</h4>
          <small>{b.activo ? "Activo" : "Inactivo"}</small>
        </div>
      ))}
    </div>
  );
};

export default BarberoAgendaView;

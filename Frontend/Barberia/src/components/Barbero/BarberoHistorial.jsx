const BarberoHistorial = ({ turnos }) => {
  return (
    <div>
      <h2>Historial</h2>

      {turnos.map((t) => (
        <div key={t.id}>
          {t.hora} – {t.cliente} – {t.estado}
        </div>
      ))}
    </div>
  );
};

export default BarberoHistorial;

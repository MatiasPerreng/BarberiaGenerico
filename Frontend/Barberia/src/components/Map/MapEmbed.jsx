import "./MapEmbed.css";

export default function MapEmbed() {
  return (
    <div className="map-wrapper">
      {/* HEADER SUPERIOR */}
      <div className="map-header">
        <h3 className="map-title">¿Dónde nos encontramos?</h3>
        <p className="map-address">
          <span className="pin">📍</span>
          Egipto 4163, Montevideo, Uruguay
        </p>
      </div>

      {/* MAPA (EL TUYO) */}
      <div className="map-container">
        <iframe
          title="Ubicación barbería"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.2029337517847!2d-56.2488792!3d-34.8762501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a1d58298248b0b%3A0x12dac9a7c6ca8d3e!2sEgipto%204163%2C%2012800%20Montevideo%2C%20Departamento%20de%20Montevideo!5e0!3m2!1ses-419!2suy!4v1766359332252!5m2!1ses-419!2suy"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}

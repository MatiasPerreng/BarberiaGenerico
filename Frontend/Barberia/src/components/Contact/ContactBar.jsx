import whatsappIcon from "../../assets/icons/whatsapp.svg";
import instagramIcon from "../../assets/icons/instagram.svg";

import "./ContactBar.css";

export default function ContactBar() {
  return (
    <div className="contact-card">
      <h3 className="contact-title">Contactanos</h3>
      <p className="contact-subtitle">
        Comunicate con nosotros para cualquier consulta o inquietud.
      </p>

      <div className="contact-divider" />
      <div className="contact-item">
        <span className="contact-label">
          <span className="contact-icon">📍</span>
          Dirección
        </span>
        <span className="contact-text">
          Egipto 4163, Montevideo, Uruguay
        </span>
      </div>

      <div className="contact-divider" />
      <div className="contact-item">
        <span className="contact-label">
          <span className="contact-icon">📞</span>
          Contacto
        </span>
        <span className="contact-text">099 611 465</span>
      </div>

      <div className="contact-socials">
        <a
          href="https://wa.me/59899611465"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <img src={whatsappIcon} alt="WhatsApp" />
        </a>

        <a
          href="https://www.instagram.com/kingbarberuy"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <img src={instagramIcon} alt="Instagram" />
        </a>
      </div>
    </div>
  );
}

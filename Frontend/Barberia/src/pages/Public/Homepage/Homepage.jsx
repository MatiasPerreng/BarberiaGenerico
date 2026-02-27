import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import ServiciosList from "../../../components/ServiceList/ServiceList";
import MapEmbed from "../../../components/Map/MapEmbed";
import Footer from "../../../components/Footer/Footer";
import GalleryCarousel from "../../../components/Gallery/GalleryCarousel";
import ContactBar from "../../../components/Contact/ContactBar";
import "./Homepage.css";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Configuración del observador para el efecto de aparición (reveal)
    const observerOptions = {
      root: null,
      threshold: 0.1, // Se activa cuando el 10% de la sección es visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Dejamos de observar una vez que ya apareció
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Seleccionamos todas las secciones que deben aparecer al scrollear
    const revealSections = document.querySelectorAll(".reveal");
    revealSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleServicioSelect = (servicio) => {
    navigate("/agenda", { state: { servicio } });
  };

  return (
    <div className="homepage-main-container">
      <Navbar />

      {/* SECCIÓN HERO (Sin reveal para carga inmediata) */}
      <section className="hero-section">
        <div className="container text-center py-5">
          <img
            src="/logo.jpg"
            alt="King Barber"
            className="hero-logo mb-4"
          />

          <h1 className="display-5 fw-bold hero-title">
            KING BARBER
          </h1>

          <p className="lead">
            Degrades · Barba · Estilo · Reserva online
          </p>

          <a href="#servicios" className="btn btn-outline-light">
            Reservar turno
          </a>
        </div>
      </section>

      {/* SECCIÓN SERVICIOS (Con reveal) */}
      <section id="servicios" className="container py-5 reveal">
        <h2 className="services-title mb-4 text-center">Nuestros servicios</h2>
        <ServiciosList onSelectServicio={handleServicioSelect} />
      </section>

      {/* SECCIÓN TRABAJOS / GALERÍA (Con reveal) */}
      <section id="trabajos" className="reveal">
        <GalleryCarousel />
      </section>

      {/* SECCIÓN UBICACIÓN / MAPA (Con reveal) */}
      <section id="ubicacion" className="bg-light pt-5 pb-2 reveal">
        <div className="container">
          <MapEmbed />
        </div>
      </section>

      {/* SECCIÓN CONTACTO (Con reveal) */}
      <section id="contacto" className="contact-section pt-2 pb-5 reveal">
        <div className="container">
          <ContactBar />
        </div>
      </section>

      <Footer />
    </div>
  );
}
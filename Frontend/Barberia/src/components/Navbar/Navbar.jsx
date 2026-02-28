import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar-pro ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-left">
        <img src="./logoINFOCORE.png" alt="" />
      </div>

      <div className="nav-right">
        <a href="#servicios">Servicios</a>
        <a href="#ubicacion">Ubicación</a>
        <a href="#contacto">Contacto</a>
      </div>
    </nav>
  );
}

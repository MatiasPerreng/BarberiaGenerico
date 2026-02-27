import { useState } from "react";
import Footer from "../../Footer/Footer";
import SuccessModal from "../../SuccessModal/SuccessModal";
import DuplicateBookingModal from "../../DuplicateBookingModal/DuplicateBookingModal";
import "./AgendaForm.css";

const AgendaForm = ({ onSubmit, onVolver }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [duplicateMessage, setDuplicateMessage] = useState("");

  const validarEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarTelefono = (telefono) =>
    /^[0-9+\s-]{8,15}$/.test(telefono);

  const validate = () => {
    const newErrors = {};
    
    // Validación Nombre
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    
    // Validación Apellido
    if (!form.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
    
    // Validación Email (Opcional pero debe ser válido si se escribe)
    if (form.email.trim() && !validarEmail(form.email)) newErrors.email = "Email inválido";
    
    // 🔥 CAMBIO AQUÍ: Validación Teléfono OBLIGATORIO
    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!validarTelefono(form.telefono)) {
      newErrors.telefono = "Formato de teléfono inválido (8-15 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await onSubmit({
        ...form,
        email: form.email.trim() || null,
        telefono: form.telefono.trim(), // Ya no enviamos null porque es obligatorio
      });
      setShowSuccess(true);
    } catch (err) {
      const rawMessage = err?.response?.data?.detail || err?.message || "";
      
      const normalizedMessage = rawMessage
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (normalizedMessage.includes("segundos antes") || normalizedMessage.includes("alguien se agendo")) {
        setDuplicateMessage("¡Uy! Justo alguien se agendó ese turno segundos antes que vos. Por favor, selecciona otro horario.");
        setShowDuplicate(true);
      } 
      else if (normalizedMessage.includes("numero") || normalizedMessage.includes("posible realizar la reserva")) {
        setDuplicateMessage("Lo sentimos, no es posible realizar la reserva con este número.");
        setShowDuplicate(true);
      } 
      else if (normalizedMessage.includes("2 turnos reservados")) {
        setDuplicateMessage("Ya te agendaste dos veces, por hoy ya no podés más.");
        setShowDuplicate(true);
      } 
      else if (normalizedMessage.includes("un turno reservado") || normalizedMessage.includes("ya tenes un turno")) {
        setDuplicateMessage("Ya tienes una cita agendada para este día.");
        setShowDuplicate(true);
      } 
      else {
        alert("Ocurrió un error: " + rawMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="af-booking-overlay">
        <div className="af-booking-container">
          <aside className="af-booking-sidebar">
            <div className="af-logo">
              <img src="logo.jpg" alt="King Barber" />
            </div>

            <ul className="af-steps">
              <li className="af-step done">
                <span className="af-step-number">✓</span>
                <p className="af-step-text">Servicio</p>
              </li>
              <li className="af-step done">
                <span className="af-step-number">✓</span>
                <p className="af-step-text">Personal</p>
              </li>
              <li className="af-step done">
                <span className="af-step-number">✓</span>
                <p className="af-step-text">Fecha y hora</p>
              </li>
              <li className="af-step active">
                <span className="af-step-number">4</span>
                <p className="af-step-text">Información</p>
              </li>
            </ul>

            <div className="af-sidebar-footer">
              <p>¿Tenés alguna pregunta?</p>
              <small>099 611 465</small>
            </div>
          </aside>

          <section className="af-booking-content">
            <button className="af-btn-volver" onClick={onVolver}>
              ← Volver
            </button>

            <h3>Rellená la información</h3>

            <form className="af-form-grid" onSubmit={handleSubmit} noValidate>
              <div className="af-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "af-input-error" : ""}
                />
                {errors.email && <small className="af-error">{errors.email}</small>}
              </div>

              {/* 🔥 CAMBIO: Label con asterisco y validación activa */}
              <div className="af-form-group">
                <label>Teléfono *</label>
                <input
                  type="text"
                  name="telefono"
                  placeholder="Ej: 099123456"
                  value={form.telefono}
                  onChange={handleChange}
                  className={errors.telefono ? "af-input-error" : ""}
                />
                {errors.telefono && <small className="af-error">{errors.telefono}</small>}
              </div>

              <div className="af-form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className={errors.nombre ? "af-input-error" : ""}
                />
                {errors.nombre && <small className="af-error">{errors.nombre}</small>}
              </div>

              <div className="af-form-group">
                <label>Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className={errors.apellido ? "af-input-error" : ""}
                />
                {errors.apellido && <small className="af-error">{errors.apellido}</small>}
              </div>

              <div className="af-form-actions">
                <button type="submit" className="af-btn-confirmar" disabled={loading}>
                  {loading ? "Agendando..." : "Confirmar turno"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      <SuccessModal
        show={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          window.location.href = "/";
        }}
      />

      <DuplicateBookingModal
        show={showDuplicate}
        message={duplicateMessage} 
        onClose={() => setShowDuplicate(false)}
      />

      <Footer />
    </>
  );
};

export default AgendaForm;
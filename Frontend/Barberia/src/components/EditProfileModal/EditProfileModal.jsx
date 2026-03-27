import { useEffect, useState } from "react";
import API_URL from "../../services/api";
import "./EditProfileModal.css";

function EditProfileModal({ show, onClose, user, onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 SINCRONIZA CUANDO LLEGA USER
  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre,
        email: user.email,
      });
    }
  }, [user]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/perfil/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Error al actualizar perfil");
        return;
      }

      const data = await res.json();
      onSuccess(data);
      onClose();
    } catch {
      setError("No se pudo actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-card">
        <h3 className="edit-profile-title">Editar perfil</h3>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <input
            className="edit-profile-input"
            name="nombre"
            value={form.nombre}
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
            required
          />

          <input
            className="edit-profile-input"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="edit-profile-btn submit"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <div className="edit-profile-actions">
            <button
              type="button"
              className="edit-profile-btn cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;

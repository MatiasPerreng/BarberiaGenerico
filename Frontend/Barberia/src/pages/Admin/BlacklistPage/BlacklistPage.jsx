import { useState, useEffect } from "react";
import axios from "axios";
import "./BlacklistPage.css";

const BlacklistPage = () => {
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ telefono: "", motivo: "" });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const fetchBlacklist = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/blacklist`);
      setNumeros(res.data);
    } catch (err) {
      console.error("Error al cargar lista negra", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.telefono.trim()) return;

    try {
      await axios.post(`${API_URL}/admin/blacklist`, form);

      setForm({ telefono: "", motivo: "" });
      fetchBlacklist();

      alert("Número bloqueado correctamente");
    } catch (err) {
      alert(err.response?.data?.detail || "Error al bloquear número");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Desbloquear este número?")) return;

    try {
      await axios.delete(`${API_URL}/admin/blacklist/${id}`);
      fetchBlacklist();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="blacklist-container">
      
      {/* HEADER */}
      <header className="blacklist-header">
        <h2>🚫 Lista Negra</h2>
        <p>
          Los números bloqueados no podrán realizar reservas en el sistema.
        </p>
      </header>

      {/* FORM */}
      <section className="blacklist-form-card">
        <form onSubmit={handleAdd} className="blacklist-form">

          <div className="blacklist-field">
            <label>Teléfono</label>
            <input
              type="text"
              placeholder="Ej: 099123456"
              value={form.telefono}
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
              className="blacklist-input"
              required
            />
          </div>

          <div className="blacklist-field">
            <label>Motivo</label>
            <input
              type="text"
              placeholder="Ej: No se presenta a las citas"
              value={form.motivo}
              onChange={(e) =>
                setForm({ ...form, motivo: e.target.value })
              }
              className="blacklist-input"
            />
          </div>

          <button type="submit" className="blacklist-btn-add">
            Bloquear
          </button>

        </form>
      </section>

      {/* TABLE */}
      <section className="blacklist-table-box">
        {loading ? (
          <div className="blacklist-empty">Cargando lista...</div>
        ) : (
          <table className="blacklist-table">
            <thead>
              <tr>
                <th>Teléfono</th>
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {numeros.length > 0 ? (
                numeros.map((n) => (
                  <tr key={n.id} className="blacklist-row">

                    <td
                      className="blacklist-phone"
                      data-label="Teléfono"
                    >
                      {n.telefono}
                    </td>

                    <td data-label="Motivo">
                      {n.motivo || (
                        <span className="blacklist-empty-reason">
                          Sin motivo
                        </span>
                      )}
                    </td>

                    <td data-label="Fecha">
                      {new Date(n.created_at).toLocaleDateString()}
                    </td>

                    <td
                      className="blacklist-actions"
                      data-label="Acción"
                    >
                      <button
                        className="blacklist-btn-remove"
                        onClick={() => handleDelete(n.id)}
                      >
                        Desbloquear
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="blacklist-empty">
                    No hay números bloqueados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default BlacklistPage;
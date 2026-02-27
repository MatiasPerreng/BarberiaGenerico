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
    if (window.confirm("¿Estás seguro de que deseas desbloquear este número?")) {
      try {
        await axios.delete(`${API_URL}/admin/blacklist/${id}`);
        fetchBlacklist();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div className="blist-page-container">
      <header className="blist-header">
        <h2>🚫 Lista Negra</h2>
        <p>Los números en esta lista no podrán realizar reservas en el sistema.</p>
      </header>

      <section className="blist-card-form">
        <form onSubmit={handleAdd} className="blist-form">
          <div className="blist-form-group">
            <label>Teléfono</label>
            <input
              type="text"
              placeholder="Ej: 099123456"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              required
            />
          </div>
          <div className="blist-form-group">
            <label>Motivo del bloqueo</label>
            <input
              type="text"
              placeholder="Ej: No se presenta a las citas"
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            />
          </div>
          <button type="submit" className="blist-btn-primary">
            Bloquear Número
          </button>
        </form>
      </section>

      <section className="blist-table-wrapper">
        {loading ? (
          <div className="blist-loading">Cargando lista...</div>
        ) : (
          <table className="blist-table">
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
                  <tr key={n.id} className="blist-row">
                    <td className="blist-tel-cell" data-label="Teléfono">
                      {n.telefono}
                    </td>
                    <td data-label="Motivo">
                      {n.motivo || <span className="blist-no-reason">Sin motivo</span>}
                    </td>
                    <td data-label="Fecha">
                      {new Date(n.created_at).toLocaleDateString()}
                    </td>
                    <td className="blist-actions-cell">
                      <button 
                        className="blist-btn-danger" 
                        onClick={() => handleDelete(n.id)}
                      >
                        Desbloquear
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="blist-empty">No hay números bloqueados.</td>
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
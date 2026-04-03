import { useState, useEffect } from "react";
import { apiFetch } from "../../../services/apiClient";
import "./BlacklistPage.css";

const BlacklistPage = () => {
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ telefono: "", motivo: "" });

  const fetchBlacklist = async () => {
    try {
      const res = await apiFetch("/admin/blacklist");
      const data = await res.json();
      if (res.ok) setNumeros(data);
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
      const res = await apiFetch("/admin/blacklist", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al bloquear número");
      setForm({ telefono: "", motivo: "" });
      fetchBlacklist();
      alert("Número bloqueado correctamente");
    } catch (err) {
      alert(err.message || "Error al bloquear número");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas desbloquear este número?")) {
      try {
        const res = await apiFetch(`/admin/blacklist/${id}`, { method: "DELETE" });
        if (res.ok) fetchBlacklist();
        else alert("Error al eliminar");
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div className="blist-page-root admin-kb-page blist-page-container">
      <header className="blist-header">
        <h2 className="kb-page-title">Lista negra</h2>
        <p className="blist-header-subtitle">
          Los números bloqueados no podrán reservar turnos en el sistema.
        </p>
      </header>

      <section className="blist-card-form" aria-labelledby="blist-form-heading">
        <h3 id="blist-form-heading" className="blist-section-title">
          Bloquear número
        </h3>
        <form onSubmit={handleAdd} className="blist-form">
          <div className="blist-form-group">
            <label htmlFor="blist-tel">Teléfono</label>
            <input
              id="blist-tel"
              type="text"
              placeholder="Ej: 099123456"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              required
              autoComplete="tel"
            />
          </div>
          <div className="blist-form-group">
            <label htmlFor="blist-motivo">Motivo (opcional)</label>
            <input
              id="blist-motivo"
              type="text"
              placeholder="Ej: Inasistencias repetidas"
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            />
          </div>
          <button type="submit" className="blist-btn-primary">
            Bloquear número
          </button>
        </form>
      </section>

      <section className="blist-table-section" aria-labelledby="blist-list-heading">
        <h3 id="blist-list-heading" className="blist-section-title blist-section-title--table">
          Números bloqueados
        </h3>
        <div className="blist-table-wrapper">
        {loading ? (
          <div className="blist-loading" role="status">
            Cargando lista…
          </div>
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
        </div>
      </section>
    </div>
  );
};

export default BlacklistPage;
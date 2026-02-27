import { useState, useEffect } from "react";
import axios from "axios";

export default function BlacklistPanel() {
  const [numeros, setNumeros] = useState([]);
  const [form, setForm] = useState({ telefono: "", motivo: "" });

  // Cargar lista al inicio
  const fetchBlacklist = async () => {
    const res = await axios.get("/admin/blacklist");
    setNumeros(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/blacklist", form);
      setForm({ telefono: "", motivo: "" }); // Limpiar
      fetchBlacklist(); // Recargar
      alert("Número bloqueado");
    } catch (err) {
      alert("Error al bloquear");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Desbloquear este número?")) {
      await axios.delete(`/admin/blacklist/${id}`);
      fetchBlacklist();
    }
  };

  useEffect(() => { fetchBlacklist(); }, []);

  return (
    <div className="blacklist-container">
      <h3>🚫 Gestión de Lista Negra</h3>
      
      <form onSubmit={handleAdd} className="blacklist-form">
        <input 
          placeholder="Teléfono (ej: 095...)" 
          value={form.telefono}
          onChange={e => setForm({...form, telefono: e.target.value})}
          required 
        />
        <input 
          placeholder="Motivo (opcional)" 
          value={form.motivo}
          onChange={e => setForm({...form, motivo: e.target.value})}
        />
        <button type="submit">Bloquear</button>
      </form>

      <table className="blacklist-table">
        <thead>
          <tr>
            <th>Teléfono</th>
            <th>Motivo</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {numeros.map(n => (
            <tr key={n.id}>
              <td>{n.telefono}</td>
              <td>{n.motivo}</td>
              <td>
                <button onClick={() => handleDelete(n.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import BarberoForm from "../../../components/Admin/BarberoForm/BarberoForm";
import "./BarberosPage.css";

import {
  getBarberos,
  crearBarbero,
  toggleBarbero,
  subirFotoBarbero,
  eliminarBarbero,
  crearCuentaBarbero,
  asignarDescansoBarbero, // Importado para el descanso
} from "../../../services/barberos";

import API_URL from "../../../services/api";

const BarberosPage = () => {
  const [barberos, setBarberos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [alertError, setAlertError] = useState(null);

  /* =========================
      FOTO
  ========================= */
  const fileInputRef = useRef(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [barberoFotoTargetId, setBarberoFotoTargetId] = useState(null);

  /* =========================
      CREAR ACCESO
  ========================= */
  const [accountTarget, setAccountTarget] = useState(null);
  const [accountForm, setAccountForm] = useState({
    email: "",
    password: "",
    rol: "barbero",
  });

  /* =========================
      DESCANSO
  ========================= */
  const [breakTarget, setBreakTarget] = useState(null);
  const [breakForm, setBreakForm] = useState({ inicio: "", fin: "" });

  /* =========================
      LOAD BARBEROS
  ========================= */
  const loadBarberos = async () => {
    try {
      const data = await getBarberos();
      setBarberos((prev) =>
        data.map((b) => {
          const prevB = prev.find((p) => p.id_barbero === b.id_barbero);
          return {
            ...b,
            _fotoUpdatedAt: prevB?._fotoUpdatedAt || 0,
          };
        })
      );
    } catch {
      setError("No se pudieron cargar los barberos");
    }
  };

  useEffect(() => {
    loadBarberos();
  }, []);

  /* =========================
      CRUD BARBERO
  ========================= */
  const handleCreate = async (data) => {
    try {
      const nuevoBarbero = await crearBarbero(data);
      return nuevoBarbero;
    } catch (err) {
      setAlertError("Error al crear el barbero en el servidor");
      throw err;
    }
  };

  const handleToggle = async (barbero) => {
    setBarberos((prev) =>
      prev.map((b) =>
        b.id_barbero === barbero.id_barbero
          ? { ...b, activo: !b.activo }
          : b
      )
    );

    try {
      await toggleBarbero(barbero.id_barbero);
    } catch {
      loadBarberos();
    }
  };

  const handleDelete = async (barbero) => {
    if (!window.confirm(`¿Eliminar a ${barbero.nombre}?`)) return;
    try {
      await eliminarBarbero(barbero.id_barbero);
      loadBarberos();
    } catch (err) {
      setAlertError(
        err?.message ||
          "No se puede eliminar el barbero, tiene datos asociados."
      );
    }
  };

  /* =========================
      FOTO
  ========================= */
  const handleSelectFoto = (barbero) => {
    setBarberoFotoTargetId(barbero.id_barbero);
    setFileInputKey((k) => k + 1);
    setTimeout(() => fileInputRef.current?.click(), 10);
  };

  const handleUploadFoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !barberoFotoTargetId) return;

    try {
      const res = await subirFotoBarbero(barberoFotoTargetId, file);
      const ts = Date.now();

      setBarberos((prev) =>
        prev.map((b) =>
          b.id_barbero === barberoFotoTargetId
            ? {
                ...b,
                foto_url: res?.foto_url || b.foto_url,
                _fotoUpdatedAt: ts,
              }
            : b
        )
      );
    } catch {
      setAlertError("No se pudo actualizar la imagen.");
    } finally {
      setBarberoFotoTargetId(null);
    }
  };

  /* =========================
      CREAR ACCESO
  ========================= */
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await crearCuentaBarbero(accountTarget.id_barbero, {
        email: accountForm.email,
        password: accountForm.password,
        rol: accountForm.rol,
      });

      setAccountTarget(null);
      setAccountForm({ email: "", password: "", rol: "barbero" });
      loadBarberos();
    } catch (err) {
      setAlertError(err.message || "Error al crear el acceso");
    }
  };

  /* =========================
      MANEJO DE DESCANSO
  ========================= */
  const handleSaveBreak = async (e) => {
    e.preventDefault();
    try {
      await asignarDescansoBarbero(breakTarget.id_barbero, {
        descanso_inicio: breakForm.inicio,
        descanso_fin: breakForm.fin,
      });
      setBreakTarget(null);
      loadBarberos();
    } catch (err) {
      setAlertError(err.message || "Error al asignar descanso");
    }
  };

  return (
    <div className="barberos-page-container admin-kb-page">
      <div className="barberos-header">
        <h2 className="kb-page-title">Barberos</h2>
        <button
          className="barberos-btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Nuevo barbero
        </button>
      </div>

      {error && <p className="barberos-error">{error}</p>}

      <div className="barberos-list">
        {barberos.map((b) => (
          <div className="barberos-row" key={b.id_barbero}>
            <div className="barberos-avatar-wrap">
              <img
                className="barberos-avatar"
                src={
                  b.foto_url
                    ? `${API_URL}${b.foto_url}?v=${b._fotoUpdatedAt || 0}`
                    : "/avatar-placeholder.png"
                }
                alt={b.nombre}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="barberos-info">
              <strong>{b.nombre}</strong>
              <div className="barberos-descanso-tag">
                {b.descanso_inicio
                  ? `Descanso: ${b.descanso_inicio} - ${b.descanso_fin}`
                  : "Sin descanso"}
              </div>
            </div>

            <span className={`barberos-status ${b.activo ? "active" : "inactive"}`}>
              {b.activo ? "Activo" : "Inactivo"}
            </span>

            <div className="barberos-actions">
              <button onClick={() => handleToggle(b)}>
                {b.activo ? "Desactivar" : "Activar"}
              </button>

              <button onClick={() => handleSelectFoto(b)}>Cambiar foto</button>

              <button onClick={() => {
                setBreakTarget(b);
                setBreakForm({ inicio: b.descanso_inicio || "13:00", fin: b.descanso_fin || "14:00" });
              }}>
                Descanso
              </button>

              {!b.tiene_usuario && (
                <button onClick={() => setAccountTarget(b)}>
                  Crear acceso
                </button>
              )}

              <button className="danger" onClick={() => handleDelete(b)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <BarberoForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            loadBarberos();
          }}
        />
      )}

      {/* MODAL DESCANSO */}
      {breakTarget && (
        <div className="barberos-access-modal-overlay">
          <div className="barberos-access-modal-card">
            <h3 className="barberos-access-modal-title">Horario de Descanso</h3>
            <p className="barberos-access-modal-text">Asignar pausa para <strong>{breakTarget.nombre}</strong></p>
            <form onSubmit={handleSaveBreak} className="barberos-access-modal-form">
              <label className="barberos-modal-field-label">Inicio</label>
              <input type="time" required value={breakForm.inicio} onChange={e => setBreakForm({...breakForm, inicio: e.target.value})} />
              
              <label className="barberos-modal-field-label barberos-modal-field-label--spaced">Fin</label>
              <input type="time" required value={breakForm.fin} onChange={e => setBreakForm({...breakForm, fin: e.target.value})} />
              
              <div className="barberos-access-modal-actions">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setBreakTarget(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR ACCESO */}
      {accountTarget && (
        <div className="barberos-access-modal-overlay">
          <div className="barberos-access-modal-card">
            <h3 className="barberos-access-modal-title">Crear acceso</h3>
            <p className="barberos-access-modal-text">
              Barbero: <strong>{accountTarget.nombre}</strong>
            </p>
            <form className="barberos-access-modal-form" onSubmit={handleCreateAccount}>
              <input
                type="email"
                placeholder="Email"
                required
                value={accountForm.email}
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Contraseña"
                required
                value={accountForm.password}
                onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
              />
              <select
                value={accountForm.rol}
                onChange={(e) => setAccountForm({ ...accountForm, rol: e.target.value })}
              >
                <option value="barbero">Barbero</option>
                <option value="admin">Admin</option>
              </select>
              <div className="barberos-access-modal-actions">
                <button type="button" onClick={() => setAccountTarget(null)}>Cancelar</button>
                <button type="submit">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILE INPUT OCULTO */}
      <input
        key={fileInputKey}
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleUploadFoto}
      />

      {alertError && (
        <div className="success-modal-overlay">
          <div className="success-modal-card">
            <h2 className="success-modal-title">Atención</h2>
            <p className="success-modal-text">{alertError}</p>
            <button
              className="success-modal-btn-confirm"
              onClick={() => setAlertError(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarberosPage;
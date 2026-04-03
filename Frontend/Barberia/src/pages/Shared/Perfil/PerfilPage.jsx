import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../../auth/AuthContext";
import ChangePasswordModal from "../../../components/ChangePasswordModal/ChangePasswordModal";
import EditProfileModal from "../../../components/EditProfileModal/EditProfileModal";
import "./PerfilPage.css";

const PerfilPage = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const { user, updateUser } = useAuthContext();
  const [showPassModal, setShowPassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) return null;

  return (
    <div
      className={`perfil-page-root ${isAdmin ? "admin-kb-page" : ""}`.trim()}
    >
      <header className="perfil-header">
        <h2 className="perfil-title kb-page-title">Mi perfil</h2>
      </header>

      <div className="perfil-card">
        <div className="perfil-row">
          <span className="perfil-label">Nombre</span>
          <span className="perfil-value">{user.nombre}</span>
        </div>

        <div className="perfil-row">
          <span className="perfil-label">Email</span>
          <span className="perfil-value">{user.email}</span>
        </div>
      </div>

      <div className="perfil-actions">
        <button
          type="button"
          className="perfil-action-btn perfil-action-btn--primary"
          onClick={() => setShowEditModal(true)}
        >
          Cambiar nombre / email
        </button>

        <button
          type="button"
          className="perfil-action-btn perfil-action-btn--secondary"
          onClick={() => setShowPassModal(true)}
        >
          Cambiar contraseña
        </button>
      </div>

      <EditProfileModal
        show={showEditModal}
        user={user}
        onClose={() => setShowEditModal(false)}
        onSuccess={(data) => {
          updateUser({
            nombre: data.nombre,
            email: data.email,
          });
        }}
      />

      <ChangePasswordModal
        show={showPassModal}
        onClose={() => setShowPassModal(false)}
      />
    </div>
  );
};

export default PerfilPage;

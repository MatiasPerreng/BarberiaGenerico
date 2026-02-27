import { useState } from "react";
import { useAuthContext } from "../../../auth/AuthContext";
import ChangePasswordModal from "../../../components/ChangePasswordModal/ChangePasswordModal";
import EditProfileModal from "../../../components/EditProfileModal/EditProfileModal";
import "./PerfilPage.css";

const PerfilPage = () => {
  const { user, updateUser } = useAuthContext();
  const [showPassModal, setShowPassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) return null;

  return (
    <div className="perfil-page">
      <h2 className="perfil-title">Mi perfil</h2>

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
          className="perfil-action-btn"
          onClick={() => setShowEditModal(true)}
        >
          Cambiar nombre / email
        </button>

        <button
          className="perfil-action-btn"
          onClick={() => setShowPassModal(true)}
        >
          Cambiar contraseña
        </button>
      </div>

      {/* MODAL EDITAR PERFIL */}
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

      {/* MODAL PASSWORD */}
      <ChangePasswordModal
        show={showPassModal}
        onClose={() => setShowPassModal(false)}
      />
    </div>
  );
};

export default PerfilPage;

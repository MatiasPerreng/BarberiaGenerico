import "./AdminHeader.css";

const AdminHeader = ({ title, actionLabel, onAction }) => {
  return (
    <div className="admin-header-root">
      <h2 className="admin-header-title">
        {title}
      </h2>

      {actionLabel && (
        <button
          className="admin-header-action-btn"
          onClick={onAction}
        >
          + {actionLabel}
        </button>
      )}
    </div>
  );
};

export default AdminHeader;

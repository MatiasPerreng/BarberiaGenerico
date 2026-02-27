import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-brand">
          © {new Date().getFullYear()}
        </span>

        <span className="footer-separator">·</span>

        <span className="footer-dev">
          Developed by <strong>Matias Perreng</strong>
        </span>
      </div>
    </footer>
  );
}

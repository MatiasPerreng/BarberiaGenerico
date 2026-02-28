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
          Developed by <strong>INFOCORE SOLUTIONS</strong>
        </span>
      </div>
    </footer>
  );
}

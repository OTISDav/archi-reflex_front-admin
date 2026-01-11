import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Séparateur en haut */}
      <div className="footer-top-separator"></div>

      <div className="footer-inner">
        {/* Adresse */}
        <div className="footer-block">
          <p>20 Rue jean,</p>
          <p>123000 paris</p>
        </div>

        {/* Contact */}
        <div className="footer-block">
          <p>034 73 00</p>
          <p>
            <a href="mailto:contact@archi-reflex.com">
              contact@archi-reflex.com
            </a>
          </p>
        </div>

        {/* Liens légaux */}
        <div className="footer-block footer-links">
          <a href="#">Mentions légales</a>
          <span>–</span>
          <a href="#">Confidentialité</a>
          <span>–</span>
          <a href="#">Cookies</a>
        </div>
      </div>

      {/* Crédit */}
      <div className="footer-credit">
        Fait avec amour par <span>Numéria Communication</span>
      </div>
    </footer>
  );
}

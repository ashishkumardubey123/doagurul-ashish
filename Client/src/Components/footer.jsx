import { Link } from "react-router-dom";
import CLogo from "../assets/images/CLogo.png";

function Footer() {
  const year = new Date().getFullYear();

  const footerLinks = [
    { name: "About", href: "https://doaguru.com/about_us" },
    { name: "Privacy Policy", href: "https://doaguru.com/privacy-policy" },
    { name: "Terms & Conditions", href: "https://doaguru.com/terms-&-condition" },
    { name: "Contact", href: "https://doaguru.com/contact_us" },
  ];

  return (
    <footer className="dg-footer">
      <div className="dg-footer-inner">
        <div className="dg-footer-top">
          <Link
            to="https://doaguru.com/"
            target="_blank"
            rel="noreferrer"
            className="dg-footer-brand"
          >
            <img src={CLogo} alt="DOAGuru Infosystem" />
            <span className="dg-footer-brand-name">DOAGuru Infosystem</span>
          </Link>

          <ul className="dg-footer-links">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.href} target="_blank" rel="noreferrer">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="dg-footer-divider" />

        <div className="dg-footer-bottom">
          <span className="dg-footer-copy">
            © {year}{" "}
            <Link to="https://doaguru.com/" target="_blank" rel="noreferrer">
              DOAGuru Infosystem
            </Link>
            . All Rights Reserved.
          </span>

          <span className="dg-footer-badge">
            <span style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10b981",
            }} />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

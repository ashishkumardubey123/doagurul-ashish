import CLogo from "../assets/images/CLogo.png";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  {
    name: "Generate Letter",
    href: "#",
    subMenu: [
      {
        name: "🎓 Intern",
        subMenu: [
          { name: "Offer Letter", href: "/intern-offer-letter" },
          { name: "Experience Letter", href: "/intern-experience-letter" },
          { name: "Other Letters", href: "/intern-other-letters" },
        ],
      },
      {
        name: "👔 Employee",
        subMenu: [
          { name: "Offer Letter", href: "/Offer-Letter-Genrate" },
          { name: "Experience Letter", href: "/Experince-Letter-Genrate" },
          { name: "Relieving Letter", href: "/Relieving-Letter-Genrate" },
          { name: "Termination Letter", href: "/Termination-Letter-Genrate" },
          { name: "Warning Letter", href: "/Warning-Letter-Genrate" },
          { name: "Salary Slip", href: "/salary-slip" },
        ],
      },
    ],
  },
  {
    name: "Download Letter",
    href: "#",
    subMenu: [
      {
        name: "🎓 Intern Letters",
        subMenu: [
          { name: "Download Offer Letter", href: "/download/intern-offer-letter" },
          { name: "Download Experience Letter", href: "/download/intern-experience-letter" },
        ],
      },
      {
        name: "👔 Employee Letters",
        subMenu: [
          { name: "Download Offer Letter", href: "/download/offer-letter" },
          { name: "Download Experience Letter", href: "/download/experience-letter" },
          { name: "Download Relieving Letter", href: "/download/relieving-letter" },
          { name: "Download Termination Letter", href: "/download/termination-letter" },
          { name: "Download Salary Slip", href: "/download/salary-slip" },
        ],
      },
    ],
  },
  { name: "Report", href: "/report" },
];

// SVG Icons
const ChevronDown = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SignOutIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function Navbar() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState("User");
  const [openMenu, setOpenMenu] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setUserName(user?.full_name || "DG");
      } catch {
        setUserName("DG");
      }
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setShowProfile(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpenMenu(null);
    setShowProfile(false);
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/");
  };

  const isActive = (href) => location.pathname === href;

  if (!token) return null;

  return (
    <nav className="dg-navbar" ref={navRef}>
      <div className="dg-navbar-inner">
        {/* Logo */}
        <Link to="/dashboard" className="dg-navbar-logo">
          <img src={CLogo} alt="DOAGuru" />
          <span className="dg-navbar-logo-text">DOAGuru</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="dg-nav-links">
          {navigation.map((item) => {
            if (!item.subMenu) {
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`dg-nav-link ${isActive(item.href) ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              );
            }

            return (
              <div key={item.name} className="dg-nav-dropdown">
                <button
                  className={`dg-nav-link ${openMenu === item.name ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === item.name ? null : item.name);
                  }}
                >
                  {item.name}
                  <span style={{
                    transition: "transform 0.2s",
                    transform: openMenu === item.name ? "rotate(180deg)" : "rotate(0deg)",
                    display: "flex",
                  }}>
                    <ChevronDown />
                  </span>
                </button>

                {openMenu === item.name && (
                  <div className="dg-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    {item.subMenu.map((subItem) => (
                      <div key={subItem.name} style={{ position: "relative" }}>
                        {subItem.subMenu ? (
                          <div className="dg-dropdown-item dg-dropdown-item-parent">
                            <span>{subItem.name}</span>
                            <ChevronRight />
                            <div className="dg-sub-dropdown">
                              {subItem.subMenu.map((child) => (
                                <Link
                                  key={child.name}
                                  to={child.href}
                                  className="dg-dropdown-item"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={subItem.href}
                            className="dg-dropdown-item"
                            onClick={() => setOpenMenu(null)}
                          >
                            {subItem.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="dg-navbar-right">
          <span className="dg-user-greeting">
            Hello, <span>{userName}</span>
          </span>

          {/* Avatar / Profile */}
          <div style={{ position: "relative" }}>
            <button
              className="dg-avatar-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfile(!showProfile);
              }}
              aria-label="User menu"
            >
              <img
                src="https://doaguru.com/static/media/doagurulogo-removebg.b0126812bbe704a27f8f.webp"
                alt="Profile"
              />
            </button>

            {showProfile && (
              <div className="dg-profile-menu" onClick={(e) => e.stopPropagation()}>
                <div style={{
                  padding: "0.625rem 0.875rem 0.5rem",
                  borderBottom: "1px solid var(--border-subtle)",
                  marginBottom: "0.25rem",
                }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{userName}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Administrator</p>
                </div>
                <Link
                  to="#"
                  className="dg-profile-menu-item"
                  onClick={() => setShowProfile(false)}
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="dg-profile-menu-item danger"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <SignOutIcon />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="dg-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`dg-mobile-menu ${mobileOpen ? "open" : ""}`}>
        {navigation.map((item) => {
          if (!item.subMenu) {
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`dg-nav-link ${isActive(item.href) ? "active" : ""}`}
                style={{ width: "100%", justifyContent: "flex-start" }}
              >
                {item.name}
              </Link>
            );
          }

          return (
            <div key={item.name}>
              <button
                className="dg-nav-link"
                style={{ width: "100%", justifyContent: "space-between" }}
                onClick={() => setOpenMenu(openMenu === item.name ? null : item.name)}
              >
                {item.name}
                <span style={{
                  transition: "transform 0.2s",
                  transform: openMenu === item.name ? "rotate(180deg)" : "rotate(0deg)",
                  display: "flex",
                }}>
                  <ChevronDown />
                </span>
              </button>

              {openMenu === item.name && (
                <div style={{
                  paddingLeft: "1rem",
                  borderLeft: "2px solid var(--border-medium)",
                  marginLeft: "0.875rem",
                  marginTop: "0.25rem",
                  marginBottom: "0.25rem",
                }}>
                  {item.subMenu.map((subItem) =>
                    subItem.subMenu ? (
                      <div key={subItem.name}>
                        <p style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "var(--primary-light)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          padding: "0.5rem 0.875rem 0.25rem",
                        }}>
                          {subItem.name}
                        </p>
                        {subItem.subMenu.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="dg-nav-link"
                            style={{ width: "100%", justifyContent: "flex-start" }}
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className="dg-nav-link"
                        style={{ width: "100%", justifyContent: "flex-start" }}
                        onClick={() => setMobileOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ height: "1px", background: "var(--border-subtle)", margin: "0.25rem 0" }} />

        <button
          onClick={handleLogout}
          className="dg-nav-link"
          style={{
            width: "100%",
            justifyContent: "flex-start",
            color: "var(--accent)",
            gap: "0.5rem",
          }}
        >
          <SignOutIcon />
          Sign Out
        </button>
      </div>

      <style>{`
        .dg-dropdown-item-parent:hover .dg-sub-dropdown {
          display: block !important;
        }
      `}</style>
    </nav>
  );
}

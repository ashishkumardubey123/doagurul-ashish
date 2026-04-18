import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Icon components
const UsersIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChartIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const quickActions = [
  {
    label: "Offer Letter",
    href: "/Offer-Letter-Genrate",
    icon: "📄",
    bg: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))",
    border: "rgba(99,102,241,0.3)",
    delay: "0.1s",
  },
  {
    label: "Internship Letter",
    href: "/intern-offer-letter",
    icon: "🎓",
    bg: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(14,165,233,0.05))",
    border: "rgba(14,165,233,0.3)",
    delay: "0.15s",
  },
  {
    label: "Relieving Letter",
    href: "/Relieving-Letter-Genrate",
    icon: "🤝",
    bg: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
    border: "rgba(16,185,129,0.3)",
    delay: "0.2s",
  },
  {
    label: "Warning Letter",
    href: "/Warning-Letter-Genrate",
    icon: "⚠️",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))",
    border: "rgba(245,158,11,0.3)",
    delay: "0.25s",
  },
  {
    label: "Termination Letter",
    href: "/Termination-Letter-Genrate",
    icon: "📋",
    bg: "linear-gradient(135deg, rgba(244,63,94,0.2), rgba(244,63,94,0.05))",
    border: "rgba(244,63,94,0.3)",
    delay: "0.3s",
  },
  {
    label: "Experience Letter",
    href: "/Experince-Letter-Genrate",
    icon: "🏆",
    bg: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))",
    border: "rgba(139,92,246,0.3)",
    delay: "0.35s",
  },
  {
    label: "Salary Slip",
    href: "/salary-slip",
    icon: "💰",
    bg: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))",
    border: "rgba(99, 102, 241, 0.3)",
    delay: "0.4s",
  },
  {
    label: "View Letters",
    href: "/OfferLetter",
    icon: "👁️",
    bg: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(14,165,233,0.05))",
    border: "rgba(14,165,233,0.3)",
    delay: "0.45s",
  },
];

function HomePage() {
  const [offerLetters, setOfferLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferLetters = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/offer-letters`
        );
        setOfferLetters(response.data);
      } catch (error) {
        console.error("Failed to fetch offer letters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfferLetters();
  }, []);

  // Sirf real API data use hoga — koi bhi number hardcode nahi hai
  const totalLetters = loading ? "..." : offerLetters.length;

  const stats = [
    {
      icon: <DocumentIcon />,
      iconBg: "blue",
      iconColor: "#38bdf8",
      number: totalLetters,
      label: "Total Generated Letters",
      change: "All time records",
      href: "/download/offer-letter",
      delay: "0.1s",
    },
    {
      icon: <UsersIcon />,
      iconBg: "purple",
      iconColor: "#818cf8",
      number: loading ? "..." : offerLetters.filter((l) => {
        if (!l.createdAt) return true; // fallback
        const d = new Date(l.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      label: "Generated This Month",
      change: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      href: "/download/offer-letter",
      delay: "0.15s",
    },
    {
      icon: <ChartIcon />,
      iconBg: "green",
      iconColor: "#34d399",
      number: loading ? "..." : offerLetters.filter((l) => l.designation).length,
      label: "With Designation Set",
      change: "Of total letters",
      href: "/download/offer-letter",
      delay: "0.2s",
    },
    {
      icon: <ClockIcon />,
      iconBg: "amber",
      iconColor: "#fbbf24",
      number: loading ? "..." : offerLetters.filter((l) => {
        if (!l.createdAt) return false;
        const d = new Date(l.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 7;
      }).length,
      label: "Recent Generations",
      change: "Last 7 days",
      href: "/download/offer-letter",
      delay: "0.25s",
    },
  ];

  return (
    <div className="dg-dashboard">
      {/* Header */}
      <div className="dg-dashboard-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--primary-light)",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--primary-light)", animation: "pulse-glow 2s infinite" }} />
              Live Dashboard
            </div>
            <h1 className="dg-dashboard-title">Welcome back, <span className="gradient-text">DOAGuru</span> 👋</h1>
            <p className="dg-dashboard-subtitle">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem" }}>
            <Link
              to="/Offer-Letter-Genrate"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.625rem 1.25rem",
                background: "var(--gradient-primary)",
                borderRadius: "var(--radius-md)",
                color: "white", fontSize: "0.875rem", fontWeight: 600,
                textDecoration: "none", transition: "var(--transition)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(99,102,241,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <PlusIcon />
              New Letter
            </Link>
            <Link
              to="/download/offer-letter"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.625rem 1.25rem",
                background: "var(--bg-glass)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600,
                textDecoration: "none", transition: "var(--transition)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = ""; e.currentTarget.style.borderColor = ""; }}
            >
              <DownloadIcon />
              Downloads
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dg-stats-grid">
        {stats.map((stat, i) => (
          <Link
            key={i}
            to={stat.href || "#"}
            className="dg-stat-card"
            style={{ animationDelay: stat.delay, textDecoration: "none" }}
          >
            <div className={`dg-stat-icon ${stat.iconBg}`} style={{ color: stat.iconColor }}>
              {stat.icon}
            </div>
            <p className="dg-stat-number">{stat.number}</p>
            <p className="dg-stat-label">{stat.label}</p>
            <span className="dg-stat-change up">↑ {stat.change}</span>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="dg-section-title">⚡ Quick Actions</h2>
      <div className="dg-actions-grid">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            to={action.href}
            className="dg-action-card"
            style={{ animationDelay: action.delay, textDecoration: "none" }}
          >
            <div
              className="dg-action-icon"
              style={{
                background: action.bg,
                border: `1px solid ${action.border}`,
                fontSize: "1.6rem",
              }}
            >
              {action.icon}
            </div>
            <p className="dg-action-label">{action.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <h2 className="dg-section-title">📊 Overview</h2>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "0.75rem",
        minHeight: "160px",
        animation: "fadeInUp 0.6s ease backwards",
        animationDelay: "0.5s",
      }}>
        <div style={{ fontSize: "2.5rem" }}>📈</div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", fontWeight: 500 }}>
          {loading ? "Loading data..." : `${offerLetters.length} letters generated so far`}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
          Activity analytics coming soon
        </p>
      </div>
    </div>
  );
}

export default HomePage;

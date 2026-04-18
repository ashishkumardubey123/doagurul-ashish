import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewOfferLettersPage = () => {
  const [offerLetters, setOfferLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOfferLetters = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offer-letters`);
        setOfferLetters(response.data);
      } catch (error) {
        console.error('Failed to fetch offer letters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfferLetters();
  }, []);

  const handleDownload = (id) => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/api/download-pdf/${id}`, '_blank');
  };

  const filtered = offerLetters.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.designation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dg-page-container" style={{ maxWidth: '1100px' }}>
      {/* Header */}
      <div className="dg-page-header">
        <span className="dg-page-tag">📋 Records</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className="dg-page-title">Offer Letters</h1>
          <Link
            to="/Offer-Letter-Genrate"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: 'white', fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            + New Offer Letter
          </Link>
        </div>
      </div>

      {/* Search + Table Card */}
      <div className="dg-form-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Search Bar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem', padding: 0 }}>✕</button>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
              <p>Loading records...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No records found</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {search ? 'Try adjusting your search' : 'Generate your first offer letter to get started'}
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                  {['#', 'Candidate Name', 'Designation', 'Joining Date', 'Offer Date', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '0.875rem 1.25rem', textAlign: 'left',
                      fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((letter, idx) => (
                  <tr
                    key={letter.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'rgba(99,102,241,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-light)',
                          flexShrink: 0,
                        }}>
                          {letter.name ? letter.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {letter.name || '—'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '0.2rem 0.625rem',
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: '9999px',
                        fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-light)',
                      }}>
                        {letter.designation || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {letter.joiningDate || '—'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {letter.offerReleaseDate || '—'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleDownload(letter.id)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                            borderRadius: '6px', color: '#10b981',
                            cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                            transition: 'all 0.2s', whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                        >
                          ⬇ Download
                        </button>
                        <Link
                          to={`/Offer-Letter-Genrate/${letter.id}`}
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                            borderRadius: '6px', color: 'var(--primary-light)',
                            textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600,
                            transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.18)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                        >
                          ✏ Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOfferLettersPage;

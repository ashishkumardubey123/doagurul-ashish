import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Loader2, Inbox, Eye } from 'lucide-react';

const DownloadInternOfferLetter = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/internship-offers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setLetters(response.data);
      } catch (err) {
        console.error('Error fetching intern offer letters:', err);
        setError('Failed to load intern offer letters.');
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-slate-400">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm">Loading intern offer letters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 px-6 py-8 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-xl" role="alert">
          <span className="font-bold">Error:</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-8 max-w-[1200px] mx-auto w-full">
      <div className="mb-6 animate-[fadeInUp_0.4s_ease]">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-light uppercase tracking-widest mb-2">
          <FileText size={13} /> Intern Records
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Intern Offer Letters
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {letters.length} total records — sorted by newest first
        </p>
      </div>

      <div className="bg-white dark:bg-brand-card border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden animate-[fadeInUp_0.5s_ease]">
        {letters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Inbox size={40} className="text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-gray-700 dark:text-slate-300">No intern offer letters found</p>
            <p className="text-sm text-slate-400">Generate one from the Intern Offer Letter page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                  {['Name', 'Email', 'Position', 'Start Date', 'End Date', 'Stipend', 'Created On'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {letters.map((letter) => (
                  <tr key={letter.id}
                    className="border-b border-gray-50 dark:border-white/[0.04] transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary-light flex-shrink-0">
                          {letter.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{letter.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{letter.email || '—'}</td>
                    <td className="px-5 py-4">
                      {letter.position ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-primary-light bg-primary/10 border border-primary/20">
                          {letter.position}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {letter.startDate ? new Date(letter.startDate).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {letter.endDate ? new Date(letter.endDate).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {letter.stipend ? `₹${Number(letter.stipend).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {letter.created_at ? new Date(letter.created_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadInternOfferLetter;

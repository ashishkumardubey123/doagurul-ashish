import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Loader2, Inbox } from 'lucide-react';

const DownloadSalarySlip = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSlips = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/salary-slips`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSlips(response.data);
      } catch (err) {
        console.error('Error fetching salary slips:', err);
        setError('Failed to load salary slips.');
      } finally {
        setLoading(false);
      }
    };
    fetchSlips();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-slate-400">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm">Loading salary slips...</p>
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
          <FileText size={13} /> Salary Records
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Generated Salary Slips
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {slips.length} total records — sorted by newest first
        </p>
      </div>

      <div className="bg-white dark:bg-brand-card border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden animate-[fadeInUp_0.5s_ease]">
        {slips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Inbox size={40} className="text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-gray-700 dark:text-slate-300">No salary slips found</p>
            <p className="text-sm text-slate-400">Generate one from the Salary Slip page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                  {['Name', 'Employee ID', 'Month', 'Year', 'Gross Salary', 'Net Salary', 'Created On'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slips.map((slip) => (
                  <tr key={slip.id}
                    className="border-b border-gray-50 dark:border-white/[0.04] transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary-light flex-shrink-0">
                          {slip.employeeName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{slip.employeeName || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{slip.employeeId || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-primary-light bg-primary/10 border border-primary/20">
                        {slip.month || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{slip.year || '—'}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {slip.grossSalary ? `₹${Number(slip.grossSalary).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {slip.netSalary ? `₹${Number(slip.netSalary).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {slip.createdAt ? new Date(slip.createdAt).toLocaleDateString('en-IN') : '—'}
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

export default DownloadSalarySlip;

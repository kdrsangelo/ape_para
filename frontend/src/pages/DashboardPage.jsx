import { useEffect, useState } from 'react';
import IssueForm from '../components/IssueForm';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

function StatusBadge({ status }) {
  const styleMap = {
    submitted: 'bg-yellow-100 text-yellow-800',
    in_review: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    resolved: 'bg-emerald-100 text-emerald-800'
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styleMap[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const { token, user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getMyReports(token);
      setReports(data.reports);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-lotus/40 p-4">
        <div>
          <h1 className="text-2xl font-bold text-cinnamon">Ayubowan, {user?.email}</h1>
          <p className="text-sm text-gray-600">Track submissions and receive routing updates here.</p>
        </div>
        <button className="rounded-md border border-cinnamon px-3 py-2 text-cinnamon" onClick={logout}>
          Log out
        </button>
      </div>

      <IssueForm onReportCreated={loadReports} />

      <section className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-cinnamon">Your Notifications & Report Status</h2>
        {loading ? <p className="text-sm text-gray-500">Loading reports...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!loading && !error && reports.length === 0 ? (
          <p className="text-sm text-gray-500">No reports submitted yet.</p>
        ) : null}

        <div className="space-y-3">
          {reports.map((report) => (
            <article key={report.id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium">{report.title}</h3>
                <StatusBadge status={report.status} />
              </div>
              <p className="mt-1 text-sm text-gray-600">{report.description}</p>
              <p className="mt-2 text-xs text-gray-500">
                Category: {report.category} • Location: {report.latitude}, {report.longitude}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

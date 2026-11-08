import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapPickerStub from './MapPickerStub';

const categoryOptions = [
  { value: 'potholes', label: 'Potholes' },
  { value: 'garbage_dumping', label: 'Garbage Dumping' },
  { value: 'broken_street_lights', label: 'Broken Street Lights' },
  { value: 'water_drainage_blocks', label: 'Water Drainage Blocks' }
];

export default function IssueForm({ onReportCreated }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categoryOptions[0].value,
    latitude: '',
    longitude: '',
    image: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = new FormData();
      payload.set('title', form.title);
      payload.set('description', form.description);
      payload.set('category', form.category);
      payload.set('latitude', form.latitude);
      payload.set('longitude', form.longitude);
      if (form.image) {
        payload.set('image', form.image);
      }

      await api.createReport(payload, token);
      setForm({
        title: '',
        description: '',
        category: categoryOptions[0].value,
        latitude: '',
        longitude: '',
        image: null
      });
      onReportCreated();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-cinnamon">Submit an Infrastructure Issue</h2>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <label className="block text-sm">
        Title
        <input
          required
          value={form.title}
          onChange={(event) => setValue('title', event.target.value)}
          className="mt-1 w-full rounded-md border border-amber-200 px-3 py-2"
          placeholder="Ex: Large pothole near school gate"
        />
      </label>

      <label className="block text-sm">
        Category
        <select
          value={form.category}
          onChange={(event) => setValue('category', event.target.value)}
          className="mt-1 w-full rounded-md border border-amber-200 px-3 py-2"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        Description
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(event) => setValue('description', event.target.value)}
          className="mt-1 w-full rounded-md border border-amber-200 px-3 py-2"
          placeholder="Describe the issue in detail"
        />
      </label>

      <MapPickerStub
        latitude={form.latitude}
        longitude={form.longitude}
        onChange={({ latitude, longitude }) => setForm((prev) => ({ ...prev, latitude, longitude }))}
      />

      <label className="block text-sm">
        Photo Upload
        <input
          className="mt-1 w-full rounded-md border border-amber-200 px-3 py-2"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => setValue('image', event.target.files?.[0] || null)}
        />
      </label>

      <button
        disabled={loading}
        className="w-full rounded-md bg-cinnamon px-4 py-2 text-white transition hover:brightness-95 disabled:opacity-60"
        type="submit"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}

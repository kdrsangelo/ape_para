export default function MapPickerStub({ latitude, longitude, onChange }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-ocean">Interactive Map (Stub)</h3>
      <p className="mb-4 text-sm text-gray-500">
        Replace this with Leaflet/Mapbox in production. For now, use coordinates manually.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Latitude
          <input
            className="mt-1 w-full rounded-md border border-amber-200 px-3 py-2"
            type="number"
            step="0.000001"
            value={latitude}
            onChange={(event) => onChange({ latitude: event.target.value, longitude })}
            placeholder="e.g. 6.9271"
          />
        </label>
        <label className="text-sm">
          Longitude
          <input
            className="mt-1 w-full rounded-md border border-amber-200 px-3 py-2"
            type="number"
            step="0.000001"
            value={longitude}
            onChange={(event) => onChange({ latitude, longitude: event.target.value })}
            placeholder="e.g. 79.8612"
          />
        </label>
      </div>
    </div>
  );
}

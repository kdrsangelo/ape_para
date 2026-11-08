import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await register({ email, password });
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-cinnamon">Create Account</h1>
      <p className="mt-1 text-sm text-gray-500">Join Ape Para and keep Sri Lanka safe and clean.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-amber-200 px-3 py-2"
          placeholder="Email"
        />
        <input
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-amber-200 px-3 py-2"
          placeholder="Password (min 8 chars)"
        />
        <button className="w-full rounded-md bg-cinnamon px-4 py-2 text-white" type="submit">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <Link className="font-medium text-ocean hover:underline" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}

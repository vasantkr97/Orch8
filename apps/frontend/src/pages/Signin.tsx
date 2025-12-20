import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useSignin from '../hooks/userHooks/useSignin';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin, isLoading } = useSignin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signin({ email, password }, {
      onSuccess: () => navigate('/dashboard')
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">Sign in</h1>
          <p className="text-sm text-gray-500">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-white text-gray-950 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-400">
            Forgot password?
          </Link>
        </div>

        <div className="mt-8 text-center">
          <span className="text-sm text-gray-500">Don't have an account? </span>
          <Link to="/signup" className="text-sm text-white hover:text-gray-300">
            Sign up
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs text-gray-600 hover:text-gray-500">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

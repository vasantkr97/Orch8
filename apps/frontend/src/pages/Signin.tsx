import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useSignin from '../hooks/userHooks/useSignin';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative">
      <Navbar />

      <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Sign in</h1>
            <p className="text-sm text-gray-400">Welcome back to Orch8</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Footer links handled by Navbar now, but keeping mobile/fallback here just in case? No, better to remove redundancy if Navbar covers it. Navbar has "New to Orch8? Sign up". */}
      </div>
    </div>
  );
}

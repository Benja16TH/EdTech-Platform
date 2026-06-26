import { useState } from 'react';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}


export default function Login({ users, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password && u.active !== false);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        onLogin(userWithoutPassword as User);
      } else {
        setError('Correo o contraseña incorrectos');
      }
      setLoading(false);
    }, 500);
  };

  const handleDemoLogin = (demoUser: User) => {
    const { password: _, ...userWithoutPassword } = demoUser;
    onLogin(userWithoutPassword as User);
  };

  const demoUsers = users.filter(u => u.active !== false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center">Campus Virtual</h1>
            <p className="text-blue-100 text-center mt-2">Plataforma de Capacitación Corporativa</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo corporativo
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.email@empresa.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t">
              <p className="text-center text-gray-600 text-sm mb-4 font-medium">Cuentas de prueba disponibles:</p>

              <div className="space-y-3">
                {demoUsers.map(demoUser => (
                  <button
                    key={demoUser.id}
                    onClick={() => handleDemoLogin(demoUser)}
                    className={`w-full border font-medium py-2 rounded-lg transition-all text-sm ${
                      demoUser.role === 'admin'
                        ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-semibold">{demoUser.name}</div>
                    <div className={`text-xs ${demoUser.role === 'admin' ? 'text-blue-600' : 'text-gray-500'}`}>
                      {demoUser.email}{demoUser.role === 'admin' ? ' (Administrador)' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

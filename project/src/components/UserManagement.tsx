import { useState } from 'react';
import { ArrowLeft, Plus, X, Save, Check, Eye, EyeOff, Shield, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onToggleUserActive: (userId: string) => void;
  onViewProfile: (userId: string) => void;
  onBack: () => void;
}

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'collaborator' as 'collaborator' | 'admin',
  position: '',
  department: '',
};

export default function UserManagement({
  users,
  onAddUser,
  onUpdateUser,
  onToggleUserActive,
  onViewProfile,
  onBack
}: UserManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenNewForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      position: user.position || '',
      department: user.department || '',
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Nombre y correo son obligatorios');
      return;
    }

    if (!editingId && !formData.password) {
      alert('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    if (editingId) {
      const existing = users.find(u => u.id === editingId);
      if (existing) {
        onUpdateUser({
          ...existing,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          position: formData.position || undefined,
          department: formData.department || undefined,
          ...(formData.password ? { password: formData.password } : {}),
        });
        setSuccessMessage('Usuario actualizado exitosamente');
      }
    } else {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        active: true,
        position: formData.position || undefined,
        department: formData.department || undefined,
      };
      onAddUser(newUser);
      setSuccessMessage('Usuario creado exitosamente');
    }

    setShowForm(false);
    setFormData(emptyForm);
    setEditingId(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const activeUsers = users.filter(u => u.active !== false);
  const inactiveUsers = users.filter(u => u.active === false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Volver al Panel Admin</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm text-gray-600">Administración</p>
                <p className="font-semibold text-gray-800">Gestión de Usuarios</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
            <p className="text-gray-600 mt-1">Administra los empleados registrados en la plataforma</p>
          </div>
          <button onClick={handleOpenNewForm} className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo usuario
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center shadow-md">
            <Check className="w-5 h-5 mr-3 text-green-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingId ? 'Editar usuario' : 'Nuevo usuario'}
                </h3>
                <button onClick={handleCloseForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Ana López" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="ejemplo@empresa.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña {editingId ? '(dejar vacío para no cambiar)' : '*'}
                  </label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder={editingId ? '••••••••' : 'Contraseña inicial'} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rol *</label>
                  <div className="flex space-x-3">
                    <label className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${formData.role === 'collaborator' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" name="role" value="collaborator" checked={formData.role === 'collaborator'} onChange={e => setFormData({ ...formData, role: e.target.value as 'collaborator' })} className="sr-only" />
                      <UserIcon className="w-5 h-5 mr-2" />
                      Colaborador
                    </label>
                    <label className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${formData.role === 'admin' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' })} className="sr-only" />
                      <Shield className="w-5 h-5 mr-2" />
                      Administrador
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
                    <input type="text" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="Ej: Analista" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Departamento</label>
                    <input type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="Ej: TI" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button type="button" onClick={handleCloseForm} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Guardar cambios' : 'Crear usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="font-bold text-gray-800">Usuarios activos ({activeUsers.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.filter(u => u.active !== false).map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${user.role === 'admin' ? 'bg-gradient-to-br from-purple-400 to-pink-500' : 'bg-gradient-to-br from-blue-400 to-cyan-500'}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          {user.position && <p className="text-xs text-gray-500">{user.position}{user.department ? ` · ${user.department}` : ''}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role === 'admin' ? 'Administrador' : 'Colaborador'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => onViewProfile(user.id)} className="px-3 py-2 bg-teal-50 text-teal-600 font-medium rounded-lg hover:bg-teal-100 transition-all text-sm">
                          Perfil
                        </button>
                        <button onClick={() => handleEditUser(user)} className="px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-all text-sm">
                          Editar
                        </button>
                        <button onClick={() => onToggleUserActive(user.id)} className="px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all text-sm">
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeUsers.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">No hay usuarios activos</p>
            </div>
          )}
        </div>

        {inactiveUsers.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-800">Usuarios inactivos ({inactiveUsers.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inactiveUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-all opacity-60">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-500">{user.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                          {user.role === 'admin' ? 'Administrador' : 'Colaborador'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Inactivo
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => onViewProfile(user.id)} className="px-3 py-2 bg-teal-50 text-teal-600 font-medium rounded-lg hover:bg-teal-100 transition-all text-sm">
                            Perfil
                          </button>
                          <button onClick={() => onToggleUserActive(user.id)} className="px-3 py-2 bg-green-50 text-green-600 font-medium rounded-lg hover:bg-green-100 transition-all text-sm">
                            Reactivar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
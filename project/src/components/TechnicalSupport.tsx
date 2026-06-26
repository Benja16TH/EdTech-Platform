import { useState } from 'react';
import { ArrowLeft, Send, AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';
import { SupportTicket, User } from '../types';

interface TechnicalSupportProps {
  user: User;
  tickets: SupportTicket[];
  onAddTicket: (ticket: SupportTicket) => void;
  onBack: () => void;
}

export default function TechnicalSupport({ user, tickets, onAddTicket, onBack }: TechnicalSupportProps) {
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as SupportTicket['priority'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      userId: user.id,
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority,
      status: 'open',
      createdAt: new Date(),
    };

    onAddTicket(newTicket);
    setShowForm(false);
    setFormData({ subject: '', description: '', priority: 'medium' });
    setSuccessMessage('Tu reporte ha sido enviado exitosamente. Te contacteremos pronto.');

    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const getPriorityIcon = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-blue-100 text-blue-700',
    };
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    const styles = {
      open: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-600',
    };
    const labels = {
      open: 'Abierto',
      in_progress: 'En proceso',
      resolved: 'Resuelto',
      closed: 'Cerrado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Volver al Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Soporte Técnico</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Soporte Técnico</h2>
            <p className="text-gray-600 mt-1">Reporta problemas técnicos o solicita ayuda</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Nuevo reporte
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center shadow-md">
            <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">Nuevo reporte de problema</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Describe brevemente el problema"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción del problema *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Explica con detalle el problema que estás experimentando..."
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['low', 'medium', 'high'] as const).map(priority => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority })}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                          formData.priority === priority
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {getPriorityIcon(priority)}
                        <span className="text-sm font-medium text-gray-700">
                          {priority === 'low' ? 'Baja' : priority === 'medium' ? 'Media' : 'Alta'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar reporte
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Mis reportes ({tickets.length})
            </h3>
          </div>

          {tickets.length === 0 ? (
            <div className="p-12 text-center">
              <Info className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-600">No tienes reportes técnicos enviados</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                <Send className="w-5 h-5 mr-2" />
                Crear primer reporte
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getPriorityIcon(ticket.priority)}
                      <h4 className="font-bold text-gray-800">{ticket.subject}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>

                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

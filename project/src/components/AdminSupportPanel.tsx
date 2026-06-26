import { useState } from 'react';
import { ArrowLeft, AlertTriangle, AlertCircle, Info, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { SupportTicket, User } from '../types';
import { mockCollaborators } from '../data/extendedMockData';

interface AdminSupportPanelProps {
  tickets: SupportTicket[];
  user: User;
  onUpdateTicket: (ticketId: string, status: SupportTicket['status']) => void;
  onBack: () => void;
}

type FilterStatus = 'all' | SupportTicket['status'];
type FilterPriority = 'all' | SupportTicket['priority'];

export default function AdminSupportPanel({ tickets, user, onUpdateTicket, onBack }: AdminSupportPanelProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');

  const getUserName = (userId: string) => {
    const found = mockCollaborators.find(c => c.id === userId);
    return found ? found.name : `Usuario #${userId}`;
  };

  const filtered = tickets.filter(t => {
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchStatus && matchPriority;
  });

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
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

  const getPriorityIcon = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'low':
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const styles = {
      high: 'bg-red-100 text-red-700 border border-red-200',
      medium: 'bg-amber-100 text-amber-700 border border-amber-200',
      low: 'bg-blue-100 text-blue-700 border border-blue-200',
    };
    const labels = { high: 'Alta', medium: 'Media', low: 'Baja' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[priority]}`}>
        {getPriorityIcon(priority)}
        {labels[priority]}
      </span>
    );
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    const styles = {
      open: 'bg-gray-100 text-gray-700 border border-gray-200',
      in_progress: 'bg-blue-100 text-blue-700 border border-blue-200',
      resolved: 'bg-green-100 text-green-700 border border-green-200',
      closed: 'bg-slate-100 text-slate-600 border border-slate-200',
    };
    const icons = {
      open: <Clock className="w-3.5 h-3.5" />,
      in_progress: <AlertCircle className="w-3.5 h-3.5" />,
      resolved: <CheckCircle className="w-3.5 h-3.5" />,
      closed: <XCircle className="w-3.5 h-3.5" />,
    };
    const labels = { open: 'Abierto', in_progress: 'En proceso', resolved: 'Resuelto', closed: 'Cerrado' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const statusOptions: { value: SupportTicket['status']; label: string }[] = [
    { value: 'open', label: 'Abierto' },
    { value: 'in_progress', label: 'En proceso' },
    { value: 'resolved', label: 'Resuelto' },
    { value: 'closed', label: 'Cerrado' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver al Panel Admin</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Gestión de Soporte</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Soporte Técnico</h2>
          <p className="text-gray-600 mt-1">Administra y actualiza el estado de los tickets de soporte</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { key: 'all' as const, label: 'Total', color: 'from-gray-600 to-gray-700', textColor: 'text-white' },
            { key: 'open' as const, label: 'Abiertos', color: 'from-gray-100 to-gray-200', textColor: 'text-gray-800' },
            { key: 'in_progress' as const, label: 'En proceso', color: 'from-blue-100 to-blue-200', textColor: 'text-blue-800' },
            { key: 'resolved' as const, label: 'Resueltos', color: 'from-green-100 to-green-200', textColor: 'text-green-800' },
            { key: 'closed' as const, label: 'Cerrados', color: 'from-slate-100 to-slate-200', textColor: 'text-slate-700' },
          ].map(({ key, label, color, textColor }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`bg-gradient-to-br ${color} rounded-xl p-4 text-left transition-all shadow-sm hover:shadow-md ${
                filterStatus === key ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              <p className={`text-2xl font-bold ${textColor}`}>{counts[key]}</p>
              <p className={`text-sm font-medium mt-1 ${textColor} opacity-80`}>{label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold">Filtros:</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Estado:</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as FilterStatus)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="open">Abierto</option>
              <option value="in_progress">En proceso</option>
              <option value="resolved">Resuelto</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Prioridad:</label>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value as FilterPriority)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          {(filterStatus !== 'all' || filterPriority !== 'all') && (
            <button
              onClick={() => { setFilterStatus('all'); setFilterPriority('all'); }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Limpiar filtros
            </button>
          )}

          <span className="ml-auto text-sm text-gray-500">
            {filtered.length} de {tickets.length} tickets
          </span>
        </div>

        {/* Tickets list */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No hay tickets que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered
                .slice()
                .sort((a, b) => {
                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority] ||
                    b.createdAt.getTime() - a.createdAt.getTime();
                })
                .map(ticket => (
                  <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-gray-800">{ticket.subject}</span>
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{ticket.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <div className="w-5 h-5 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              {getUserName(ticket.userId).charAt(0)}
                            </div>
                            <span className="font-medium text-gray-700">{getUserName(ticket.userId)}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(ticket.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Status updater */}
                      <div className="flex-shrink-0">
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                          Cambiar estado
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {statusOptions.map(opt => {
                            const isActive = ticket.status === opt.value;
                            const styles = {
                              open: isActive
                                ? 'bg-gray-700 text-white border-gray-700'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500',
                              in_progress: isActive
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-blue-600 border-blue-300 hover:border-blue-500',
                              resolved: isActive
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-green-600 border-green-300 hover:border-green-500',
                              closed: isActive
                                ? 'bg-slate-600 text-white border-slate-600'
                                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500',
                            };
                            return (
                              <button
                                key={opt.value}
                                onClick={() => !isActive && onUpdateTicket(ticket.id, opt.value)}
                                disabled={isActive}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${styles[opt.value]} ${
                                  isActive ? 'cursor-default' : 'cursor-pointer'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
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

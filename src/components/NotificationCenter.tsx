import { useState } from 'react';
import { Bell, BookOpen, Clock, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { Notification } from '../types';

interface NotificationCenterProps {
  userId: string;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}
export default function NotificationCenter({
  userId,
  notifications,
  setNotifications,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const userNotifications = notifications.filter(
  n => n.userId === userId
);


const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_course':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case 'new_course':
        return 'bg-blue-50';
      case 'reminder':
        return 'bg-amber-50';
      case 'completed':
        return 'bg-green-50';
      case 'system':
        return 'bg-gray-100';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `Hace ${minutes} minutos`;
    } else if (hours < 24) {
      return `Hace ${hours} horas`;
    } else {
      return `Hace ${days} días`;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-cyan-600">
              <div>
                <h3 className="text-lg font-bold text-white">Notificaciones</h3>
                <p className="text-blue-100 text-sm">
                  {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-all"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Marcar todas
                </button>
              )}
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No tienes notificaciones</p>
                </div>
              ) : (
                <div className="divide-y">
                  {userNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 transition-all ${
                        notification.read ? 'bg-white' : getNotificationBg(notification.type)
                      } hover:bg-gray-50`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-800'}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="flex-shrink-0 p-1 text-blue-600 hover:bg-blue-50 rounded transition-all"
                                title="Marcar como leída"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

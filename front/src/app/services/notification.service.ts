import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);

  show(type: Notification['type'], message: string) {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      read: false
    };

    this.notifications.update(notifs => [notification, ...notifs]);
    this.updateUnreadCount();

    // Auto-hide after 8 seconds (augmenté depuis 5 secondes)
    setTimeout(() => {
      this.remove(notification.id);
    }, 8000);
  }

  success(message: string) {
    this.show('success', message);
  }

  error(message: string) {
    this.show('error', message);
  }

  info(message: string) {
    this.show('info', message);
  }

  warning(message: string) {
    this.show('warning', message);
  }

  remove(id: string) {
    this.notifications.update(notifs => notifs.filter(n => n.id !== id));
    this.updateUnreadCount();
  }

  markAsRead(id: string) {
    this.notifications.update(notifs =>
      notifs.map(n => n.id === id ? { ...n, read: true } : n)
    );
    this.updateUnreadCount();
  }

  markAllAsRead() {
    this.notifications.update(notifs =>
      notifs.map(n => ({ ...n, read: true }))
    );
    this.updateUnreadCount();
  }

  clearAll() {
    this.notifications.set([]);
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const count = this.notifications().filter(n => !n.read).length;
    this.unreadCount.set(count);
  }
}

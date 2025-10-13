import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { LucideAngularModule, CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{toast.type}}">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <lucide-icon [img]="CheckCircle" [size]="20"></lucide-icon>
              }
              @case ('error') {
                <lucide-icon [img]="XCircle" [size]="20"></lucide-icon>
              }
              @case ('warning') {
                <lucide-icon [img]="AlertCircle" [size]="20"></lucide-icon>
              }
              @case ('info') {
                <lucide-icon [img]="Info" [size]="20"></lucide-icon>
              }
            }
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button 
            class="toast-close" 
            (click)="toastService.remove(toast.id)"
            aria-label="Fermer"
          >
            <lucide-icon [img]="X" [size]="16"></lucide-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background: white;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-success {
      border-left: 4px solid #16a34a;
    }

    .toast-success .toast-icon {
      color: #16a34a;
    }

    .toast-error {
      border-left: 4px solid #dc2626;
    }

    .toast-error .toast-icon {
      color: #dc2626;
    }

    .toast-warning {
      border-left: 4px solid #f59e0b;
    }

    .toast-warning .toast-icon {
      color: #f59e0b;
    }

    .toast-info {
      border-left: 4px solid #2563eb;
    }

    .toast-info .toast-icon {
      color: #2563eb;
    }

    .toast-message {
      flex: 1;
      font-size: 0.875rem;
      color: #374151;
    }

    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      color: #9ca3af;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
      transition: all 0.2s;
    }

    .toast-close:hover {
      background: #f3f4f6;
      color: #374151;
    }

    @media (max-width: 640px) {
      .toast-container {
        left: 1rem;
        right: 1rem;
        max-width: none;
      }
    }
  `]
})
export class ToastComponent {
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly AlertCircle = AlertCircle;
  readonly Info = Info;
  readonly X = X;

  constructor(public toastService: ToastService) {}
}

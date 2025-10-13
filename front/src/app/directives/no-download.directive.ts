import { Directive, HostListener, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: 'img[appNoDownload]',
  standalone: true
})
export class NoDownloadDirective implements OnInit {
  private el = inject(ElementRef);

  ngOnInit() {
    // Désactiver le drag & drop
    this.el.nativeElement.setAttribute('draggable', 'false');
    
    // Bloquer la sélection du texte/image
    this.el.nativeElement.style.userSelect = 'none';
    this.el.nativeElement.style.webkitUserSelect = 'none';
    this.el.nativeElement.style.mozUserSelect = 'none';
    this.el.nativeElement.style.msUserSelect = 'none';
    
    // Désactiver le menu contextuel par défaut
    this.el.nativeElement.style.webkitTouchCallout = 'none';
  }

  // Bloquer le clic droit (menu contextuel)
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  // Bloquer le drag & drop
  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  // Bloquer la sélection (double-clic, etc.)
  @HostListener('selectstart', ['$event'])
  onSelectStart(event: Event) {
    event.preventDefault();
    return false;
  }

  // Bloquer le long press sur mobile
  @HostListener('touchstart', ['$event'])
  @HostListener('touchmove', ['$event'])
  @HostListener('touchend', ['$event'])
  onTouch(event: TouchEvent) {
    // Ne pas bloquer les touches, juste empêcher le menu contextuel
    if (event.type === 'touchstart') {
      const touch = event.touches[0];
      if (touch) {
        // Empêcher le menu contextuel sur long press
        setTimeout(() => {
          this.el.nativeElement.style.webkitTouchCallout = 'none';
        }, 0);
      }
    }
  }
}

import { Component, HostListener, Inject } from '@angular/core';
import { DOCUMENT, NgIf } from '@angular/common';

@Component({
  selector: 'app-back-to-top-button',
  imports: [NgIf],
  templateUrl: './back-to-top-button.component.html',
  styleUrl: './back-to-top-button.component.css'
})
export class BackToTopButtonComponent {
  showButton = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.showButton = this.document.documentElement.scrollTop > 300; // Mostrar después de 300px
  }

  scrollToTop(): void {
    this.document.documentElement.scrollTop = 0;
  }
}
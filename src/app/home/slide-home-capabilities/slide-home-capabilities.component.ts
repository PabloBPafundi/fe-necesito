import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../product/services/product.service';
import { CommonModule } from '@angular/common';
import { IStep } from '../interfaces/step.interface'

@Component({
  selector: 'app-slide-home-capabilities',
    standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-home-capabilities.component.html',
})
export class SlideHomeCapabilitiesComponent implements OnInit, OnDestroy {


  steps: IStep[] = [
    {
      title: 'Encuentra lo que necesitas',
      description: 'Explora nuestra amplia selección de productos disponibles para alquilar.',
      imageUrl: 'slideUno.png' 
    },
    {
      title: 'Conéctate fácilmente',
      description: 'Te ponemos en contacto directo con arrendatarios y arrendadores.',
      imageUrl: 'slideDos.png' 
    },
    {
      title: 'Presenta tu producto',
      description: 'Coordina los detalles y asegura tu alquiler de forma sencilla.',
      imageUrl: 'slideTres.png' 
    }
  ];

  currentIndex = 0;
  intervalId: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  startCarousel(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopCarousel(): void {
    clearInterval(this.intervalId);
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.steps.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.steps.length) % this.steps.length;
  }
}
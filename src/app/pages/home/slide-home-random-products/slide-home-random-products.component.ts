import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import {
  IArticuloResponse,
  IProductQueryParamsSearch,
} from '../../../shared/types/IProductDetails'; // Ensure this path is correct
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-slide-home-random-products',
  standalone: true, // Mark as standalone
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './slide-home-random-products.component.html',
})
export class SlideHomeRandomProductsComponent implements OnInit, OnDestroy {
  products: IArticuloResponse[] = [];
  currentSlideIndex: number = 0;
  productsPerSlide: number = 5;
  totalProductsToFetch: number = 20;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  private autoSlideSubscription: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe();
    }
  }

  /**
   * Fetches products from the ProductService.
   * Sets loading state and handles success/error.
   */
  fetchProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    let params: IProductQueryParamsSearch = {
      maxResults: this.totalProductsToFetch,
    };

    const userId = this.userService.userId();
    if (userId !== null && userId !== undefined) {
      params = {
        ...params,
        no_arrendador: userId,
      };
    }

    this.productService.getProductsFiltered(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.result;
          this.startAutoSlide();
        } else {
          this.errorMessage = 'No se pudieron cargar los productos.';
          this.products = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        this.products = [];
      },
    });
  }

  /**
   * Calculates the total number of slides based on products and productsPerSlide.
   * @returns The total number of slides.
   */
  get totalSlides(): number {
    if (!this.products || this.products.length === 0) {
      return 0;
    }
    return Math.ceil(this.products.length / this.productsPerSlide);
  }

  /**
   * Returns the products that should be visible on the current slide.
   * Slices the products array based on currentSlideIndex and productsPerSlide.
   * @returns An array of products for the current slide.
   */
  get visibleProducts(): IArticuloResponse[] {
    const startIndex = this.currentSlideIndex * this.productsPerSlide;
    const endIndex = startIndex + this.productsPerSlide;
    return this.products.slice(startIndex, endIndex);
  }

  /**
   * Navigates to the previous slide.
   * Wraps around to the last slide if currently on the first.
   */
  prevSlide(): void {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe(); // Stop auto-slide on manual interaction
    }
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
    this.startAutoSlide(); // Restart auto-slide
  }

  /**
   * Navigates to the next slide.
   * Wraps around to the first slide if currently on the last.
   */
  nextSlide(): void {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe(); // Stop auto-slide on manual interaction
    }
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.totalSlides;
    this.startAutoSlide(); // Restart auto-slide
  }

  /**
   * Sets the current slide to a specific index.
   * @param index The index of the slide to navigate to.
   */
  goToSlide(index: number): void {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe(); // Stop auto-slide on manual interaction
    }
    this.currentSlideIndex = index;
    this.startAutoSlide(); // Restart auto-slide
  }

  /**
   * Starts the automatic sliding of the carousel.
   * Unsubscribes from previous subscription if any.
   */
  private startAutoSlide(): void {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe();
    }
    // Auto-slide every 5 seconds
    this.autoSlideSubscription = interval(5000).subscribe(() => {
      this.nextSlide();
    });
  }
}

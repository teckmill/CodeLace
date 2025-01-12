import { Component } from '../core/component';

interface CarouselOptions {
    autoplay?: boolean;
    interval?: number;
    indicators?: boolean;
    navigation?: boolean;
    effect?: 'slide' | 'fade';
    loop?: boolean;
}

export class Carousel extends Component {
    private slides: HTMLElement[];
    private currentSlide: number = 0;
    protected options: CarouselOptions;
    private autoplayInterval: number | null = null;
    private isTransitioning: boolean = false;

    constructor(selector: string, options: CarouselOptions = {}) {
        super(selector);
        this.slides = Array.from(this.element.children) as HTMLElement[];
        this.options = {
            autoplay: true,
            interval: 5000,
            indicators: true,
            navigation: true,
            effect: 'slide',
            loop: true,
            ...options
        };
        this.init();
    }

    private init(): void {
        this.setupContainer();
        this.setupSlides();
        if (this.options.indicators) this.setupIndicators();
        if (this.options.navigation) this.setupNavigation();
        if (this.options.autoplay) this.startAutoplay();
        this.showSlide(0);
        this.attachEventListeners();
    }

    private setupContainer(): void {
        this.element.classList.add('cl-carousel');
        this.element.classList.add(`cl-carousel-${this.options.effect}`);
    }

    private setupSlides(): void {
        this.slides.forEach((slide, index) => {
            slide.classList.add('cl-carousel-slide');
            slide.dataset.index = String(index);
            if (this.options.effect === 'fade') {
                slide.style.opacity = index === 0 ? '1' : '0';
            }
        });
    }

    private setupIndicators(): void {
        const indicators = document.createElement('div');
        indicators.className = 'cl-carousel-indicators';
        
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'cl-carousel-indicator';
            indicator.dataset.slideTo = String(index);
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(indicator);
        });

        this.element.appendChild(indicators);
    }

    private setupNavigation(): void {
        const prevButton = document.createElement('button');
        prevButton.className = 'cl-carousel-prev';
        prevButton.innerHTML = '‹';
        prevButton.addEventListener('click', () => this.prev());

        const nextButton = document.createElement('button');
        nextButton.className = 'cl-carousel-next';
        nextButton.innerHTML = '›';
        nextButton.addEventListener('click', () => this.next());

        this.element.appendChild(prevButton);
        this.element.appendChild(nextButton);
    }

    private showSlide(index: number): void {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const previousSlide = this.slides[this.currentSlide];
        const nextSlide = this.slides[index];

        if (this.options.effect === 'fade') {
            previousSlide.style.opacity = '0';
            nextSlide.style.opacity = '1';
        } else {
            const offset = -100 * index;
            this.element.style.transform = `translateX(${offset}%)`;
        }

        // Update indicators
        this.element.querySelectorAll('.cl-carousel-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        this.currentSlide = index;

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600); // Match transition duration in CSS
    }

    private goToSlide(index: number): void {
        if (index < 0) {
            index = this.options.loop ? this.slides.length - 1 : 0;
        } else if (index >= this.slides.length) {
            index = this.options.loop ? 0 : this.slides.length - 1;
        }

        if (index !== this.currentSlide) {
            this.showSlide(index);
        }
    }

    private attachEventListeners(): void {
        let touchStartX: number = 0;
        let touchEndX: number = 0;

        this.element.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.element.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });

        this.element.addEventListener('touchend', () => {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) { // Minimum swipe distance
                if (difference > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });

        this.element.addEventListener('mouseenter', () => {
            if (this.options.autoplay) this.stopAutoplay();
        });

        this.element.addEventListener('mouseleave', () => {
            if (this.options.autoplay) this.startAutoplay();
        });
    }

    private startAutoplay(): void {
        if (this.autoplayInterval) return;
        this.autoplayInterval = window.setInterval(() => {
            this.next();
        }, this.options.interval);
    }

    private stopAutoplay(): void {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    // Public API
    public next(): void {
        this.goToSlide(this.currentSlide + 1);
    }

    public prev(): void {
        this.goToSlide(this.currentSlide - 1);
    }

    public pause(): void {
        this.stopAutoplay();
    }

    public play(): void {
        if (this.options.autoplay) this.startAutoplay();
    }

    public goTo(index: number): void {
        this.goToSlide(index);
    }

    public getCurrentSlide(): number {
        return this.currentSlide;
    }

    public destroy(): void {
        this.stopAutoplay();
        // Remove all event listeners and clean up
        this.element.innerHTML = '';
        this.slides = [];
    }
}

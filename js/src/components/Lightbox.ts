import { Component } from '../core/component';

interface LightboxOptions {
    gallery?: boolean;
    zoom?: boolean;
    fullscreen?: boolean;
    captions?: boolean;
    thumbnails?: boolean;
    keyboard?: boolean;
    slideshow?: boolean;
    slideshowSpeed?: number;
}

export class Lightbox extends Component {
    protected options: LightboxOptions;
    private images: HTMLImageElement[] = [];
    private currentIndex: number = 0;
    private isOpen: boolean = false;
    private isZoomed: boolean = false;
    private isSlideshow: boolean = false;
    private slideshowInterval: number | null = null;

    constructor(selector: string, options: LightboxOptions = {}) {
        super(selector);
        this.options = {
            gallery: true,
            zoom: true,
            fullscreen: true,
            captions: true,
            thumbnails: true,
            keyboard: true,
            slideshow: true,
            slideshowSpeed: 4000,
            ...options
        };
        this.init();
    }

    private init(): void {
        this.setupContainer();
        this.collectImages();
        this.attachEventListeners();
    }

    private setupContainer(): void {
        // Create lightbox overlay
        const overlay = document.createElement('div');
        overlay.className = 'cl-lightbox-overlay';
        overlay.innerHTML = `
            <div class="cl-lightbox-content">
                <div class="cl-lightbox-image-container">
                    <img class="cl-lightbox-image" src="" alt="">
                </div>
                ${this.options.captions ? '<div class="cl-lightbox-caption"></div>' : ''}
                ${this.options.thumbnails ? '<div class="cl-lightbox-thumbnails"></div>' : ''}
                <div class="cl-lightbox-controls">
                    ${this.options.gallery ? `
                        <button class="cl-lightbox-prev">‹</button>
                        <button class="cl-lightbox-next">›</button>
                    ` : ''}
                    ${this.options.zoom ? '<button class="cl-lightbox-zoom">🔍</button>' : ''}
                    ${this.options.slideshow ? '<button class="cl-lightbox-slideshow">▶</button>' : ''}
                    ${this.options.fullscreen ? '<button class="cl-lightbox-fullscreen">⤢</button>' : ''}
                    <button class="cl-lightbox-close">×</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    private collectImages(): void {
        this.images = Array.from(this.element.querySelectorAll('img'));
        this.images.forEach((img, index) => {
            img.classList.add('cl-lightbox-trigger');
            img.dataset.index = String(index);
        });

        if (this.options.thumbnails) {
            this.setupThumbnails();
        }
    }

    private setupThumbnails(): void {
        const thumbnailsContainer = document.querySelector('.cl-lightbox-thumbnails');
        if (!thumbnailsContainer) return;

        thumbnailsContainer.innerHTML = this.images.map((img, index) => `
            <div class="cl-lightbox-thumbnail" data-index="${index}">
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `).join('');
    }

    private attachEventListeners(): void {
        // Image click handlers
        this.images.forEach(img => {
            img.addEventListener('click', (e) => {
                const index = Number((e.target as HTMLElement).dataset.index);
                this.open(index);
            });
        });

        // Control handlers
        document.querySelector('.cl-lightbox-close')?.addEventListener('click', () => this.close());
        document.querySelector('.cl-lightbox-prev')?.addEventListener('click', () => this.prev());
        document.querySelector('.cl-lightbox-next')?.addEventListener('click', () => this.next());
        document.querySelector('.cl-lightbox-zoom')?.addEventListener('click', () => this.toggleZoom());
        document.querySelector('.cl-lightbox-slideshow')?.addEventListener('click', () => this.toggleSlideshow());
        document.querySelector('.cl-lightbox-fullscreen')?.addEventListener('click', () => this.toggleFullscreen());

        // Keyboard navigation
        if (this.options.keyboard) {
            document.addEventListener('keydown', (e) => {
                if (!this.isOpen) return;
                switch (e.key) {
                    case 'Escape': this.close(); break;
                    case 'ArrowLeft': this.prev(); break;
                    case 'ArrowRight': this.next(); break;
                    case 'f': this.toggleFullscreen(); break;
                    case ' ': this.toggleSlideshow(); break;
                }
            });
        }

        // Thumbnail clicks
        document.querySelectorAll('.cl-lightbox-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const index = Number((e.currentTarget as HTMLElement).dataset.index);
                this.goTo(index);
            });
        });
    }

    private open(index: number): void {
        this.isOpen = true;
        this.currentIndex = index;
        document.querySelector('.cl-lightbox-overlay')?.classList.add('active');
        this.updateImage();
        document.body.style.overflow = 'hidden';
    }

    private close(): void {
        this.isOpen = false;
        this.stopSlideshow();
        document.querySelector('.cl-lightbox-overlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    private updateImage(): void {
        const image = this.images[this.currentIndex];
        const lightboxImage = document.querySelector('.cl-lightbox-image') as HTMLImageElement;
        if (!lightboxImage) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        if (this.options.captions) {
            const caption = document.querySelector('.cl-lightbox-caption');
            if (caption) caption.textContent = image.alt || '';
        }

        // Update thumbnails
        document.querySelectorAll('.cl-lightbox-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === this.currentIndex);
        });
    }

    private prev(): void {
        if (this.currentIndex > 0) {
            this.goTo(this.currentIndex - 1);
        }
    }

    private next(): void {
        if (this.currentIndex < this.images.length - 1) {
            this.goTo(this.currentIndex + 1);
        } else if (this.isSlideshow) {
            this.goTo(0); // Loop back to start in slideshow mode
        }
    }

    private goTo(index: number): void {
        this.currentIndex = index;
        this.updateImage();
    }

    private toggleZoom(): void {
        const imageContainer = document.querySelector('.cl-lightbox-image-container');
        this.isZoomed = !this.isZoomed;
        imageContainer?.classList.toggle('zoomed', this.isZoomed);
    }

    private toggleSlideshow(): void {
        if (this.isSlideshow) {
            this.stopSlideshow();
        } else {
            this.startSlideshow();
        }
    }

    private startSlideshow(): void {
        this.isSlideshow = true;
        document.querySelector('.cl-lightbox-slideshow')?.classList.add('active');
        this.slideshowInterval = window.setInterval(() => {
            this.next();
        }, this.options.slideshowSpeed);
    }

    private stopSlideshow(): void {
        this.isSlideshow = false;
        document.querySelector('.cl-lightbox-slideshow')?.classList.remove('active');
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
        }
    }

    private toggleFullscreen(): void {
        const overlay = document.querySelector('.cl-lightbox-overlay');
        if (!overlay) return;

        if (!document.fullscreenElement) {
            overlay.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // Public API
    public destroy(): void {
        this.close();
        document.querySelector('.cl-lightbox-overlay')?.remove();
        this.images.forEach(img => {
            img.classList.remove('cl-lightbox-trigger');
            delete img.dataset.index;
        });
    }

    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    public isPlaying(): boolean {
        return this.isSlideshow;
    }
}

interface ThemeOptions {
  useSystemPreference?: boolean;
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
  onChange?: (theme: string) => void;
}

export class ThemeManager {
  private options: ThemeOptions;
  private currentTheme: string;
  private mediaQuery: MediaQueryList | null;

  constructor(options: ThemeOptions = {}) {
    this.options = {
      useSystemPreference: true,
      defaultTheme: 'light',
      storageKey: 'cl-theme-preference',
      onChange: () => {},
      ...options
    };

    this.currentTheme = this.getStoredTheme() || this.options.defaultTheme!;
    this.mediaQuery = null;

    this.initialize();
  }

  private initialize(): void {
    // Set up system preference detection
    if (this.options.useSystemPreference) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemPreference.bind(this));
    }

    // Apply initial theme
    this.applyTheme(this.getEffectiveTheme());

    // Add data attribute to document for CSS targeting
    document.documentElement.setAttribute('data-theme-initialized', 'true');
  }

  private getStoredTheme(): string | null {
    return localStorage.getItem(this.options.storageKey!);
  }

  private setStoredTheme(theme: string): void {
    localStorage.setItem(this.options.storageKey!, theme);
  }

  private getSystemPreference(): string {
    return this.mediaQuery?.matches ? 'dark' : 'light';
  }

  private getEffectiveTheme(): string {
    if (this.options.useSystemPreference && !this.getStoredTheme()) {
      return this.getSystemPreference();
    }
    return this.currentTheme;
  }

  private handleSystemPreference(e: MediaQueryListEvent): void {
    if (!this.getStoredTheme()) {
      this.applyTheme(e.matches ? 'dark' : 'light');
    }
  }

  private applyTheme(theme: string): void {
    // Remove previous theme
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.removeAttribute('data-theme');

    // Apply new theme
    document.documentElement.classList.add(`theme-${theme}`);
    document.documentElement.setAttribute('data-theme', theme);

    // Update current theme
    this.currentTheme = theme;
    this.setStoredTheme(theme);

    // Notify onChange callback
    this.options.onChange?.(theme);

    // Dispatch custom event
    const event = new CustomEvent('themechange', { 
      detail: { theme } 
    });
    document.dispatchEvent(event);
  }

  public setTheme(theme: 'light' | 'dark'): void {
    this.applyTheme(theme);
  }

  public toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  public getCurrentTheme(): string {
    return this.currentTheme;
  }

  public useSystemPreference(use: boolean): void {
    this.options.useSystemPreference = use;
    if (use) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemPreference.bind(this));
      if (!this.getStoredTheme()) {
        this.applyTheme(this.getSystemPreference());
      }
    } else {
      this.mediaQuery?.removeEventListener('change', this.handleSystemPreference.bind(this));
      this.mediaQuery = null;
    }
  }

  public destroy(): void {
    this.mediaQuery?.removeEventListener('change', this.handleSystemPreference.bind(this));
    document.documentElement.removeAttribute('data-theme-initialized');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('theme-light', 'theme-dark');
  }
}

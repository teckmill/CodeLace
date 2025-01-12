interface ThemeOptions {
    useSystemPreference?: boolean;
    defaultTheme?: 'light' | 'dark';
    storageKey?: string;
    onChange?: (theme: string) => void;
}
export declare class ThemeManager {
    private options;
    private currentTheme;
    private mediaQuery;
    constructor(options?: ThemeOptions);
    private initialize;
    private getStoredTheme;
    private setStoredTheme;
    private getSystemPreference;
    private getEffectiveTheme;
    private handleSystemPreference;
    private applyTheme;
    setTheme(theme: 'light' | 'dark'): void;
    toggleTheme(): void;
    getCurrentTheme(): string;
    useSystemPreference(use: boolean): void;
    destroy(): void;
}
export {};

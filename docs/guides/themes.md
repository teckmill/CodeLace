# CodeLace Theming Guide

CodeLace provides a flexible theming system that supports multiple themes, including dark mode and high contrast options.

## Available Themes

1. **Light Theme (Default)**
   - Default light mode appearance
   - Optimized for readability
   - Clean, minimal design

2. **Dark Theme**
   - Reduced eye strain in low-light conditions
   - Rich, dark color palette
   - Maintains accessibility standards

3. **High Contrast Theme**
   - Enhanced visibility for users with visual impairments
   - Strong contrast ratios
   - Clear visual boundaries
   - Optimized for screen readers

## Using Themes

### Basic Theme Switching

```html
<!-- Theme toggle button -->
<button onclick="themeManager.toggleTheme()">Toggle Theme</button>
```

```typescript
import { ThemeManager } from 'codelace';

// Initialize theme manager
const themeManager = new ThemeManager({
  useSystemPreference: true,
  defaultTheme: 'light',
  onChange: (theme) => {
    console.log(`Theme changed to: ${theme}`);
  }
});

// Set specific theme
themeManager.setTheme('dark');

// Toggle between light and dark
themeManager.toggleTheme();

// Get current theme
const currentTheme = themeManager.getCurrentTheme();
```

### System Preference Detection

```typescript
const themeManager = new ThemeManager({
  useSystemPreference: true
});
```

### Theme Persistence

Themes are automatically persisted in localStorage. To change the storage key:

```typescript
const themeManager = new ThemeManager({
  storageKey: 'my-app-theme'
});
```

## CSS Variables

### Light Theme (Default)
```scss
:root {
  --cl-body-bg: #ffffff;
  --cl-body-color: #212529;
  --cl-border-color: #dee2e6;
  // ... other variables
}
```

### Dark Theme
```scss
[data-theme="dark"] {
  --cl-body-bg: #121212;
  --cl-body-color: #e0e0e0;
  --cl-border-color: #2f2f2f;
  // ... other variables
}
```

### High Contrast Theme
```scss
[data-theme="high-contrast"] {
  --cl-body-bg: #ffffff;
  --cl-body-color: #000000;
  --cl-border-color: #000000;
  // ... other variables
}
```

## Creating Custom Themes

1. Create a new theme file:

```scss
// _custom-theme.scss
[data-theme="custom"] {
  // Base colors
  --cl-body-bg: #your-color;
  --cl-body-color: #your-color;
  --cl-border-color: #your-color;

  // Theme colors
  --cl-primary: #your-color;
  --cl-secondary: #your-color;
  // ... other colors

  // Component specific overrides
  .cl-btn {
    // Custom button styles
  }

  .cl-card {
    // Custom card styles
  }
}
```

2. Import your theme:

```scss
@import "themes/custom-theme";
```

3. Register the theme:

```typescript
const themeManager = new ThemeManager({
  themes: ['light', 'dark', 'high-contrast', 'custom']
});
```

## Best Practices

1. **Color Contrast**
   - Maintain WCAG 2.1 contrast ratios
   - Test with color contrast analyzers
   - Provide sufficient contrast for text

2. **Focus Indicators**
   - Keep visible focus indicators
   - Ensure focus rings are visible in all themes
   - Test keyboard navigation

3. **Text Readability**
   - Use appropriate font sizes
   - Maintain line height and spacing
   - Consider font weight adjustments

4. **Component States**
   - Test all interactive states
   - Ensure hover/focus states are visible
   - Maintain disabled state clarity

5. **Transitions**
   - Add smooth theme transitions
   - Consider reduced motion preferences
   - Test animation performance

## Theme Testing

1. **Visual Testing**
```typescript
// Test all themes
const themes = ['light', 'dark', 'high-contrast'];
themes.forEach(theme => {
  themeManager.setTheme(theme);
  // Visual verification
});
```

2. **Contrast Testing**
```typescript
function testContrast(bgcolor: string, textcolor: string): boolean {
  // Implementation of WCAG contrast ratio calculation
  return calculateContrastRatio(bgcolor, textcolor) >= 4.5;
}
```

3. **System Preference Testing**
```typescript
// Test system preference detection
themeManager.useSystemPreference(true);
// Verify theme changes with system preferences
```

## Examples

### Theme Toggle with Icons

```html
<button class="cl-theme-toggle" aria-label="Toggle theme">
  <span class="cl-theme-toggle-icon light">🌞</span>
  <span class="cl-theme-toggle-icon dark">🌙</span>
</button>
```

```typescript
const themeToggle = document.querySelector('.cl-theme-toggle');
themeToggle?.addEventListener('click', () => {
  themeManager.toggleTheme();
});
```

### Theme Selector

```html
<select class="cl-theme-select" aria-label="Select theme">
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="high-contrast">High Contrast</option>
</select>
```

```typescript
const themeSelect = document.querySelector('.cl-theme-select');
themeSelect?.addEventListener('change', (e) => {
  const target = e.target as HTMLSelectElement;
  themeManager.setTheme(target.value as 'light' | 'dark' | 'high-contrast');
});
```

## Related Resources

- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [prefers-color-scheme MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

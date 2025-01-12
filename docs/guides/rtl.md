# RTL Support Guide

CodeLace provides comprehensive Right-to-Left (RTL) support for building applications that need to support languages like Arabic, Hebrew, and Persian.

## Quick Start

1. Add the `dir` attribute to your HTML element:
```html
<html dir="rtl" lang="ar">
  <!-- Your content -->
</html>
```

2. Use RTL-aware utilities:
```html
<!-- Text alignment -->
<p class="cl-text-start">Right-aligned in RTL</p>
<p class="cl-text-end">Left-aligned in RTL</p>

<!-- Margins and padding -->
<div class="cl-ms-3">Margin-right in RTL</div>
<div class="cl-me-3">Margin-left in RTL</div>
```

## RTL Mixins

CodeLace provides several SASS mixins for RTL support:

### Basic Property Flipping
```scss
.my-component {
  @include rtl-property(margin-left, 1rem);
  // Outputs:
  // margin-left: 1rem;
  // [dir="rtl"] & { margin-right: 1rem; }
}
```

### Multiple Properties
```scss
.my-component {
  @include rtl-properties(
    (margin-left: 1rem),
    (padding-right: 2rem)
  );
}
```

### Transform Handling
```scss
.my-component {
  @include rtl-transform(translateX(100px));
  // Flips translation direction in RTL
}
```

### Flex Direction
```scss
.my-component {
  @include rtl-flex-direction(row);
  // Changes to row-reverse in RTL
}
```

### Background Position
```scss
.my-component {
  @include rtl-background-position(left center);
  // Changes to right center in RTL
}
```

## Utility Classes

### Text Alignment
```html
<p class="cl-text-start">Start-aligned text</p>
<p class="cl-text-end">End-aligned text</p>
```

### Margin and Padding
```html
<!-- Margin Start -->
<div class="cl-ms-0">No margin</div>
<div class="cl-ms-1">Small margin</div>
<div class="cl-ms-3">Large margin</div>

<!-- Margin End -->
<div class="cl-me-0">No margin</div>
<div class="cl-me-1">Small margin</div>
<div class="cl-me-3">Large margin</div>

<!-- Padding Start -->
<div class="cl-ps-3">Large padding</div>

<!-- Padding End -->
<div class="cl-pe-3">Large padding</div>
```

### Borders
```html
<div class="cl-border-start">Border on start side</div>
<div class="cl-border-end">Border on end side</div>
```

### Float
```html
<div class="cl-float-start">Floats left in LTR, right in RTL</div>
<div class="cl-float-end">Floats right in LTR, left in RTL</div>
```

### Position
```html
<div class="cl-start-0">Positioned at start</div>
<div class="cl-end-0">Positioned at end</div>
```

### Rounded Corners
```html
<div class="cl-rounded-start">Rounded corners on start side</div>
<div class="cl-rounded-end">Rounded corners on end side</div>
```

## Bidirectional Text Support

### Text Direction
```html
<span class="cl-text-dir-ltr">Left-to-right text</span>
<span class="cl-text-dir-rtl">Right-to-left text</span>
```

### Bidirectional Isolation
```html
<span class="cl-text-isolate">Isolated bidirectional text</span>
<span class="cl-text-bidi">Bidirectional override</span>
<span class="cl-text-plaintext">Plain text algorithm</span>
```

## Component RTL Support

### Modals
```html
<div class="cl-modal" dir="rtl">
  <div class="cl-modal-dialog">
    <div class="cl-modal-content">
      <!-- Content automatically adjusts for RTL -->
    </div>
  </div>
</div>
```

### Forms
```html
<form dir="rtl">
  <div class="cl-form-group">
    <label class="cl-form-label">Label</label>
    <input class="cl-form-control" type="text">
    <!-- Input padding and icons adjust automatically -->
  </div>
</form>
```

### Tables
```html
<table class="cl-table" dir="rtl">
  <!-- Table content aligns properly for RTL -->
</table>
```

## Best Practices

1. **Use Logical Properties**
   - Use `start` and `end` instead of `left` and `right`
   - Use RTL mixins for directional properties
   - Avoid hard-coded directional values

2. **Handle Icons and Images**
   ```html
   <!-- Flip icons in RTL -->
   <i class="cl-icon cl-rtl-flip">→</i>
   ```

3. **Text Alignment**
   ```html
   <!-- Use logical alignment classes -->
   <p class="cl-text-start">Aligned to start</p>
   ```

4. **Component Layout**
   ```html
   <!-- Use flex utilities -->
   <div class="cl-d-flex cl-rtl-reverse">
     <!-- Content reverses in RTL -->
   </div>
   ```

5. **Language-specific Adjustments**
   ```html
   <div lang="ar">
     <!-- Arabic-specific styles applied -->
   </div>
   ```

## Testing RTL Layouts

1. **Visual Testing**
   - Test with both RTL and LTR content
   - Verify component alignment
   - Check text flow and readability

2. **Content Testing**
   - Test with actual RTL language content
   - Verify number formatting
   - Check date formats

3. **Interactive Elements**
   - Test navigation flow
   - Verify scroll behavior
   - Check drag and drop functionality

## Common Issues and Solutions

1. **Icon Direction**
   ```scss
   // Solution: Use RTL icon mixin
   .icon-arrow {
     @include rtl-icon("→", "←");
   }
   ```

2. **Scroll Shadows**
   ```scss
   // Solution: Use logical values
   .scroll-container {
     @include rtl-background-position(left center);
   }
   ```

3. **Input Groups**
   ```scss
   // Solution: Use RTL-aware positioning
   .input-group {
     @include rtl-flex-direction(row);
   }
   ```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (basic support)

## Additional Resources

- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [RTL Styling Best Practices](https://rtlstyling.com/posts/rtl-styling)
- [Unicode Bidirectional Algorithm](https://www.w3.org/International/articles/inline-bidi-markup/)

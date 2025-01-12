# CodeLace Accessibility Guide

CodeLace is committed to ensuring our components are accessible to all users. This guide outlines our accessibility features, best practices, and implementation guidelines.

## Core Principles

1. **Keyboard Navigation**
   - All interactive elements are focusable
   - Logical tab order
   - Focus trapping in modals and dialogs
   - Visible focus indicators
   - Keyboard shortcuts where appropriate

2. **Screen Reader Support**
   - Semantic HTML
   - ARIA attributes
   - Live regions for dynamic content
   - Descriptive announcements
   - Hidden helper text

3. **Visual Accessibility**
   - High contrast support
   - Customizable focus indicators
   - Responsive design
   - Clear visual hierarchy
   - Sufficient color contrast

4. **Interaction Support**
   - Multiple interaction methods
   - Error prevention
   - Clear feedback
   - Adequate timing
   - Status messages

## Component-Specific Guidelines

### Modal Component

The Modal component implements comprehensive accessibility features:

```html
<!-- Example of an accessible modal -->
<div class="cl-modal" id="exampleModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="cl-modal-dialog" role="document">
    <div class="cl-modal-content">
      <div class="cl-modal-header">
        <h5 class="cl-modal-title" id="modalTitle">Accessible Modal</h5>
        <button data-dismiss="modal" aria-label="Close modal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="cl-modal-body">
        <!-- Modal content here -->
      </div>
    </div>
  </div>
</div>
```

#### Features:

1. **Keyboard Support**
   - `Tab`: Navigate through focusable elements
   - `Shift + Tab`: Navigate backwards
   - `Esc`: Close modal
   - Focus trap within modal
   - Focus restoration on close

2. **ARIA Attributes**
   - `role="dialog"`: Identifies as modal dialog
   - `aria-modal="true"`: Indicates modal behavior
   - `aria-labelledby`: Links to modal title
   - `aria-hidden`: Manages visibility
   - `aria-label`: Provides button descriptions

3. **Screen Reader Support**
   - Automatic announcements
   - Live regions for updates
   - Semantic structure
   - Clear heading hierarchy
   - Descriptive button labels

4. **Visual Accessibility**
   - High contrast mode support
   - Focus indicators
   - Clear visual boundaries
   - Adequate spacing
   - Responsive design

### Tab Component

The Tab component provides accessible navigation:

```html
<!-- Example of accessible tabs -->
<div class="cl-tabs">
  <div class="cl-tabs-list" role="tablist" aria-orientation="horizontal">
    <button role="tab" aria-selected="true" aria-controls="panel1" id="tab1">
      Tab 1
    </button>
    <button role="tab" aria-selected="false" aria-controls="panel2" id="tab2">
      Tab 2
    </button>
  </div>
  <div role="tabpanel" aria-labelledby="tab1" id="panel1">
    Panel 1 content
  </div>
  <div role="tabpanel" aria-labelledby="tab2" id="panel2" hidden>
    Panel 2 content
  </div>
</div>
```

#### Features:

1. **Keyboard Support**
   - `Tab/Shift+Tab`: Navigate to tabs
   - `Arrow keys`: Navigate between tabs
   - `Space/Enter`: Activate tab
   - `Home/End`: Jump to first/last tab

2. **ARIA Attributes**
   - `role="tablist"`: Container role
   - `role="tab"`: Tab role
   - `role="tabpanel"`: Content role
   - `aria-selected`: Selection state
   - `aria-controls`: Panel association

## Implementation Guidelines

1. **Focus Management**
   ```typescript
   // Example of proper focus management
   class AccessibleComponent {
     private focusableElements: HTMLElement[] = [];
     private firstFocusable: HTMLElement | null = null;
     private lastFocusable: HTMLElement | null = null;
     
     private updateFocusableElements(): void {
       this.focusableElements = Array.from(
         this.element.querySelectorAll(
           'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
         )
       );
       this.firstFocusable = this.focusableElements[0] || null;
       this.lastFocusable = this.focusableElements[this.focusableElements.length - 1] || null;
     }
   }
   ```

2. **Screen Reader Announcements**
   ```typescript
   // Example of screen reader announcement
   function announceToScreenReader(message: string): void {
     const announcement = document.createElement('div');
     announcement.setAttribute('aria-live', 'polite');
     announcement.classList.add('cl-sr-only');
     announcement.textContent = message;
     document.body.appendChild(announcement);
     setTimeout(() => announcement.remove(), 1000);
   }
   ```

3. **Keyboard Event Handling**
   ```typescript
   // Example of keyboard event handling
   private handleKeydown(event: KeyboardEvent): void {
     switch (event.key) {
       case 'Tab':
         // Handle focus trap
         break;
       case 'Escape':
         // Handle escape action
         break;
       case 'ArrowRight':
       case 'ArrowLeft':
         // Handle horizontal navigation
         break;
     }
   }
   ```

## Testing Accessibility

1. **Keyboard Testing**
   - Verify all interactive elements are focusable
   - Check focus order is logical
   - Ensure focus trap works in modals
   - Test all keyboard shortcuts

2. **Screen Reader Testing**
   - Test with multiple screen readers
   - Verify announcements are clear
   - Check semantic structure
   - Validate ARIA attributes

3. **Visual Testing**
   - Test with high contrast mode
   - Verify focus indicators
   - Check color contrast
   - Test responsive behavior

4. **Automated Testing**
   - Use accessibility testing tools
   - Run regular audits
   - Validate HTML structure
   - Check WCAG compliance

## Resources

- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Accessible Rich Internet Applications (ARIA)](https://www.w3.org/TR/wai-aria/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

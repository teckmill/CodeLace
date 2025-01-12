# Modal Component

The Modal component provides a flexible and accessible way to display content in a dialog overlay.

## Features

- Fully accessible with keyboard navigation and screen reader support
- Multiple size options
- Centered and scrollable variants
- Focus management and restoration
- Backdrop options
- Animation support

## Basic Usage

```html
<div class="cl-modal" id="exampleModal">
  <div class="cl-modal-dialog">
    <div class="cl-modal-content">
      <div class="cl-modal-header">
        <h5 class="cl-modal-title">Modal Title</h5>
        <button data-dismiss="modal" aria-label="Close modal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="cl-modal-body">
        Modal content goes here
      </div>
      <div class="cl-modal-footer">
        <button class="cl-btn cl-btn-secondary" data-dismiss="modal">Close</button>
        <button class="cl-btn cl-btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
```

## JavaScript Usage

```typescript
import { Modal } from 'codelace';

// Initialize modal
const modal = new Modal('#exampleModal', {
  backdrop: true,
  keyboard: true,
  focus: true,
  size: 'md',
  centered: false,
  scrollable: false
});

// Show modal
modal.show();

// Hide modal
modal.hide();

// Destroy modal
modal.destroy();
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backdrop` | `boolean \| 'static'` | `true` | Enable backdrop. 'static' prevents closing on backdrop click |
| `keyboard` | `boolean` | `true` | Enable closing with Escape key |
| `focus` | `boolean` | `true` | Enable automatic focus management |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Modal size |
| `centered` | `boolean` | `false` | Vertically center modal |
| `scrollable` | `boolean` | `false` | Enable scrollable modal body |

## Events

| Event | Description |
|-------|-------------|
| `onShow` | Triggered before modal is shown |
| `onShown` | Triggered after modal is shown |
| `onHide` | Triggered before modal is hidden |
| `onHidden` | Triggered after modal is hidden |

## Accessibility Features

### Keyboard Navigation

- `Tab`: Navigate through focusable elements
- `Shift + Tab`: Navigate backwards
- `Esc`: Close modal (when `keyboard: true`)
- Focus is trapped within modal when open
- Focus is restored to trigger element on close

### ARIA Attributes

- `role="dialog"`: Identifies the modal as a dialog
- `aria-modal="true"`: Indicates modal behavior
- `aria-labelledby`: Links modal title
- `aria-hidden`: Manages visibility
- `aria-label`: Provides button descriptions

### Screen Reader Support

```html
<!-- Example with screen reader support -->
<button data-modal-target="exampleModal" aria-label="Open settings modal">
  Settings
</button>

<div class="cl-modal" id="exampleModal" 
     role="dialog" 
     aria-modal="true" 
     aria-labelledby="modalTitle"
     aria-describedby="modalDescription">
  <div class="cl-modal-dialog" role="document">
    <div class="cl-modal-content">
      <div class="cl-modal-header">
        <h5 class="cl-modal-title" id="modalTitle">Settings</h5>
        <button data-dismiss="modal" aria-label="Close settings modal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="cl-modal-body">
        <p id="modalDescription" class="cl-sr-only">
          Settings panel for adjusting application preferences
        </p>
        <!-- Modal content -->
      </div>
    </div>
  </div>
</div>
```

### Focus Management

The modal implements sophisticated focus management:

1. Stores the trigger element that opened the modal
2. Automatically focuses the first focusable element
3. Traps focus within the modal while open
4. Restores focus to trigger element on close

```typescript
// Example of custom focus element
<button data-modal-focus>
  This will receive focus when modal opens
</button>
```

## Variants

### Sizes

```html
<!-- Small modal -->
<div class="cl-modal cl-modal-sm">...</div>

<!-- Medium modal (default) -->
<div class="cl-modal cl-modal-md">...</div>

<!-- Large modal -->
<div class="cl-modal cl-modal-lg">...</div>

<!-- Extra large modal -->
<div class="cl-modal cl-modal-xl">...</div>
```

### Centered Modal

```html
<div class="cl-modal cl-modal-centered">...</div>
```

### Scrollable Modal

```html
<div class="cl-modal cl-modal-scrollable">...</div>
```

## Best Practices

1. **Semantic Structure**
   - Use proper heading hierarchy
   - Include descriptive labels
   - Maintain logical tab order

2. **Focus Management**
   - Set initial focus appropriately
   - Ensure focus trap works
   - Restore focus on close

3. **Screen Reader Support**
   - Provide descriptive announcements
   - Use proper ARIA attributes
   - Include hidden descriptive text

4. **Visual Design**
   - Ensure sufficient contrast
   - Make focus indicators visible
   - Provide clear visual hierarchy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (basic support)

## Known Issues

1. iOS VoiceOver may announce modal content twice
   - Workaround: Use `aria-atomic="true"`

2. Focus trap may fail in some screen readers
   - Workaround: Additional focus management code included

## Examples

### Basic Modal

```html
<button class="cl-btn cl-btn-primary" data-modal-target="basicModal">
  Open Modal
</button>

<div class="cl-modal" id="basicModal">
  <div class="cl-modal-dialog">
    <div class="cl-modal-content">
      <div class="cl-modal-header">
        <h5 class="cl-modal-title">Basic Modal</h5>
        <button data-dismiss="modal" aria-label="Close modal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="cl-modal-body">
        This is a basic modal example
      </div>
    </div>
  </div>
</div>
```

### Scrollable Modal with Custom Focus

```html
<div class="cl-modal cl-modal-scrollable">
  <div class="cl-modal-dialog">
    <div class="cl-modal-content">
      <div class="cl-modal-header">
        <h5 class="cl-modal-title">Scrollable Modal</h5>
        <button data-dismiss="modal" aria-label="Close modal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="cl-modal-body">
        <button data-modal-focus class="cl-btn cl-btn-primary">
          This button receives initial focus
        </button>
        <!-- Long content here -->
      </div>
    </div>
  </div>
</div>
```

## Related Components

- [Dialog](dialog.md)
- [Popover](popover.md)
- [Tooltip](tooltip.md)

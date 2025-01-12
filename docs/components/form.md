# Form Components

CodeLace provides a comprehensive set of form components to help you build beautiful and functional forms. Each component is designed with accessibility, usability, and customization in mind.

## Input

A versatile input component with built-in validation and styling options.

```typescript
import { Input } from '@codinglace/css';

const input = new Input('#myInput', {
    type: 'text',
    placeholder: 'Enter your name',
    label: 'Full Name',
    helperText: 'Please enter your full name',
    validation: {
        required: true,
        minLength: 2
    }
});
```

### Features
- Multiple input types (text, password, email, etc.)
- Built-in validation
- Helper text and error states
- Icon support (left/right)
- Clear button option
- Different sizes
- Disabled and readonly states

## TextArea

An enhanced textarea component with auto-resize capability.

```typescript
import { TextArea } from '@codinglace/css';

const textarea = new TextArea('#myTextarea', {
    placeholder: 'Enter your message',
    label: 'Message',
    autoResize: true,
    minRows: 3,
    maxRows: 10
});
```

### Features
- Auto-resize functionality
- Min/max rows control
- Built-in validation
- Helper text
- Custom resize behavior
- Spellcheck control

## Select

A modern select component with search and multiple selection support.

```typescript
import { Select } from '@codinglace/css';

const select = new Select('#mySelect', {
    multiple: true,
    searchable: true,
    placeholder: 'Select options',
    options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' }
    ]
});
```

### Features
- Single and multiple selection
- Search functionality
- Clear selection option
- Custom option rendering
- Keyboard navigation
- Disabled states
- Loading state

## Radio

A flexible radio button group component.

```typescript
import { Radio } from '@codinglace/css';

const radio = new Radio('#myRadio', {
    options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    layout: 'inline'
});
```

### Features
- Inline and stacked layouts
- Custom styling
- Disabled states
- Required validation
- Group label support

## Checkbox

A powerful checkbox component with indeterminate state support.

```typescript
import { Checkbox } from '@codinglace/css';

const checkbox = new Checkbox('#myCheckbox', {
    label: 'Enable feature',
    indeterminate: true,
    checked: true
});
```

### Features
- Single and multiple selections
- Indeterminate state
- Group selection methods
- Custom styling
- Inline and stacked layouts

## Switch

A toggle switch component with multiple states.

```typescript
import { Switch } from '@codinglace/css';

const switch = new Switch('#mySwitch', {
    checked: true,
    size: 'large',
    label: 'Dark mode',
    labelPosition: 'left'
});
```

### Features
- Multiple sizes
- Custom colors
- Label positioning
- Loading state
- Disabled state
- Keyboard accessibility

## NumberInput

A numeric input component with increment/decrement controls.

```typescript
import { NumberInput } from '@codinglace/css';

const numberInput = new NumberInput('#myNumberInput', {
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    precision: 0,
    prefix: '$',
    controls: true
});
```

### Features
- Increment/decrement buttons
- Min/max constraints
- Step size control
- Precision control
- Prefix/suffix support
- Custom validation
- Keyboard accessibility

## Styling

All form components use CSS variables for easy theming:

```css
:root {
    --cl-primary: #3b82f6;
    --cl-primary-alpha: rgba(59, 130, 246, 0.2);
    --cl-danger: #ef4444;
    --cl-danger-alpha: rgba(239, 68, 68, 0.2);
    --cl-text-primary: #1f2937;
    --cl-text-secondary: #6b7280;
    --cl-text-disabled: #9ca3af;
    --cl-bg-primary: #ffffff;
    --cl-bg-secondary: #f3f4f6;
    --cl-bg-disabled: #e5e7eb;
    --cl-border-color: #d1d5db;
    --cl-border-radius: 0.375rem;
    --cl-font-size-sm: 0.875rem;
    --cl-font-size-base: 1rem;
    --cl-font-size-lg: 1.125rem;
}
```

## Accessibility

All form components are built with accessibility in mind:
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Error announcements
- Screen reader support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Contributing

We welcome contributions! Please see our [Contributing Guide](../guides/contributing.md) for details.

# CodeLace

A modern, lightweight CSS framework with TypeScript components, focusing on performance, accessibility, and developer experience.

## Features

- 🚀 Lightweight and performant
- 🎨 Modern design system
- ♿ Accessibility-first approach
- 📱 Mobile-first responsive design
- 🔧 TypeScript components
- 🎯 Zero dependencies (except floating-ui for advanced positioning)
- 🛠️ Modular architecture
- 📦 Tree-shakeable

## Components

- Alert System
- Tab System
- Popover
- Modal
- Dropdown
- Toast Notifications
- Collapse/Accordion
- Forms
- Cards
- Navbar
- More coming soon...

## Installation

### NPM
```bash
npm install codelace
```

### Yarn
```bash
yarn add codelace
```

### CDN
```html
<!-- CSS -->
<link href="https://unpkg.com/codelace@1.0.0/dist/css/codelace.min.css" rel="stylesheet">

<!-- JavaScript -->
<script src="https://unpkg.com/codelace@1.0.0/dist/js/codelace.min.js"></script>
```

## Usage

### JavaScript/TypeScript

```typescript
// Import specific components
import { Tab, Popover, Modal } from 'codelace';

// Import styles
import 'codelace/css'; // or import 'codelace/dist/css/codelace.min.css';

// Initialize components
const tab = new Tab('#myTab');

const popover = new Popover('#myPopover', {
  content: 'Hello World!',
  placement: 'top',
  offset: 8
});

const modal = new Modal('#myModal', {
  backdrop: true,
  keyboard: true
});
```

### HTML

```html
<!-- Tab System -->
<div class="cl-tabs" id="myTab">
  <ul class="cl-tab-list" role="tablist">
    <li class="cl-tab-item">
      <button class="cl-tab-link active" data-toggle="tab" data-target="#home">Home</button>
    </li>
    <li class="cl-tab-item">
      <button class="cl-tab-link" data-toggle="tab" data-target="#profile">Profile</button>
    </li>
  </ul>
  <div class="cl-tab-content">
    <div class="cl-tab-pane active" id="home">Home content</div>
    <div class="cl-tab-pane" id="profile">Profile content</div>
  </div>
</div>

<!-- Modal -->
<button class="cl-btn cl-btn-primary" data-toggle="modal" data-target="#myModal">
  Open Modal
</button>

<div class="cl-modal" id="myModal">
  <div class="cl-modal-dialog">
    <div class="cl-modal-content">
      <div class="cl-modal-header">
        <h5 class="cl-modal-title">Modal Title</h5>
        <button class="cl-modal-close" data-dismiss="modal">&times;</button>
      </div>
      <div class="cl-modal-body">
        Modal content goes here...
      </div>
      <div class="cl-modal-footer">
        <button class="cl-btn cl-btn-secondary" data-dismiss="modal">Close</button>
        <button class="cl-btn cl-btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
```

### Using SASS

```scss
// Import all styles
@import "codelace/scss/codelace";

// Or import specific components
@import "codelace/scss/components/buttons";
@import "codelace/scss/components/modals";
@import "codelace/scss/components/tabs";

// Customize variables
$primary: #007bff;
$secondary: #6c757d;
$success: #28a745;
// ... more variables
```

## Browser Support

CodeLace supports all modern browsers:

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- iOS >= 12
- Edge >= 79

## Documentation

Comprehensive documentation is coming soon. In the meantime, you can:

- Check the [examples](examples/) directory for usage examples
- View the [source code](js/src/) for TypeScript component documentation
- Browse the [SCSS files](scss/) for style customization options

## Contributing

1. Fork it (https://github.com/teckmill/CodeLace/fork)
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Floating UI](https://floating-ui.com/) for advanced positioning
- The open source community for inspiration and best practices

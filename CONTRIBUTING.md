# Contributing to CodeLace

First off, thank you for considering contributing to CodeLace! It's people like you that make CodeLace such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

If you have a suggestion for a new feature or enhancement:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain the behavior you expected to see
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the JavaScript/TypeScript styleguide
* Include screenshots in your pull request whenever possible
* End all files with a newline
* Avoid platform-dependent code

## Development Process

1. Fork the repo
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the tests (`npm test`)
5. Commit your changes (`git commit -am 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Create a Pull Request

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build the project:
```bash
npm run build
```

### Coding Style

* Use 2 spaces for indentation
* Use semicolons
* Use meaningful variable names
* Comment your code when necessary
* Follow TypeScript best practices

## Project Structure

```
codelace/
├── build/          # Build configuration
├── dist/           # Compiled files
├── js/             # TypeScript source
│   └── src/
│       ├── components/
│       └── utils/
├── scss/           # SCSS source
│   ├── components/
│   └── utilities/
└── types/          # TypeScript definitions
```

## Questions?

Feel free to open an issue or contact the maintainers if you have any questions.

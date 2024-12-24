# Contributing to Reactive 🚀

First off, thank you for considering contributing to Reactive! We're excited to have you join our community.

## Quick Links

- [I'm New to Open Source](#new-to-open-source)
- [I'm an Experienced Contributor](#experienced-contributor-guide)

## Choose Your Path

### 🌱 Are you new to open source?
If this is your first time contributing to an open source project, head over to our [New to Open Source](#new-to-open-source) section. We've created a beginner-friendly guide just for you!

### 🚀 Already familiar with open source?
If you're an experienced contributor, check out our [Experienced Contributor Guide](#experienced-contributor-guide) to get started right away.

---

# New to Open Source

Welcome to your first open source contribution! We're here to help you get started. 

## 1. First Steps 👣

Don't worry if this seems like a lot - we'll help you through it! Here's what you'll need:

- A GitHub account (it's free!)
- Git installed on your computer ([Download here](https://git-scm.com/downloads))
- VS Code ([Download here](https://code.visualstudio.com/))

## 2. Getting Ready 🎯

1. **Fork the Repository**
   - Go to our [GitHub repository](https://github.com/oslabs-beta/reactive)
   - Click the "Fork" button in the top right
   - This creates your own copy of our project!

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/reactive.git
   ```
   (Replace YOUR-USERNAME with your GitHub username)

## 3. Make Your First Contribution 🎉

### Types of Good First Issues

At Reactive, we maintain several types of beginner-friendly issues:

#### TypeScript Migration Tasks
- Convert individual JavaScript/JSX files to TypeScript/TSX
- Perfect for learning TypeScript in a real project
- Clear guidelines and examples provided
- Focus on single, self-contained components

#### Documentation & User Experience
- Create usage examples for specific features
- Add demo GIFs of key workflows
- Develop clear, illustrative screenshots
- Each task comes with clear requirements and examples

### Getting Started with an Issue

1. **Find an Issue**
   - Look for issues labeled `good first issue` in our repository
   - Comment on the issue saying you'd like to work on it
   - We'll guide you through it!

2. **Make Changes**
   - Create a new branch following our naming convention:
   ```bash
   git checkout -b feature/GH-123-brief-description
   ```
   Where:
   - `feature/` indicates it's a new feature
   - `GH-123` is the GitHub issue number
   - `brief-description` is 2-4 words describing the change
   
   For example:
   ```bash
   git checkout -b feature/GH-45-convert-app-tsx
   git checkout -b feature/GH-52-add-usage-demo
   ```
   - Make your changes
   - Test them out
   - Follow the issue's specific guidelines

3. **Submit Your Work**
   - Push your changes
   - Create a Pull Request
   - We'll review it and provide feedback!

### Tips for Success
- Read the entire issue description before starting
- Ask questions if anything is unclear
- Keep changes focused on the issue scope
- Test your changes thoroughly
- Update any relevant documentation

## 4. Need Help? 🤝

- Comment on the issue you're working on
- Join our community (coming soon)
- Check out these helpful resources:
  - [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
  - [GitHub's Hello World Guide](https://guides.github.com/activities/hello-world/)
  - [How to Create a Pull Request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)

---

# Experienced Contributor Guide

## Development Environment

### Prerequisites
- Node.js (v14+)
- VS Code
- Git

### Setup
1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Contribution Guidelines

### Code Style
- Use TypeScript
- Follow existing code formatting
- Add comments for complex logic
- Include tests for new features

### Pull Request Process
1. Update documentation as needed
2. Add tests for new features
3. Ensure all tests pass
4. Update the README if needed
5. Reference any related issues

### Commit Conventions
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Reference issues in commit messages

### Testing
- Write Jest/React Testing Library tests
- Ensure existing tests pass
- Test across different VS Code versions

## Project Structure
```
reactive/
├── src/           # Source code
├── test/          # Test files
├── docs/          # Documentation
└── examples/      # Example files
```

## Review Process
1. Submit Pull Request
2. Address review feedback
3. Ensure CI checks pass
4. Await maintainer review

## Getting Help
- Check existing issues and documentation
- Open a new issue with the question label
- Join our community discussions

## Development Environment

For detailed information about the npm scripts available in the project, their purposes, and when to use them during development, please refer to the [Development Scripts Guide](DEVELOPMENT_SCRIPTS.md).

---

Thank you for contributing to Reactive! 🎉
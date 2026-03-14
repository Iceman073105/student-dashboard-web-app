## Running Tests
<!-- This section explains how to run automated tests for the project -->

This project uses **Vitest** for automated testing.
<!-- Vitest is the testing framework used to verify parts of the application -->

The tests currently verify core functionality in the assignment system, including:
- Creating an assignment
- Toggling an assignment’s completed status
<!-- These describe what the tests are checking -->

### How to Run Tests
<!-- Step instructions for someone using the project -->

Open a terminal in the project folder and run:

```bash
npm test
```

Vitest will automatically find the test files and run them.
<!-- Explains what happens when the command runs -->

The results will appear in the terminal showing which tests passed or failed.
<!-- Explains the output -->

Example output:

```
✓ should create an assignment object
✓ should toggle assignment completed status

Test Files  1 passed
Tests       2 passed
```
<!-- Example output helps users understand what success looks like -->
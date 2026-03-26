# Release Notes - v1.0-rc

## What's Included

This release candidate includes the core student dashboard features:
- User signup and login
- Protected dashboard access
- Assignment creation, editing, deletion, and completion toggle
- Assignment filtering
- Notes management
- Schedule management
- Dashboard summary statistics
- Automated tests for assignment store behavior
- Hosted deployment on Netlify

## Known Issues

- This project currently uses localStorage instead of a full backend database.
- Manual deployment requires rebuilding the project and uploading the `dist` folder again.
- Authentication is frontend-only and intended for project/demo use, not production security.

## How to Run

1. Open the project folder in a terminal
2. Install dependencies:

```bash
npm install

```

3. Start the development server:

```bash
npm run dev
```

4. Run automated tests:

```bash
npm test
```

5. Create a production build:

```bash
npm run build
```

## Deployment

Live URL:
https://regal-cascaron-ff677f.netlify.app

This release was deployed using Netlify by uploading the production `dist` folder after running a Vite build.

## Notes

This version is intended as a release candidate for Milestone 6. It is deployable, testable, and includes setup documentation, a sample environment file, and hosted deployment proof.
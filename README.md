# Name Examination

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install

# yarn
yarn install

# npm
npm install

```

## Setup Environment Variables

```bash

cp .env.example .env

```
You will need to fill in the Firebase variables for the project to run.

## Linting

```bash
pnmp run lint
```

## Testing

```Vitest
pnmp run test
```

```Cyprus
npx cypress open

## Development Server

Start the development server on http://localhost:8080

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

Checkout the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Open Cluster Management UI Components

React shared UI component library for open cluster management.

[Storybook](https://open-cluster-management.github.io/ui-components/index.html)

## Prerequisites

- [node.js](https://nodejs.org/) version 12.x

## Installation

1. Install dependencies

   ```
   npm ci
   ```

2. Run unit tests

   ```
   npm test
   ```

3. Run style checks

   ```
   npm run lint
   ```

4. Start the storybook

   ```
   npm start
   ```

## Adding a new component

1. Add a new component directory to src with

      - Component
      - Tests
      - Storybook

2. Export the component in src/index.ts
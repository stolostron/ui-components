# Open Cluster Management UI Components

React shared UI component library for open cluster management.

![build](https://github.com/open-cluster-management/ui-components/workflows/build/badge.svg)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=open-cluster-management_ui-components&metric=coverage&token=64149a11d78bff9de4105c800b8ec2219dae4ea4)](https://sonarcloud.io/dashboard?id=open-cluster-management_ui-components)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=open-cluster-management_ui-components&metric=vulnerabilities&token=64149a11d78bff9de4105c800b8ec2219dae4ea4)](https://sonarcloud.io/dashboard?id=open-cluster-management_ui-components)

[Storybook of Components](https://open-cluster-management.github.io/ui-components/index.html)

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

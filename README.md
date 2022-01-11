[comment]: # ( Copyright Contributors to the Open Cluster Management project )

# Open Cluster Management UI Components

React shared UI component library for open cluster management.

[![Build Status](https://travis-ci.com/stolostron/ui-components.svg?branch=main)](https://travis-ci.com/stolostron/ui-components)
[![npm version](https://badge.fury.io/js/%40stolostron%2Fui-components.svg)](https://badge.fury.io/js/%40stolostron%2Fui-components)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=open-cluster-management_ui-components&metric=coverage&token=64149a11d78bff9de4105c800b8ec2219dae4ea4)](https://sonarcloud.io/dashboard?id=open-cluster-management_ui-components)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=open-cluster-management_ui-components&metric=vulnerabilities&token=64149a11d78bff9de4105c800b8ec2219dae4ea4)](https://sonarcloud.io/dashboard?id=open-cluster-management_ui-components)

[Storybook of Components](https://stolostron.github.io/ui-components/index.html)

## Prerequisites

- [node.js](https://nodejs.org/) version 14.x

## Installation

1. Install dependencies

   ```
   npm ci
   ```

2. Run tests

   ```
   npm test
   ```

3. Start the storybook

   ```
   npm start
   ```

## Adding a new component

1. Add a new component directory to src with

      - Component
      - Tests
      - Storybook

2. Export the component in src/index.ts

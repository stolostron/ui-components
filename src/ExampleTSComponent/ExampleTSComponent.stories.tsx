import React from 'react';
import ExampleTSComponent from './ExampleTSComponent';

export default {
    title: 'Example TS Component',
    component: ExampleTSComponent,
};

export const Example = (): JSX.Element => (
    <ExampleTSComponent text="Example TS Component" />
);

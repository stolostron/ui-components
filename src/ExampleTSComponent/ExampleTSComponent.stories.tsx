import React from 'react';
import ExampleTSComponent from './ExampleTSComponent';

export default {
    title: 'Example TS Component',
    component: ExampleTSComponent,
};

export const Header1 = (): JSX.Element => <ExampleTSComponent text="world" />;

import React from 'react';
import ExampleTSComponent from './ExampleTSComponent';

export default {
    title: 'UI/Headers',
    component: ExampleTSComponent,
};

export const Header1 = (): JSX.Element => <ExampleTSComponent text="world" />;

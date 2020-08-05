import React from 'react';

export interface Props {
    name: string;
}

export function ExampleComponent({ name }: Props): JSX.Element {
    return <h1>Hello {name}</h1>;
}

export default ExampleComponent;

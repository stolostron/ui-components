import React from 'react';

export interface Props {
    text: string;
}

export function ExampleTSComponent({ text }: Props): JSX.Element {
    return <h1>{text}</h1>;
}

export default ExampleTSComponent;

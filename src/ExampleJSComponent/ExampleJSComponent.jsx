import React from 'react';
import PropTypes from 'prop-types';

export function ExampleJSComponent(props) {
    return <h1>{props.text}</h1>;
}

ExampleJSComponent.propTypes = {
    text: PropTypes.string.isRequired,
};

export default ExampleJSComponent;

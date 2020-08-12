import React from 'react';
import { shallow } from 'enzyme';
import ExampleJSComponent from './ExampleJSComponent';

describe('ExampleJSComponent', () => {
    test('Render a h1 element', () => {
        const wrapper = shallow(<ExampleJSComponent text="world" />);
        expect(wrapper.find('h1').length).toBe(1);
    });
});

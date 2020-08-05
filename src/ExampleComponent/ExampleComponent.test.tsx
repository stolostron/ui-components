import React from 'react';
import { shallow } from 'enzyme';
import ExampleComponent from './ExampleComponent';

describe('ExampleComponent', () => {
    test('Render a h1 element', () => {
        const wrapper = shallow(<ExampleComponent name="you" />);
        expect(wrapper.find('h1').length).toBe(1);
    });
});

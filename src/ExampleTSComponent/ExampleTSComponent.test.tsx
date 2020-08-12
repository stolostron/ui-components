import React from 'react';
import { shallow } from 'enzyme';
import ExampleTSComponent from './ExampleTSComponent';

describe('ExampleTSComponent', () => {
    test('Render a h1 element', () => {
        const wrapper = shallow(<ExampleTSComponent text="world" />);
        expect(wrapper.find('h1').length).toBe(1);
    });
});

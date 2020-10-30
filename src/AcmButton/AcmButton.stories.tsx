import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmButton } from './AcmButton'

const meta: Meta = {
    title: 'Button',
    component: AcmButton,
    argTypes: {
        isDisabled: { control: 'boolean' },
    },
}
export default meta

export const Button = (args) => <AcmButton {...args}>Button</AcmButton>

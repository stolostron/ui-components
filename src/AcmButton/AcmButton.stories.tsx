import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmButton } from './AcmButton'
import { ButtonVariant } from '@patternfly/react-core'

const meta: Meta = {
    title: 'Button',
    component: AcmButton,
    argTypes: {
        isDisabled: { control: 'boolean' },
        text: { type: 'string' },
        variant: {
            control: { type: 'select', options: Object.values(ButtonVariant) },
        },
    },
}
export default meta

export const Button = (args) => <AcmButton {...args}>{args.text}</AcmButton>
Button.args = { text: 'Button' }

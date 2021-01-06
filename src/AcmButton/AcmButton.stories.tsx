import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmButton } from './AcmButton'
import { ButtonVariant, Button } from '@patternfly/react-core'

const meta: Meta = {
    title: 'Button',
    component: AcmButton,
    argTypes: {
        isDisabled: { control: 'boolean' },
        text: { type: 'string' },
        tooltip: { type: 'string' },
        variant: {
            control: { type: 'select', options: Object.values(ButtonVariant) },
        },
    },
}
export default meta

export const Button = (args) => (
    <div style={{ margin: '50px 0px 0px 50px' }}>
        <AcmButton {...args} onClick={() => alert('clicked')}>
            {args.text}
        </AcmButton>
    </div>
)
Button.args = { text: 'Button', tooltip: 'Tooltip message here' }

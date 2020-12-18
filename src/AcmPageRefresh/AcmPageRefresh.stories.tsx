import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmPageRefresh } from './AcmPageRefresh'

const meta: Meta = {
    title: 'PageRefresh',
    component: AcmPageRefresh,
    argTypes: {
    },
}
export default meta

export const PageRefresh = (args) => (
    <div style={{ margin: '50px 0px 0px 50px' }}>
        <AcmPageRefresh {...args} onClick={() => console.log('clicked')}>
            {args.text}
        </AcmPageRefresh>
    </div>
)
PageRefresh.args = { text: 'PageRefresh'}

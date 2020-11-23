import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmTemplateIcon } from './AcmIcons'

const meta: Meta = {
    title: 'Icons',
    component: AcmIcons,
}
export default meta

export const AcmIcons = () => {
    return <AcmTemplateIcon />
}

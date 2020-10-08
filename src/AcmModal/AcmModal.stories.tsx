import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { Meta } from '@storybook/react'
import { AcmModal } from './AcmModal'
import { AcmButton } from '../'

const meta: Meta = {
    title: 'Modal',
    component: AcmModal,
}
export default meta

export const Modal = () => {
    const [open, toggleOpen] = useState<boolean>(true)
    return (
        <React.Fragment>
            <AcmButton onClick={() => toggleOpen(true)}>Open Modal</AcmButton>
            <AcmModal
                open={open}
                submit={() => toggleOpen((prevOpen) => !prevOpen)}
                cancel={() => toggleOpen((prevOpen) => !prevOpen)}
                title="ACM Modal"
                message="Modal message here"
            />
        </React.Fragment>
    )
}

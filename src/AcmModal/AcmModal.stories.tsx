import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
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
        <div>
            <AcmButton onClick={() => toggleOpen(true)}>Open Modal</AcmButton>
            {(() => {
                return ReactDOM.createPortal(
                    <AcmModal
                        open={open}
                        submit={() => toggleOpen((prevOpen) => !prevOpen)}
                        cancel={() => toggleOpen((prevOpen) => !prevOpen)}
                        title="ACM Modal"
                        message="Modal message here"
                    />,
                    document.querySelector('body')
                )
            })()}
        </div>
    )
}

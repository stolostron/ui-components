import React from 'react'
import { Modal, Button, ModalVariant } from '@patternfly/react-core'

export interface IModalProps {
    open: boolean
    submit: () => void
    cancel: () => void
    title: string
    message: string
}

export const ClosedModalProps: IModalProps = {
    open: false,
    submit: () => {
        /**/
    },
    cancel: () => {
        /**/
    },
    title: '',
    message: '',
}

export function AcmModal(props: IModalProps) {
    return (
        <Modal
            variant={ModalVariant.medium}
            title={props.title}
            isOpen={props.open}
            onClose={() => props.cancel()}
            actions={[
                <Button key="confirm" variant="primary" onClick={() => props.submit()}>
                    Submit
                </Button>,
                <Button key="cancel" variant="link" onClick={() => props.cancel()}>
                    Cancel
                </Button>,
            ]}
        >
            {props.message}
        </Modal>
    )
}

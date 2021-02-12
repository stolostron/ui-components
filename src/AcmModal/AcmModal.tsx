import React from 'react'
import { Modal, ModalProps } from '@patternfly/react-core'
import { AcmAlertProvider } from '../AcmAlert/AcmAlert'

export function AcmModal(props: ModalProps) {
    return (
        <AcmAlertProvider>
            <Modal {...props} ref={null} />
        </AcmAlertProvider>
    )
}

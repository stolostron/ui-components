import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmForm } from '../AcmForm/AcmForm'
import { AcmLabelsInput } from './AcmLabelsInput'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'

export default {
    title: 'LabelsInput',
    component: AcmLabelsInput,
}

export const LabelsInput = () => {
    const [value, setValue] = useState<string[]>([])

    return (
        <AcmPage>
            <AcmPageHeader title="AcmLabelsInput"></AcmPageHeader>
            <AcmPageCard>
                <AcmForm>
                    <AcmLabelsInput label="Label" id="123" value={value} onChange={setValue} />
                </AcmForm>
            </AcmPageCard>
        </AcmPage>
    )
}

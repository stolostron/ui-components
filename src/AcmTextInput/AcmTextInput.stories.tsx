import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmForm } from '../AcmForm/AcmForm'
import { AcmTextInput } from './AcmTextInput'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'

export default {
    title: 'AcmTextInput',
    component: AcmTextInput,
}

export const TextInput = () => {
    const [value, setValue] = useState<string>()

    return (
        <AcmPage>
            <AcmPageHeader title="AcmTextInput"></AcmPageHeader>
            <AcmPageCard>
                <AcmForm>
                    <AcmTextInput label="Label" id="123" value={value} onChange={setValue} />
                    <AcmTextInput label="Secret" id="456" value={value} onChange={setValue} secret required />
                </AcmForm>
            </AcmPageCard>
        </AcmPage>
    )
}

import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmForm } from './AcmForm'
import { AcmSelect } from '../AcmSelect/AcmSelect'
import { AcmTextInput } from '../AcmTextInput/AcmTextInput'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'
import { AcmLabelsInput } from '../AcmLabelsInput/AcmLabelsInput'

export default {
    title: 'Form',
    component: AcmForm,
}

export const Form = () => {
    const [value, setValue] = useState<string>()
    const [select, setSelect] = useState<string>()
    const [labels, setLabels] = useState<string[]>()
    return (
        <AcmPage>
            <AcmPageHeader title="Page Header"></AcmPageHeader>
            <AcmPageCard>
                <AcmForm>
                    <AcmTextInput label="Text Input" id="textInput" value={value} onChange={setValue} required />
                    <AcmTextInput
                        label="Secret Input"
                        id="secretInput"
                        value={value}
                        onChange={setValue}
                        secret
                        required
                    />
                    <AcmSelect
                        label="Select Input"
                        id="selectInput"
                        options={[
                            { title: 'Red', value: 'red' },
                            { title: 'Green', value: 'green' },
                            { title: 'Blue', value: 'blue' },
                        ]}
                        value={select}
                        onChange={setSelect}
                        placeholder="Select your color"
                        clear
                        required
                    />
                    <AcmLabelsInput
                        id="labelsInput"
                        label="Labels Input"
                        value={labels}
                        onChange={setLabels}
                    ></AcmLabelsInput>
                </AcmForm>
            </AcmPageCard>
        </AcmPage>
    )
}

import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmExpandableSection } from '../AcmExpandableSection/AcmExpandableSection'
import { AcmForm } from '../AcmForm/AcmForm'
import { AcmHeader, NavItemE } from '../AcmHeader/AcmHeader'
import { AcmLabelsInput } from '../AcmLabelsInput/AcmLabelsInput'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'
import { AcmSelect } from '../AcmSelect/AcmSelect'
import { AcmTextInput } from '../AcmTextInput/AcmTextInput'

export default {
    title: 'Header',
    component: AcmHeader,
}

export const Page = () => {
    const [value, setValue] = useState<string>()
    const [select, setSelect] = useState<string>()
    const [labels, setLabels] = useState<string[]>([])

    return (
        <AcmHeader activeItem={NavItemE.clusterManagement}>
            <AcmPage>
                <AcmPageHeader title="Page Header" />
                <AcmPageCard>Page Card</AcmPageCard>
                <AcmPageCard>
                    <AcmExpandableSection label="Expandable Section" expanded={true}>
                        <AcmForm>
                            <AcmTextInput
                                label="Text Input"
                                id="textInput"
                                value={value}
                                onChange={setValue}
                                required
                            />
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
                            <AcmLabelsInput id="labelsInput" label="Labels Input" value={labels} onChange={setLabels} />
                        </AcmForm>
                    </AcmExpandableSection>
                </AcmPageCard>
            </AcmPage>
        </AcmHeader>
    )
}

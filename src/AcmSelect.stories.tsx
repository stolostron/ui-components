import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmForm } from './AcmForm'
import { AcmPage, AcmPageCard, AcmPageHeader } from './AcmPage'
import { AcmSelect } from './AcmSelect'

export default {
    title: 'AcmSelect',
    component: AcmSelect,
}

export const Select = () => {
    const [value, setValue] = useState<string>()

    return (
        <AcmPage>
            <AcmPageHeader title="AcmSelect"></AcmPageHeader>
            <AcmPageCard>
                <AcmForm>
                    <AcmSelect
                        label="Color (lowercase)"
                        id="123"
                        options={['red', 'green', 'blue']}
                        value={value}
                        onChange={setValue}
                        placeholder="Select your color"
                        clear
                    />

                    <AcmSelect
                        label="Color (uppercase using options)"
                        id="456"
                        options={[
                            { title: 'Red', value: 'red' },
                            { title: 'Green', value: 'green' },
                            { title: 'Blue', value: 'blue' },
                        ]}
                        value={value}
                        onChange={setValue}
                        placeholder="Select your color"
                        clear
                    />
                </AcmForm>
            </AcmPageCard>
        </AcmPage>
    )
}

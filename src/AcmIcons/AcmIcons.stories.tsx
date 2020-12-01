import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { PageSection } from '@patternfly/react-core'
import { AcmIcon, AcmIconVariant } from './AcmIcons'
import { AcmDescriptionList } from '../AcmDescriptionList/AcmDescriptionList'

const meta: Meta = {
    title: 'Icons',
    component: AcmIcon,
}
export default meta

export const Icons = () => {
    const icons = Object.values(AcmIconVariant)
        .sort()
        .map((icon) => {
            return {
                key: icon,
                value: (
                    <div style={{ width: '40px', height: '40px' }}>
                        <AcmIcon key={icon} icon={icon} />
                    </div>
                ),
            }
        })
    const midpoint = Math.ceil(icons.length / 2)
    const leftItems = icons.slice(0, midpoint)
    const rightItems = icons.slice(midpoint)
    return (
        <PageSection>
            <AcmDescriptionList title="Icons" leftItems={leftItems} rightItems={rightItems} />
        </PageSection>
    )
}

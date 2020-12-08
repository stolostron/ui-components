import React from 'react'
import { Card, CardBody } from '@patternfly/react-core'
import { ExternalLinkAltIcon } from '@patternfly/react-icons'
import { AcmActionGroup } from './AcmActionGroup'
import { AcmDropdown } from '../AcmDropdown/AcmDropdown'
import { AcmLaunchLink } from '../AcmLaunchLink/AcmLaunchLink'

export default {
    title: 'ActionGroup',
    component: AcmActionGroup,
}

export function ActionGroup() {
    return (
        <Card>
            <CardBody>
                <AcmActionGroup>
                    {false && <ConfigDropdown />}
                    <AcmLaunchLink links={[{ id: 'link', text: 'Grafana', href: '/grafana' }]} />
                    <ConfigDropdown />
                    <ActionDropdown />
                    <TestNull />
                </AcmActionGroup>
            </CardBody>
        </Card>
    )
}

const ConfigDropdown = () => {
    const dropdownItems = [
        { id: 'install-config', text: 'Install config' },
        { id: 'kubeconfig', text: 'Kubeconfig' },
        { id: 'other-config', text: 'Other config', isDisabled: true, tooltip: 'Forbidden' },
        { id: 'launch-out', text: 'Launch page', icon: <ExternalLinkAltIcon /> },
        { id: 'link item', text: 'Link item', href: 'www.google.com', component: 'a' },
    ]
    const onSelect = (id: string) => console.log('clicked:', id)
    const onHover = () => console.log('hovered')
    return (
        <AcmDropdown
            onHover={onHover}
            isDisabled={false}
            tooltip="Tooltip message"
            id="dropdown"
            onSelect={onSelect}
            text="Download configuration"
            dropdownItems={dropdownItems}
            isKebab={false}
        />
    )
}

const ActionDropdown = () => {
    const dropdownItems = [
        { id: 'edit-labels', text: 'Edit labels' },
        { id: 'search', text: 'Search cluster' },
        { id: 'launch-dashboard', text: 'Launch to console', icon: <ExternalLinkAltIcon /> },
        { id: 'destroy', text: 'Destroy cluster' },
    ]
    const onSelect = (id: string) => console.log('clicked:', id)
    return (
        <AcmDropdown
            isDisabled={false}
            tooltip="Tooltip message"
            id="dropdown"
            onSelect={onSelect}
            text="Actions"
            dropdownItems={dropdownItems}
            isKebab={false}
        />
    )
}

const TestNull = () => {
    return null
}

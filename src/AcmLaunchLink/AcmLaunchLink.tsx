/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { ButtonVariant } from '@patternfly/react-core'
import { ExternalLinkAltIcon } from '@patternfly/react-icons'
import { AcmButton } from '../AcmButton/AcmButton'
import { AcmDropdown } from '../AcmDropdown/AcmDropdown'

export type LaunchLink = {
    id: string
    text: string | React.ReactNode
    href: string
}

export function AcmLaunchLink(props: { links?: LaunchLink[] }) {
    /* istanbul ignore next */
    const onSelect = () => null

    if (props.links !== undefined && props.links.length > 0) {
        if (props.links.length === 1) {
            const [link] = props.links
            return (
                <AcmButton
                    href={link.href}
                    variant={ButtonVariant.link}
                    component="a"
                    target="_blank"
                    rel="noreferrer"
                    id={link.id}
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                >
                    {link.text}
                </AcmButton>
            )
        } else {
            return (
                <AcmDropdown
                    onSelect={onSelect}
                    text="Launch dashboard"
                    id="addon-launch-links"
                    dropdownItems={props.links.map((link) => ({
                        id: link.id,
                        text: link.text,
                        href: link.href,
                        component: 'a',
                        target: '_blank',
                        rel: 'noreferrer',
                        icon: <ExternalLinkAltIcon />,
                    }))}
                />
            )
        }
    } else {
        return null
    }
}

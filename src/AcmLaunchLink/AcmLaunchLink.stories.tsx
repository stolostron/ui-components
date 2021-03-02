/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { AcmLaunchLink, LaunchLink } from './AcmLaunchLink'

export default {
    title: 'LaunchLink',
    component: AcmLaunchLink,
    argtypes: {
        count: {
            control: {
                type: 'range',
                options: {
                    min: 0,
                    max: 3,
                },
            },
        },
    },
}

export const DynamicLaunchLink = (args) => {
    const links: LaunchLink[] = [
        { id: 'grafana', text: 'Grafana', href: '/grafana' },
        { id: 'logs', text: 'Kibana', href: '/kibana' },
        { id: 'cloud-pak', text: 'IBM CP4MCM', href: 'https://www.ibm.com' },
    ]

    const displayLinks = links.slice(0, args.count)

    return <AcmLaunchLink links={displayLinks} />
}
DynamicLaunchLink.args = { count: 3 }

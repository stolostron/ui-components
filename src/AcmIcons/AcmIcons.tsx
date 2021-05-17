/* Copyright Contributors to the Open Cluster Management project */

import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon'
import AnsibleTowerIcon from '@patternfly/react-icons/dist/js/icons/ansibeTower-icon'
import EyeIcon from '@patternfly/react-icons/dist/js/icons/eye-icon'
import EyeSlashIcon from '@patternfly/react-icons/dist/js/icons/eye-slash-icon'
import ServerIcon from '@patternfly/react-icons/dist/js/icons/server-icon'
import React, { Fragment } from 'react'
import OpenNewTabIcon from './OpenNewTabIcon'
import AcmTemplateIcon from './TemplateIcon'
import AWSIcon from './AWSIcon'
import AzureIcon from './AzureIcon'
import BrokenLinkIcon from './BrokenLinkIcon'
import CloudIcon from './CloudIcon'
import GCPIcon from './GCPIcon'
import IBMCloudIcon from './IBMCloudIcon'
import OCPIcon from './OCPIcon'
import RedHatIcon from './RedHatIcon'
import VMWareIcon from './VMWareIcon'

export enum AcmIconVariant {
    template = 'template',
    visibilityon = 'visibilityon',
    visibilityoff = 'visibilityoff',
    brokenlink = 'brokenlink',
    redhat = 'redhat',
    aws = 'aws',
    gcp = 'gcp',
    azure = 'azure',
    ocp = 'ocp',
    ibm = 'ibm',
    baremetal = 'baremetal',
    vmware = 'vmware',
    cloud = 'cloud',
    openNewTab = 'opennewtab',
    ansible = 'ansible',
}

// https://www.patternfly.org/v4/guidelines/icons

export function AcmIcon(props: { icon: AcmIconVariant } & SVGIconProps) {
    switch (props.icon) {
        case AcmIconVariant.template:
            return <AcmTemplateIcon {...props} />
        case AcmIconVariant.visibilityoff:
            return <EyeSlashIcon {...props} />
        case AcmIconVariant.visibilityon:
            return <EyeIcon {...props} />
        case AcmIconVariant.brokenlink:
            return <BrokenLinkIcon {...props} />
        case AcmIconVariant.redhat:
            return <RedHatIcon {...props} />
        case AcmIconVariant.aws:
            return <AWSIcon {...props} />
        case AcmIconVariant.gcp:
            return <GCPIcon {...props} />
        case AcmIconVariant.azure:
            return <AzureIcon {...props} />
        case AcmIconVariant.ocp:
            return <OCPIcon {...props} />
        case AcmIconVariant.ibm:
            return <IBMCloudIcon {...props} />
        case AcmIconVariant.baremetal:
            return <ServerIcon {...props} color="slategray" />
        case AcmIconVariant.vmware:
            return <VMWareIcon {...props} />
        case AcmIconVariant.cloud:
            return <CloudIcon {...props} />
        case AcmIconVariant.openNewTab:
            return <OpenNewTabIcon {...props} />
        case AcmIconVariant.ansible:
            return <AnsibleTowerIcon {...props} color="#EE0000" />
        /* istanbul ignore next */
        default:
            return <Fragment />
    }
}

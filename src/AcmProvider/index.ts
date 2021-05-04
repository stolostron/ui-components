/* Copyright Contributors to the Open Cluster Management project */

import { AcmIconVariant } from '../AcmIcons/AcmIcons'

export * from './AcmProviderCard/AcmProviderCard'
export * from './AcmInlineProvider/AcmInlineProvider'

// These connect change as they are used in existing resources ass identifiers
export enum Provider {
    redhatcloud = 'rhocm',
    ansible = 'ans',
    openstack = 'ost',
    aws = 'aws',
    gcp = 'gcp',
    azure = 'azr',
    vmware = 'vmw',
    ibm = 'ibm',
    baremetal = 'bmc',
    other = 'other',
}

export const ProviderShortTextMap = {
    [Provider.redhatcloud]: 'OCM',
    [Provider.ansible]: 'ANS',
    [Provider.openstack]: 'OpenStack',
    [Provider.aws]: 'Amazon',
    [Provider.gcp]: 'Google',
    [Provider.azure]: 'Microsoft',
    [Provider.ibm]: 'IBM',
    [Provider.baremetal]: 'Bare metal',
    [Provider.vmware]: 'VMware',
    [Provider.other]: 'Other',
}

export const ProviderLongTextMap = {
    [Provider.redhatcloud]: 'Red Hat OpenShift Cluster Manager',
    [Provider.ansible]: 'Red Hat Ansible Automation Platform',
    [Provider.openstack]: 'Red Hat OpenStack Platform',
    [Provider.aws]: 'Amazon Web Services',
    [Provider.gcp]: 'Google Cloud Platform',
    [Provider.azure]: 'Microsoft Azure',
    [Provider.ibm]: 'IBM Cloud',
    [Provider.baremetal]: 'Bare Metal',
    [Provider.vmware]: 'VMware vSphere',
    [Provider.other]: 'Other',
}

export const ProviderIconMap = {
    [Provider.redhatcloud]: AcmIconVariant.redhat,
    [Provider.ansible]: AcmIconVariant.redhat,
    [Provider.openstack]: AcmIconVariant.redhat,
    [Provider.aws]: AcmIconVariant.aws,
    [Provider.gcp]: AcmIconVariant.gcp,
    [Provider.azure]: AcmIconVariant.azure,
    [Provider.ibm]: AcmIconVariant.ibm,
    [Provider.baremetal]: AcmIconVariant.baremetal,
    [Provider.vmware]: AcmIconVariant.vmware,
    [Provider.other]: AcmIconVariant.cloud,
}

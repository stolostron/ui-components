/* Copyright Contributors to the Open Cluster Management project */

import { AcmIconVariant } from '../AcmIcons/AcmIcons'

export * from './AcmProviderCard/AcmProviderCard'
export * from './AcmInlineProvider/AcmInlineProvider'

export enum Provider {
    redhatcloud = 'redhatcloud',
    openstack = 'openstack',
    aws = 'aws',
    gcp = 'gcp',
    azure = 'azure',
    vmware = 'vmware',
    ibm = 'ibm',
    baremetal = 'baremetal',
    other = 'other',
}

export const ProviderShortTextMap = {
    [Provider.redhatcloud]: 'OCM',
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
    [Provider.openstack]: 'Red Hat OpenStack',
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
    [Provider.openstack]: AcmIconVariant.redhat,
    [Provider.aws]: AcmIconVariant.aws,
    [Provider.gcp]: AcmIconVariant.gcp,
    [Provider.azure]: AcmIconVariant.azure,
    [Provider.ibm]: AcmIconVariant.ibm,
    [Provider.baremetal]: AcmIconVariant.baremetal,
    [Provider.vmware]: AcmIconVariant.vmware,
    [Provider.other]: AcmIconVariant.cloud,
}

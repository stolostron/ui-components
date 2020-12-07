import { AcmIconVariant } from '../AcmIcons/AcmIcons'

export * from './AcmProviderCard/AcmProviderCard'

export enum Provider {
    aws = 'aws',
    gcp = 'gcp',
    azure = 'azure',
    vmware = 'vmware',
    ibm = 'ibm',
    baremetal = 'baremetal',
    other = 'other',
}

export const ProviderShortTextMap = {
    [Provider.aws]: 'Amazon',
    [Provider.gcp]: 'Google',
    [Provider.azure]: 'Microsoft',
    [Provider.ibm]: 'IBM',
    [Provider.baremetal]: 'Bare metal',
    [Provider.vmware]: 'VMware',
    [Provider.other]: 'Other',
}

export const ProviderLongTextMap = {
    [Provider.aws]: 'Amazon Web Services',
    [Provider.gcp]: 'Google Cloud Platform',
    [Provider.azure]: 'Microsoft Azure',
    [Provider.ibm]: 'IBM Cloud',
    [Provider.baremetal]: 'Bare metal',
    [Provider.vmware]: 'VMware vSphere',
    [Provider.other]: 'Other',
}

export const ProviderIconMap = {
    [Provider.aws]: AcmIconVariant.aws,
    [Provider.gcp]: AcmIconVariant.gcp,
    [Provider.azure]: AcmIconVariant.azure,
    [Provider.ibm]: AcmIconVariant.ibm,
    [Provider.baremetal]: AcmIconVariant.baremetal,
    [Provider.vmware]: AcmIconVariant.vmware,
    [Provider.other]: AcmIconVariant.cloud,
}

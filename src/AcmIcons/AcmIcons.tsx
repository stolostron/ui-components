import React from 'react'
import { AcmTemplateIcon, AWSIcon, GCPIcon, AzureIcon, CloudIcon, BareMetalIcon, VMWareIcon } from './Icons'
import ibmCloud from '../assets/IBM-Cloud.png'

export enum AcmIconVariant {
    template = (<AcmTemplateIcon />),
    aws = (<AWSIcon />),
    gcp = (<GCPIcon />),
    azure = (<AzureIcon />),
    ibm = (<img src={ibmCloud} role="presentation" />),
    baremetal  = (<BareMetalIcon />),
    vmware = (<VMWareIcon />),
    cloud = (<CloudIcon />)
}

export function AcmIcon(props: { icon: AcmIconVariant }) {
    return props.icon
}

import { makeStyles } from '@material-ui/core'
import React from 'react'
import {
    AcmTemplateIcon,
    AcmVisibilityOnIcon,
    AcmVisibilityOffIcon,
    RedHatIcon,
    AWSIcon,
    GCPIcon,
    AzureIcon,
    CloudIcon,
    BareMetalIcon,
    VMWareIcon,
    IBMCloudIcon,
} from './Icons'

export enum AcmIconVariant {
    template = 'template',
    visibilityon = 'visibilityon',
    visibilityoff = 'visibilityoff',
    redhat = 'redhat',
    aws = 'aws',
    gcp = 'gcp',
    azure = 'azure',
    ibm = 'ibm',
    baremetal = 'baremetal',
    vmware = 'vmware',
    cloud = 'cloud',
}

// https://www.patternfly.org/v4/guidelines/icons

const useStyles = makeStyles({
    small: {
        display: 'flex',
        alignItems: 'center',
        '& svg, & img': {
            width: '10px',
            height: '10px',
        },
    },
    medium: {
        display: 'flex',
        alignItems: 'center',
        '& svg, & img': {
            width: '18px',
            height: '18px',
        },
    },
    large: {
        display: 'flex',
        alignItems: 'center',
        '& svg, & img': {
            width: '24px',
            height: '24px',
        },
    },
    xlarge: {
        display: 'flex',
        alignItems: 'center',
        '& svg, & img': {
            width: '54px',
            height: '54px',
        },
    },
})

function AcmIconSvg(props: { icon: AcmIconVariant }) {
    switch (props.icon) {
        case AcmIconVariant.template:
            return <AcmTemplateIcon />
        case AcmIconVariant.visibilityoff:
            return <AcmVisibilityOffIcon />
        case AcmIconVariant.visibilityon:
            return <AcmVisibilityOnIcon />
        case AcmIconVariant.redhat:
            return <RedHatIcon />
        case AcmIconVariant.aws:
            return <AWSIcon />
        case AcmIconVariant.gcp:
            return <GCPIcon />
        case AcmIconVariant.azure:
            return <AzureIcon />
        case AcmIconVariant.ibm:
            return <IBMCloudIcon />
        case AcmIconVariant.baremetal:
            return <BareMetalIcon />
        case AcmIconVariant.vmware:
            return <VMWareIcon />
        case AcmIconVariant.cloud:
            return <CloudIcon />
    }
}

export function AcmIcon(props: { icon: AcmIconVariant; size?: 'small' | 'medium' | 'large' | 'xlarge' }) {
    const classes = useStyles()
    return (
        <div className={classes[props.size ?? 'large']}>
            <AcmIconSvg icon={props.icon} />
        </div>
    )
}

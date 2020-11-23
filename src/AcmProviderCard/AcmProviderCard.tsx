import React from 'react'
import {
    Card,
    CardHeaderMain,
    CardHeader,
    CardFooter,
    Title,
    Text,
    TextVariants,
    Stack,
    StackItem,
    Gallery,
    GalleryItem,
} from '@patternfly/react-core'
import { ExclamationCircleIcon } from '@patternfly/react-icons'
import { makeStyles } from '@material-ui/styles'
import { AcmIcon, AcmIconVariant } from '../AcmIcons/AcmIcons'

const useStyles = makeStyles({
    card: {
        height: '240px',
        maxWidth: '278px',
    },
    providerTitle: {
        fontSize: 'var(--pf-c-title--m-3xl--FontSize)',
        lineHeight: 'var(--pf-c-title--m-3xl--LineHeight)',
    },
    iconContainer: {
        '& svg, & img': { width: '40px' },
    },
    dangerIcon: {
        width: '16px',
        height: '16px',
        marginLeft: '8px',
        verticalAlign: 'unset !important',
    },
    clusterCount: {
        fontSize: '28px',
    },
    clusterText: {
        fontSize: '14px',
        fontWeight: 600,
    },
})

export enum Provider {
    aws = 'aws',
    gcp = 'gcp',
    azure = 'azure',
    vmware = 'vmware',
    ibm = 'ibm',
    baremetal = 'baremetal',
    other = 'other',
}

const providerTextMap = {
    [Provider.aws]: 'Amazon',
    [Provider.gcp]: 'Google',
    [Provider.azure]: 'Microsoft',
    [Provider.ibm]: 'IBM',
    [Provider.baremetal]: 'Bare metal',
    [Provider.vmware]: 'VMware',
    [Provider.other]: 'Other',
}

const iconMap = {
    [Provider.aws]: AcmIconVariant.aws,
    [Provider.gcp]: AcmIconVariant.gcp,
    [Provider.azure]: AcmIconVariant.azure,
    [Provider.ibm]: AcmIconVariant.ibm,
    [Provider.baremetal]: AcmIconVariant.baremetal,
    [Provider.vmware]: AcmIconVariant.vmware,
    [Provider.other]: AcmIconVariant.cloud,
}

type ProviderCardProps = {
    provider: Provider
    clusterCount: number | undefined
    onClick: (provider: string) => void
    danger?: boolean
    isSelected?: boolean
}

export function AcmOverviewProviders(props: { providers: ProviderCardProps[] }) {
    return (
        <Gallery hasGutter>
            {props.providers.map((provider) => (
                <GalleryItem key={provider.provider}>
                    <AcmProviderCard {...provider} />
                </GalleryItem>
            ))}
        </Gallery>
    )
}

export function AcmProviderCard(props: ProviderCardProps) {
    const classes = useStyles()
    return (
        <Card
            onClick={() => props.onClick(props.provider)}
            onKeyDown={(event: React.KeyboardEvent) => [13, 32].includes(event.keyCode) && props.onClick(props.provider)}
            isSelectable
            isSelected={props.isSelected}
            className={classes.card}
            id={`${props.provider}-provider-card`}
        >
            <Stack>
                <StackItem>
                    <CardHeader>
                        <CardHeaderMain>
                            <div className={classes.iconContainer}>
                                <AcmIcon icon={iconMap[props.provider]} />
                            </div>
                            <Title
                                headingLevel="h2"
                                size="3xl"
                                className={classes.providerTitle}
                                style={{ fontWeight: 300 }}
                            >
                                {providerTextMap[props.provider]}
                                {props.danger && (
                                    <ExclamationCircleIcon
                                        color="var(--pf-global--palette--red-100)"
                                        className={`${classes.dangerIcon} danger-icon`}
                                    />
                                )}
                            </Title>
                        </CardHeaderMain>
                    </CardHeader>
                </StackItem>
                <StackItem isFilled></StackItem>
                <StackItem>
                    <CardFooter>
                        <Text component={TextVariants.p} className={classes.clusterCount}>
                            {props.clusterCount}
                        </Text>
                        <Text component={TextVariants.p} className={classes.clusterText}>
                            Cluster
                        </Text>
                    </CardFooter>
                </StackItem>
            </Stack>
        </Card>
    )
}

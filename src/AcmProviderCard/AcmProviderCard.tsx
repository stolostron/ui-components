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
    aws = 'Amazon',
    gcp = 'Google',
    azure = 'Microsoft',
    vmware = 'VMware',
    ibm = 'IBM',
    baremetal = 'Bare metal',
    other = 'Other',
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
    const id = props.provider.toLowerCase().replace(/\s+/g, '-')
    return (
        <Card
            onClick={() => props.onClick(id)}
            onKeyDown={(event: React.KeyboardEvent) => [13, 32].includes(event.keyCode) && props.onClick(id)}
            isSelectable
            className={classes.card}
            id={`${id}-provider-card`}
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
                                {props.provider}
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

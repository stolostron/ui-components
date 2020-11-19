import React from 'react'
import { Card, CardHeaderMain, CardHeader, CardBody, CardFooter, Title, TitleSizes } from '@patternfly/react-core'

export enum Provider {
    aws = 'Amazon',
    gcp = 'Google',
    azure = 'Microsoft',
    vmware = 'VMware',
    baremetal = 'Bare metal',
}

type ProviderCardProps = {
    provider: Provider
    clusterCount: number | undefined
}

export function AcmProviderCard(props: ProviderCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardHeaderMain>ICON</CardHeaderMain>
                <Title headingLevel="h4" size={TitleSizes['4xl']}>
                    {props.provider}
                </Title>
            </CardHeader>
            <CardFooter>
                <div>{props.clusterCount}</div>
                <div>Cluster</div>
            </CardFooter>
        </Card>
    )
}

import React from 'react'
import {
    DescriptionList,
    DescriptionListGroup,
    DescriptionListTerm,
    DescriptionListDescription,
    Grid,
    GridItem,
} from '@patternfly/react-core'
import { AcmExpandableCard } from '../AcmExpandable'

export type ListItems = {
    key: string
    keyAction?: React.ReactNode
    value?: string | number | React.ReactNode | undefined
}

export function AcmDescriptionList(props: {
    title: string
    leftItems: ListItems[]
    rightItems?: ListItems[] | undefined
}) {
    return (
        <AcmExpandableCard title={props.title}>
            <Grid sm={12} md={6}>
                <GridItem>
                    <List items={props.leftItems} />
                </GridItem>
                {props.rightItems && (
                    <GridItem>
                        <List items={props.rightItems} />
                    </GridItem>
                )}
            </Grid>
        </AcmExpandableCard>
    )
}

const List = (props: { items: ListItems[] }) => {
    return (
        <DescriptionList isHorizontal>
            {props.items.map(({ key, keyAction, value }) => (
                <DescriptionListGroup key={key}>
                    <DescriptionListTerm>
                        {key} {keyAction}
                    </DescriptionListTerm>
                    <DescriptionListDescription>{value ?? '-'}</DescriptionListDescription>
                </DescriptionListGroup>
            ))}
        </DescriptionList>
    )
}

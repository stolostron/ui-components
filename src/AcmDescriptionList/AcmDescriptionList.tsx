import React, { useState } from 'react'
import {
    DescriptionList,
    DescriptionListGroup,
    DescriptionListTerm,
    DescriptionListDescription,
    Card,
    CardTitle,
    CardHeader,
    CardBody,
    Split,
    SplitItem,
    Button,
    ButtonVariant,
    Grid,
    GridItem,
} from '@patternfly/react-core'
import { AngleDownIcon, AngleRightIcon } from '@patternfly/react-icons'

export type ListItems = {
    key: string
    keyAction?: React.ReactNode
    value?: string | number | React.ReactNode | undefined
}

const ToggleIcon = (props: { open: boolean; toggle: () => void }) => {
    return (
        <Button variant={ButtonVariant.plain} onClick={props.toggle} aria-label="toggle list open">
            {props.open ? <AngleDownIcon /> : <AngleRightIcon />}
        </Button>
    )
}

export function AcmDescriptionList(props: {
    title: string
    leftItems: ListItems[]
    rightItems?: ListItems[] | undefined
}) {
    const [open, setOpen] = useState<boolean>(true)
    const toggle = () => setOpen(!open)
    return (
        <Card>
            <Split>
                <SplitItem>
                    <CardTitle>{props.title}</CardTitle>
                </SplitItem>
                <SplitItem isFilled></SplitItem>
                <SplitItem style={{ alignSelf: 'center' }}>
                    <ToggleIcon open={open} toggle={toggle} />
                </SplitItem>
            </Split>
            {open && (
                <CardBody style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <CardHeader /> {/* creates space */}
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
                </CardBody>
            )}
        </Card>
    )
}

const List = (props: { items: ListItems[] }) => {
    return (
        <DescriptionList isHorizontal>
            {props.items.map(({ key, keyAction, value }) => (
                <DescriptionListGroup key={key}>
                    <DescriptionListTerm>
                        {key} {keyAction && <span>{keyAction}</span>}
                    </DescriptionListTerm>
                    <DescriptionListDescription>{value ?? '-'}</DescriptionListDescription>
                </DescriptionListGroup>
            ))}
        </DescriptionList>
    )
}

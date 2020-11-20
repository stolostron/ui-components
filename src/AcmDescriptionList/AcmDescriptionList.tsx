import React, { useState } from 'react'
import {
    DescriptionList,
    DescriptionListGroup,
    DescriptionListTerm,
    DescriptionListDescription,
    Card,
    CardTitle,
    CardBody,
    Split,
    SplitItem,
    Button,
    ButtonVariant,
    Grid,
    GridItem,
} from '@patternfly/react-core'
import { AngleDownIcon, AngleRightIcon } from '@patternfly/react-icons'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    toggleContainer: { alignSelf: 'center' },
    cardBody: { borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '40px' },
})

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
    const classes = useStyles()
    return (
        <Card>
            <Split>
                <SplitItem>
                    <CardTitle>{props.title}</CardTitle>
                </SplitItem>
                <SplitItem isFilled></SplitItem>
                <SplitItem className={classes.toggleContainer}>
                    <ToggleIcon open={open} toggle={() => setOpen(!open)} />
                </SplitItem>
            </Split>
            {open && (
                <CardBody className={classes.cardBody}>
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
                        {key} {keyAction}
                    </DescriptionListTerm>
                    <DescriptionListDescription>{value ?? '-'}</DescriptionListDescription>
                </DescriptionListGroup>
            ))}
        </DescriptionList>
    )
}

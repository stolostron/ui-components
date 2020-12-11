import React, { useState } from 'react'
import {
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
import { AcmCountCard, AcmCountCardProps } from './AcmCountCard'
import { makeStyles } from '@material-ui/styles'

const useGroupStyles = makeStyles({
    toggleContainer: { alignSelf: 'center', paddingRight: '12px' },
    cardBody: { borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '40px' },
})

export type AcmCountCardGroupProps = {
    title: string
    cards: AcmCountCardProps[]
}

export const AcmCountCardGroup = (props: AcmCountCardGroupProps) => {
    const [open, setOpen] = useState<boolean>(true)
    const classes = useGroupStyles()

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
                <CardBody>
                    <Grid lg={4}>
                        {props.cards.map((card, i) => {
                            return (
                                <GridItem key={i}>
                                    <AcmCountCard {...card} />
                                </GridItem>
                            )
                        })}
                    </Grid>
                </CardBody>
            )}
        </Card>
    )
}

const ToggleIcon = (props: { open: boolean; toggle: () => void }) => {
    return (
        <Button variant={ButtonVariant.plain} onClick={props.toggle} aria-label="toggle list open">
            {props.open ? <AngleDownIcon /> : <AngleRightIcon />}
        </Button>
    )
}

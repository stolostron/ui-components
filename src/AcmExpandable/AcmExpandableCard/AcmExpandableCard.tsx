/* Copyright Contributors to the Open Cluster Management project */

import React, { useState } from 'react'
import { Card, CardTitle, CardBody, Split, SplitItem, Button, ButtonVariant } from '@patternfly/react-core'
import { AngleDownIcon, AngleRightIcon } from '@patternfly/react-icons'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    toggleContainer: { alignSelf: 'center', paddingRight: '12px' },
    cardBody: { borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '32px', paddingBottom: '32px' },
})

const ToggleIcon = (props: { open: boolean; toggle: () => void }) => {
    return (
        <Button variant={ButtonVariant.plain} onClick={props.toggle} aria-label="toggle list open">
            {props.open ? <AngleDownIcon /> : <AngleRightIcon />}
        </Button>
    )
}

export function AcmExpandableCard(props: {
    title: string
    children: React.ReactNode
    className?: string
    id?: string
}) {
    const [open, setOpen] = useState<boolean>(true)
    const classes = useStyles()
    return (
        <Card className={props.className} id={props.id}>
            <Split>
                <SplitItem>
                    <CardTitle>{props.title}</CardTitle>
                </SplitItem>
                <SplitItem isFilled></SplitItem>
                <SplitItem className={classes.toggleContainer}>
                    <ToggleIcon open={open} toggle={() => setOpen(!open)} />
                </SplitItem>
            </Split>
            {open && <CardBody className={classes.cardBody}>{props.children}</CardBody>}
        </Card>
    )
}

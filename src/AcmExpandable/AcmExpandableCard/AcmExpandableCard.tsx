/* Copyright Contributors to the Open Cluster Management project */

import React, { useState } from 'react'
import { Card, CardBody, CardExpandableContent, CardHeader, CardTitle } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    header: { 'border-bottom': '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' },
    headerExpanded: {
        '& button': {
            transform: 'rotate(90deg)',
        },
    },
    body: {
        padding: '32px 24px',
        '& > .pf-c-card__body': {
            padding: '0px',
        },
    },
})

export function AcmExpandableCard(props: {
    title: string
    children: React.ReactNode
    className?: string
    id?: string
}) {
    const [open, setOpen] = useState<boolean>(true)
    const classes = useStyles()
    return (
        <Card id={props.id} className={props.className} isExpanded={open}>
            <CardHeader
                className={`${classes.header} ${open ? classes.headerExpanded : ''}`}
                onExpand={() => setOpen(!open)}
                onClick={() => setOpen(!open)}
                toggleButtonProps={{
                    id: 'toggle-button',
                    'aria-label': 'Toggle details',
                    'aria-expanded': open,
                }}
            >
                <CardTitle>{props.title}</CardTitle>
            </CardHeader>
            <CardExpandableContent className={classes.body}>
                <CardBody>{props.children}</CardBody>
            </CardExpandableContent>
        </Card>
    )
}

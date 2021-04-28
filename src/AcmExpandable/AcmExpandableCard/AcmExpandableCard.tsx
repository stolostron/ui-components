/* Copyright Contributors to the Open Cluster Management project */

import React, { useState } from 'react'
import { Card, CardBody, CardExpandableContent, CardHeader, CardTitle } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    header: { 'border-bottom': '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' },
    body: {
        padding: '32px 24px',
        '& > .pf-c-card__body': {
            padding: '0px',
        },
    },
})

const onToggle = (acmCardID: string, open: boolean, setOpen: (open: boolean) => void) => {
    setOpen(!open)
    if (localStorage.getItem(acmCardID) === 'show') {
        localStorage.setItem(acmCardID, 'hide')
    } else {
        localStorage.setItem(acmCardID, 'show')
    }
}

export function AcmExpandableCard(props: {
    title: string
    children: React.ReactNode
    className?: string
    id?: string
}) {
    const acmCardID = window.location.href + props.id
    localStorage.getItem(acmCardID) ?? localStorage.setItem(acmCardID, 'show')

    const [open, setOpen] = useState<boolean>(localStorage.getItem(acmCardID) === 'show')
    const classes = useStyles()
    return (
        <Card id={props.id} className={props.className} isExpanded={open}>
            <CardHeader
                className={classes.header}
                onExpand={() => onToggle(acmCardID, open, setOpen)}
                onClick={() => onToggle(acmCardID, open, setOpen)}
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

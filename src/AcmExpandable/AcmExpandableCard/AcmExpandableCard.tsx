/* Copyright Contributors to the Open Cluster Management project */

import React, { useState } from 'react'
import { Accordion, AccordionItem, AccordionContent, AccordionToggle } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    accordion: {
        '--pf-c-accordion__toggle--m-expanded--before--BackgroundColor': 'none',
        '--pf-c-accordion__toggle--hover__toggle-text--Color': 'none',
        '--pf-c-accordion__toggle--active__toggle-text--Color': 'none',
        '--pf-c-accordion__toggle--focus__toggle-text--Color': 'none',
        '--pf-c-accordion__toggle--m-expanded__toggle-text--Color': 'none',
        '--pf-c-accordion__expanded-content--m-expanded__expanded-content-body--before--BackgroundColor': 'none',
        '--pf-c-accordion__toggle--hover--BackgroundColor': 'white',
        '--pf-c-accordion__toggle--focus--BackgroundColor': 'white',
        '--pf-c-accordion__toggle--active--BackgroundColor': 'white',
        'box-shadow': '0 0.0625rem 0.125rem 0 rgba(3, 3, 3, 0.12), 0 0 0.125rem 0 rgba(3, 3, 3, 0.06)',
    },
    accordionHeader: { height: '64px', padding: '24px', 'border-bottom': '1px solid rgba(0,0,0,0.1)' },
    accordionBody: {
        padding: '32px 24px',
        '& div': {
            padding: '0px',
            color: 'black',
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
        <Accordion className={`${classes.accordion} ${props.className}`} id={props.id}>
            <AccordionItem>
                <AccordionToggle
                    className={classes.accordionHeader}
                    id="details-card-header"
                    isExpanded={open}
                    onClick={() => setOpen(!open)}
                >
                    {props.title}
                </AccordionToggle>
                <AccordionContent isHidden={!open} className={classes.accordionBody}>
                    {props.children}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

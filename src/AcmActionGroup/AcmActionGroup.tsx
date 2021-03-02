/* Copyright Contributors to the Open Cluster Management project */

import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import { Flex, FlexItem, Divider } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    group: {
        '& > div > a, & .pf-c-dropdown__toggle.pf-m-plain': {
            paddingLeft: 0,
            paddingRight: 0,
        },
    },
})

export function AcmActionGroup(props: { children: React.ReactNode[] }) {
    const classes = useStyles()
    const nodes: React.ReactNode[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.Children.forEach(props.children, (child: any) => {
        /* istanbul ignore next */
        if (ReactDOMServer.renderToString(child?.type(child?.props)).length > 0) {
            nodes.push(child)
        }
    })
    return (
        <Flex className={classes.group}>
            {nodes.map((node, i) => {
                if (i + 2 > nodes.length) {
                    return <FlexItem key={i}>{node}</FlexItem>
                } else {
                    return (
                        <Fragment key={i}>
                            <FlexItem>{node}</FlexItem>
                            <Divider isVertical />
                        </Fragment>
                    )
                }
            })}
        </Flex>
    )
}

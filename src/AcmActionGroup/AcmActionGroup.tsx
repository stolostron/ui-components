import React, { Fragment } from 'react'
import { Flex, FlexItem, Divider } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    group: {
        '& button, & a': {
            padding: 0,
        },
    },
})

export function AcmActionGroup(props: { children: React.ReactNode[] }) {
    const classes = useStyles()
    const nodes = props.children.filter((child) => child !== null) ?? []
    const length = nodes.length
    return (
        <Flex className={classes.group}>
            {nodes.map((node, i) => {
                if (i + 2 > length) {
                    return <FlexItem>{node}</FlexItem>
                } else {
                    return (
                        <Fragment>
                            <FlexItem>{node}</FlexItem>
                            <Divider isVertical />
                        </Fragment>
                    )
                }
            })}
        </Flex>
    )
}

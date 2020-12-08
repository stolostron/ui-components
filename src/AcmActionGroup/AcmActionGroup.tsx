import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import { Flex, FlexItem, Divider } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    group: {
        '& > div > button, & > div > a, & .pf-c-dropdown__toggle': {
            padding: 0,
        },
    },
})

export function AcmActionGroup(props: { children: React.ReactNode[] }) {
    const classes = useStyles()
    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = props.children.filter((child: any) => ReactDOMServer.renderToString(child).length > 0) ?? []
    const length = nodes.length
    return (
        <Flex className={classes.group}>
            {nodes.map((node, i) => {
                if (i + 2 > length) {
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

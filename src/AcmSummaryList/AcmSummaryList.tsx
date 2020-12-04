import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
    Card,
    CardTitle,
    CardBody,
    Text,
    TextVariants,
    Split,
    SplitItem,
    Flex,
    FlexItem,
    Divider,
    Grid,
    GridItem,
} from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    rightSplit: { alignSelf: 'center', paddingRight: '12px' },
    cardBody: { borderTop: '1px solid rgba(0,0,0,0.1)' },
})

type AcmSummaryListProps = {
    title: string
    actions?: React.ReactNode[]
    rightAction?: React.ReactNode
    list: SummarySectionProps[]
}

export function AcmSummaryList(props: AcmSummaryListProps) {
    const classes = useStyles()
    const primary = props.list.find((item) => item.isPrimary)
    const secondary = props.list.filter((item) => !item.isPrimary)
    return (
        <Card>
            <Split>
                <SplitItem>
                    <Flex>
                        <FlexItem>
                            <CardTitle>{props.title}</CardTitle>
                        </FlexItem>
                        {props.actions?.map((action, i) => (
                            <Fragment key={`summary-action-${i}`}>
                                <Divider isVertical inset={{ default: 'inset2xl' }} />
                                <FlexItem>{action}</FlexItem>
                            </Fragment>
                        ))}
                    </Flex>
                </SplitItem>
                <SplitItem isFilled></SplitItem>
                <SplitItem className={classes.rightSplit}>{props.rightAction}</SplitItem>
            </Split>
            <div className={classes.cardBody}>
                <Grid sm={6} md={4} lg={2}>
                    {primary && (
                        <GridItem key={primary.description}>
                            <SummarySection {...primary} />
                        </GridItem>
                    )}
                    {secondary &&
                        secondary.map((item) => (
                            <GridItem key={item.description}>
                                <SummarySection {...item} />
                            </GridItem>
                        ))}
                </Grid>
            </div>
        </Card>
    )
}

const useSectionStyles = makeStyles({
    card: {
        border: 'none !important',
        height: '100%',
        maxWidth: '185px',
        minWidth: '130px',
    },
    cardBody: {
        paddingLeft: '34px',
    },
    cardFooter: {
        height: '100%',
    },
    count: {
        lineHeight: ({ isPrimary }) => (isPrimary ? '2.55rem' : undefined),
        fontSize: (props: SummarySectionProps) => (props.isPrimary ? '36px' : '28px'),
        fontColor: (props: SummarySectionProps) =>
            props.isPrimary ? 'var(--pf-global--primary-color--100)' : undefined,
        '& a': {
            textDecoration: 'none !important',
            fontColor: 'var(--pf-global--Color--100) !important',
        },
    },
    description: {
        fontSize: '14px',
        fontWeight: 600,
    },
})

type SummarySectionProps = {
    count: number
    description: string
    href?: string
    isPrimary?: boolean
}

const SummarySection = (props: SummarySectionProps) => {
    const classes = useSectionStyles(props)
    return (
        <Card
            component="div"
            className={classes.card}
            isFlat
            id={`${props.description.toLowerCase().replace(/\s+/g, '-')}-summary`}
        >
            <CardBody className={classes.cardBody}>
                <Text component={TextVariants.p} className={classes.count}>
                    {props.href ? <Link to={props.href}>{props.count}</Link> : props.count}
                </Text>
                <Text component={TextVariants.p} className={classes.description}>
                    {props.description}
                </Text>
            </CardBody>
        </Card>
    )
}

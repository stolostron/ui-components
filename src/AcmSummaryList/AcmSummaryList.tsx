import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
    Card,
    CardTitle,
    CardBody,
    CardProps,
    CardFooter,
    Text,
    TextVariants,
    Split,
    SplitItem,
    Flex,
    FlexItem,
    Divider,
    Gallery,
    GalleryItem,
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
    if (props.list.filter((item) => item.isPrimary) && props.list.filter((item) => item.isPrimary).length > 1) {
        throw new Error('AcmSummaryList component can only have one primary section')
    }
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
                                <Divider isVertical inset={{default: 'inset2xl'}} />
                                <FlexItem>{action}</FlexItem>
                            </Fragment>
                        ))}
                    </Flex>
                </SplitItem>
                <SplitItem isFilled></SplitItem>
                <SplitItem className={classes.rightSplit}>{props.rightAction}</SplitItem>
            </Split>
            <div className={classes.cardBody}>
                <Gallery>
                    {primary && (
                        <GalleryItem key={primary.description}>
                            <SummarySection {...primary} />
                        </GalleryItem>
                    )}
                    {secondary &&
                        secondary.map((item) => (
                            <GalleryItem key={item.description}>
                                <SummarySection {...item} />
                            </GalleryItem>
                        ))}
                </Gallery>
            </div>
        </Card>
    )
}

const useSectionStyles = makeStyles({
    card: {
        // borderRight: (props: SummarySectionProps) => (props.isPrimary ? '1px solid rgba(0,0,0,0.1)' : ''),
        // padding: '37px 48px 31px 18px',
        border: 'none !important',
        height: '100%',
        maxWidth: '37px',
    },
    cardFooter: {
        height: '100%',
    },
    count: {
        fontSize: (props: SummarySectionProps) => (props.isPrimary ? '36px' : '28px'),
        fontColor: (props: SummarySectionProps) => (props.isPrimary ? 'var(--pf-global--primary-color--100)' : ''),
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
        // <div className={classes.container}>
        <Card component="div" className={classes.card} isFlat>
            <CardFooter>
                <Text component={TextVariants.p} className={classes.count}>
                    {props.href ? <Link to={props.href}>{props.count}</Link> : props.count}
                </Text>
                <Text component={TextVariants.p} className={classes.description}>
                    {props.description}
                </Text>
            </CardFooter>
        </Card>
        // </div>
    )
}

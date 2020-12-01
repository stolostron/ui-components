import React from 'react'
import { Card, CardTitle, Badge } from '@patternfly/react-core'
import { ChartDonut } from '@patternfly/react-charts'
import { makeStyles } from '@material-ui/styles'
import { useViewport } from '../AcmChartGroup'

type StyleProps = {
    danger?: boolean
    viewWidth: number
}

/* istanbul ignore next */
const useStyles = makeStyles({
    card: {
        maxHeight: '259px',
        minWidth: (props: StyleProps) => (props.viewWidth > 376 ? '376px' : undefined),
        maxWidth: (props: StyleProps) => (props.viewWidth < 376 ? '376px' : undefined),
        '& .pf-c-chart > svg g path:last-of-type': {
            fill: (props: StyleProps) => (props.danger ? '#E62325 !important' : undefined),
        },
    },
    cardTitle: {
        paddingBottom: 'unset !important',
    },
    chartContainer: {
        maxWidth: '376px',
    },
})

export function AcmDonutChart(props: {
    title: string
    description: string
    data: { key: string; value: number; isPrimary?: boolean; isDanger?: boolean }[]
}) {
    const chartData = props.data.map((d) => ({ x: d.key, y: d.value }))
    const legendData = props.data.map((d) => ({ name: `${d.value} ${d.key}` }))
    const total = props.data.reduce((a, b) => a + b.value, 0)
    /* istanbul ignore next */
    const primary = props.data.find((d) => d.isPrimary) || { key: '', value: 0 }

    const { viewWidth } = useViewport()
    const classes = useStyles({ ...props, danger: props.data.some((d) => d.isDanger), viewWidth } as StyleProps)
    return (
        <Card className={classes.card} id={`${props.title.toLowerCase().replace(/\s+/g, '-')}-chart`}>
            <CardTitle className={classes.cardTitle}>
                {props.title} <Badge isRead>{total}</Badge>
            </CardTitle>
            <div className={classes.chartContainer}>
                <ChartDonut
                    ariaTitle={props.title}
                    ariaDesc={props.description}
                    legendOrientation="vertical"
                    legendPosition="right"
                    constrainToVisibleArea={true}
                    data={chartData}
                    legendData={legendData}
                    labels={({ datum }) => `${datum.x}: ${(datum.y / total) * 100}%`}
                    padding={{
                        bottom: 20,
                        left: 20,
                        right: 145,
                        top: 20,
                    }}
                    title={`${Math.round((primary.value / total) * 100)}%`}
                    subTitle={primary.key}
                    width={/* istanbul ignore next */ viewWidth < 376 ? viewWidth : 376}
                    height={/* istanbul ignore next */ viewWidth < 376 ? 150 : 200}
                />
            </div>
        </Card>
    )
}

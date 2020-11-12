import React, { ReactNode, useState } from 'react'
import {
    Card,
    CardHeader,
    CardHeaderMain,
    CardActions,
    CardTitle,
    CardBody,
    CardFooter,
    CardProps,
    Dropdown,
    DropdownItem,
    KebabToggle,
    Skeleton,
    DropdownItemProps,
} from '@patternfly/react-core'
import { AcmTemplateIcon } from '../AcmIcons/AcmIcons'
import { makeStyles } from '@material-ui/styles'
import '@patternfly/react-core/dist/styles/base.css'

type CardHeaderActions = DropdownItemProps & {
    text: string
}

type CardHeaderProps = {
    title: string
    description: string
    actions?: CardHeaderActions[]
    onActionClick: (e) => void
}

type CardFooterProps = {
    countDescription?: string
    countLink?: string | ReactNode
}

type AcmCountCardProps = CardProps & {
    onCardClick?: () => void
    cardHeader?: CardHeaderProps
    cardFooter?: CardFooterProps
    count: number
    countTitle: string
    isFlat: boolean
}

type CardDropdownProps = {
    dropdownItems: { text: string }[]
    toggle?: React.ReactNode
    onSelect: (event: React.SyntheticEvent | undefined) => void
}

const useStyles = makeStyles({
    card: {
        minHeight: '250px',
    },
    cardSkeleton: {
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        minHeight: '8rem',
    },
    headerDescription: {
        fontSize: 'var(--pf-global--FontSize--sm)',
        color: 'var(--pf-global--BackgroundColor--dark-400)',
    },
    dropdown: {
        width: '10rem',
    },
    count: {
        color: (props: AcmCountCardProps) =>
            props.count !== 0 ? 'var(--pf-global--link--Color)' : 'var(--pf-global--BackgroundColor--dark-100)',
        fontSize: 'var(--pf-global--FontSize--3xl)',
    },
    countTitle: {
        fontSize: 'var(--pf-global--FontSize--sm)',
        fontWeight: '700',
    },
})

export function CardDropdown(props: CardDropdownProps) {
    const classes = useStyles(props)
    const [isOpen, setOpen] = useState<boolean>(false)
    const onSelect = (event: React.SyntheticEvent | undefined) => {
        event.stopPropagation()
        setOpen(!isOpen)
        props.onSelect(event)
    }

    return (
        <Dropdown
            onSelect={(event) => {
                onSelect(event)
            }}
            toggle={<KebabToggle onToggle={() => setOpen(!isOpen)} />}
            isOpen={isOpen}
            isPlain
            dropdownItems={props.dropdownItems.map((item) => (
                <DropdownItem className={classes.dropdown} key={item.text} {...item}>
                    {item.text}
                </DropdownItem>
            ))}
            position={'right'}
        />
    )
}

export function AcmCardSkeleton() {
    const classes = useStyles()
    return (
        <Card className={classes.cardSkeleton}>
            <CardTitle>
                <Skeleton width="25%" />
            </CardTitle>
            <CardBody>
                <Skeleton width="80%" height="4rem" />
            </CardBody>
            <CardFooter>
                <Skeleton width="25%" height="3rem" />
            </CardFooter>
        </Card>
    )
}

export const AcmCountCard = (props: AcmCountCardProps) => {
    const classes = useStyles(props)
    const { count, countTitle, cardFooter, cardHeader } = props
    return (
        <Card
            className={classes.card}
            onClick={props.onCardClick}
            isSelectable={!!props.onCardClick}
            isFlat={!props.onCardClick}
        >
            {props.cardHeader && (
                <CardHeader>
                    {cardHeader?.actions && cardHeader?.actions?.length > 0 && (
                        <CardActions>
                            <CardDropdown dropdownItems={cardHeader.actions} onSelect={cardHeader.onActionClick} />
                        </CardActions>
                    )}
                    <CardHeaderMain>
                        <AcmTemplateIcon />
                        <CardTitle>{cardHeader.title}</CardTitle>
                        <p className={classes.headerDescription}>{cardHeader.description}</p>
                    </CardHeaderMain>
                </CardHeader>
            )}
            <CardBody className={classes.body}>
                <div className={classes.count}>{count}</div>
                <div className={classes.countTitle}>{countTitle}</div>
            </CardBody>
            {props.cardFooter && (
                <CardFooter>
                    {cardFooter.countDescription && <div />}
                    {cardFooter.countLink && <div />}
                </CardFooter>
            )}
        </Card>
    )
}

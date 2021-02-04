import React from 'react'
import { Label, LabelGroup } from '@patternfly/react-core'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    UnknownIcon,
    InProgressIcon,
} from '@patternfly/react-icons'

type AcmInlineStatusGroupProps = {
    healthy?: number
    warning?: number
    progress?: number
    danger?: number
    unknown?: number
    showZeroes?: boolean
}

export function AcmInlineStatusGroup(props: AcmInlineStatusGroupProps) {
    const show = (count?: number) => {
        if (count === undefined) {
            return false
        } else if (count === 0) {
            return props.showZeroes
        } else {
            return true
        }
    }
    return (
        <LabelGroup defaultIsOpen isClosable={false} numLabels={10}>
            {show(props.healthy) && (
                <Label color="green" icon={<CheckCircleIcon />}>
                    {props.healthy}
                </Label>
            )}
            {show(props.progress) && (
                <Label color="grey" icon={<InProgressIcon />}>
                    {props.progress}
                </Label>
            )}
            {show(props.warning) && (
                <Label color="orange" icon={<ExclamationTriangleIcon />}>
                    {props.warning}
                </Label>
            )}

            {show(props.danger) && (
                <Label color="red" icon={<ExclamationCircleIcon />}>
                    {props.danger}
                </Label>
            )}
            {show(props.unknown) && (
                <Label variant="outline" icon={<UnknownIcon />}>
                    {props.unknown}
                </Label>
            )}
        </LabelGroup>
    )
}

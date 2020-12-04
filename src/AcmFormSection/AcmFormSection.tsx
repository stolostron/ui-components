import { Popover, Split, SplitItem, Title, TitleProps } from '@patternfly/react-core'
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon'
import React, { Fragment } from 'react'

export function AcmFormSection(
    props: Omit<TitleProps, 'headingLevel'> & { title: string; tooltip?: string; addSpacing?: boolean }
) {
    return (
        <Split style={{ marginTop: props.addSpacing ? '16px' : undefined }}>
            <SplitItem>
                <Title {...props} headingLevel="h2" size="xl">
                    {props.title}
                </Title>
            </SplitItem>
            {props.tooltip && (
                <SplitItem>
                    <Fragment>
                        &nbsp;
                        <Popover
                            id={`${props.id}-label-help-popover`}
                            headerContent={'labelHelpTitle'}
                            bodyContent={'labelHelp'}
                        >
                            <button
                                id={`${props.id}-label-help-button`}
                                aria-label="More info"
                                onClick={/* istanbul ignore next */ (e) => e.preventDefault()}
                                className="pf-c-form__group-label-help"
                            >
                                <HelpIcon noVerticalAlign size="sm" />
                            </button>
                        </Popover>
                    </Fragment>
                </SplitItem>
            )}
        </Split>
    )
}

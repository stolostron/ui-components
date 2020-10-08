import React from 'react'
import {
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateVariant,
    Split,
    SplitItem,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
} from '@patternfly/react-core'

export function AcmEmptyState(props: { title: string; message: string; action?: string }) {
    return (
        <EmptyState variant={EmptyStateVariant.xl}>
            <Title size="4xl" headingLevel="h5">
                {props.title}
            </Title>
            <EmptyStateBody>{props.message}</EmptyStateBody>
            <EmptyStateBody>
                {props.action ? (
                    <Split>
                        <SplitItem isFilled></SplitItem>
                        <SplitItem>
                            <Toolbar>
                                <ToolbarContent>
                                    <ToolbarItem>
                                        <Button>{props.action}</Button>
                                    </ToolbarItem>
                                </ToolbarContent>
                            </Toolbar>
                        </SplitItem>
                        <SplitItem isFilled></SplitItem>
                    </Split>
                ) : (
                    <></>
                )}
            </EmptyStateBody>
        </EmptyState>
    )
}

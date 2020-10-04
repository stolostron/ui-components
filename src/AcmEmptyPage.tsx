import React from 'react'
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    EmptyState,
    EmptyStateBody,
    EmptyStateVariant,
    PageSection,
    Split,
    SplitItem,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
} from '@patternfly/react-core'

export function AcmEmptyPage(props: { title: string; message: string; action?: string }) {
    return (
        <PageSection>
            <Card>
                <CardHeader></CardHeader>
                <CardBody>
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
                </CardBody>
                <CardFooter></CardFooter>
            </Card>
        </PageSection>
    )
}

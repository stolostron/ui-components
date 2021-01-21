import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody,
    ExpandableSection,
    Title,
    ClipboardCopy,
    ClipboardCopyVariant,
} from '@patternfly/react-core'
import { ExclamationTriangleIcon } from '@patternfly/react-icons'

type ErrorBoundaryState = {
    hasError: boolean
    error: Error
    errorInfo: ErrorInfo
}

type ErrorInfo = {
    componentStack: string
}

export class AcmPageErrorBoundary extends React.Component<
    { children: React.ReactNode | React.ReactNode[] },
    ErrorBoundaryState
> {
    state = {
        hasError: false,
        error: {
            message: '',
            stack: '',
            name: '',
        },
        errorInfo: {
            componentStack: '',
        },
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.log('error name', error.name, 'error.message', error.message, 'error stack', error.stack)
        console.log('errorInfo', errorInfo)
        this.setState({ error, errorInfo, hasError: true })
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card>
                    <EmptyState style={{ height: '100%' }}>
                        <EmptyStateIcon icon={ExclamationTriangleIcon} />
                        <Title headingLevel="h4" size="lg">
                            Uh oh, something went wrong...
                        </Title>
                        <EmptyStateBody style={{ textAlign: 'left' }}>
                            <ExpandableSection toggleText="See error details...">
                                <div style={{ marginBottom: '12px' }}>{this.state.error.name}</div>
                                <div style={{ marginBottom: '12px' }}>{this.state.error.message}</div>
                                <div style={{ marginBottom: '12px' }}>
                                    Component trace:
                                    <ClipboardCopy isReadOnly isCode variant={ClipboardCopyVariant.expansion}>
                                        {this.state.errorInfo.componentStack}
                                    </ClipboardCopy>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <span>Stack trace: </span>
                                    <pre>{this.state.error.stack}</pre>
                                </div>
                            </ExpandableSection>
                        </EmptyStateBody>
                    </EmptyState>
                </Card>
            )
        }

        return this.props.children
    }
}

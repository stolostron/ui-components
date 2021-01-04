import React, { useRef } from 'react'
import {
    Drawer,
    DrawerPanelContent,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelBody,
    DrawerHead,
    DrawerActions,
    DrawerCloseButton,
} from '@patternfly/react-core'

export type AcmDrawerProps = {
    isExpanded: boolean
    onCloseClick: () => void
    title?: string | React.ReactNode
    children?: React.ReactNode | React.ReactNode[]
    panelContent?: React.ReactNode | React.ReactNode[]
}

export function AcmDrawer(props: AcmDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    return (
        <Drawer isExpanded={props.isExpanded} onExpand={/* istanbul ignore next */ () => drawerRef?.current?.focus()}>
            <DrawerContent
                style={{ backgroundColor: 'unset' }}
                panelContent={
                    <DrawerPanelContent>
                        <DrawerHead>
                            <div ref={drawerRef} tabIndex={0} style={{ fontSize: '24px', outline: 'none' }}>
                                {props.title}
                            </div>
                            <DrawerActions>
                                <DrawerCloseButton onClick={props.onCloseClick} />
                            </DrawerActions>
                        </DrawerHead>
                        <DrawerPanelBody>{props.panelContent}</DrawerPanelBody>
                    </DrawerPanelContent>
                }
            >
                <DrawerContentBody>{props.children}</DrawerContentBody>
            </DrawerContent>
        </Drawer>
    )
}

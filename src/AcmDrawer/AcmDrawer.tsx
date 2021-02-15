import React, { useRef, useState, useContext, createContext } from 'react'
import {
    Drawer,
    DrawerPanelContent,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelBody,
    DrawerHead,
    DrawerActions,
    DrawerCloseButton,
    DrawerPanelContentProps,
} from '@patternfly/react-core'

export const AcmDrawerContext = createContext<{
    drawerContext?: AcmDrawerProps
    setDrawerContext: React.Dispatch<React.SetStateAction<AcmDrawerProps | undefined>>
}>({
    drawerContext: undefined,
    setDrawerContext: /* istanbul ignore next */ () => undefined,
})

export function AcmDrawerProvider(props: { children: React.ReactNode | React.ReactNode[] }) {
    const [drawerContext, setDrawerContext] = useState<AcmDrawerProps | undefined>()

    return (
        <AcmDrawerContext.Provider value={{ drawerContext, setDrawerContext }}>
            {props.children}
        </AcmDrawerContext.Provider>
    )
}

export type AcmDrawerProps = {
    isExpanded?: boolean
    onCloseClick?: () => void
    title?: string | React.ReactNode
    children?: React.ReactNode | React.ReactNode[]
    panelContent?: React.ReactNode | React.ReactNode[]
    panelContentProps?: DrawerPanelContentProps
}

export function AcmDrawer(props: AcmDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const { drawerContext } = useContext(AcmDrawerContext)

    /* istanbul ignore next */
    const isExpanded = props?.isExpanded ?? drawerContext?.isExpanded
    /* istanbul ignore next */
    const onCloseClick = props?.onCloseClick ?? drawerContext?.onCloseClick
    /* istanbul ignore next */
    const title = props?.title ?? drawerContext?.title
    /* istanbul ignore next */
    const panelContent = props?.panelContent ?? drawerContext?.panelContent
    /* istanbul ignore next */
    const panelContentProps = props?.panelContentProps ?? drawerContext?.panelContentProps ?? {}

    return (
        <Drawer isExpanded={isExpanded} onExpand={/* istanbul ignore next */ () => drawerRef?.current?.focus()}>
            <DrawerContent
                style={{ backgroundColor: 'unset' }}
                panelContent={
                    <DrawerPanelContent {...panelContentProps}>
                        <DrawerHead>
                            <div ref={drawerRef} tabIndex={0} style={{ fontSize: '24px', outline: 'none' }}>
                                {title}
                            </div>
                            <DrawerActions>
                                <DrawerCloseButton onClick={onCloseClick} />
                            </DrawerActions>
                        </DrawerHead>
                        <DrawerPanelBody>{panelContent}</DrawerPanelBody>
                    </DrawerPanelContent>
                }
            >
                <DrawerContentBody>{props.children}</DrawerContentBody>
            </DrawerContent>
        </Drawer>
    )
}

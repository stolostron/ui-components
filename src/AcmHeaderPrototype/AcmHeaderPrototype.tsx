import React, { useState } from 'react'
import {
  Page,
  PageHeader,
  PageHeaderTools,
  PageSidebar,
} from '@patternfly/react-core'

export type AcmHeaderPrototypeProps = {
    href: string
    target: string
}

export function AcmHeaderPrototype(props: AcmHeaderPrototypeProps) {
    const [isOpen, setOpen] = useState<boolean>(false)

    const Header = (
        <PageHeader
          logo="Logo"
          logoProps={props}
          headerTools={<PageHeaderTools>header-tools</PageHeaderTools>}
          showNavToggle
          isNavOpen={isOpen}
          onNavToggle={() => setOpen(!isOpen)}
        />
      )

    const Sidebar = <PageSidebar nav="Navigation" isNavOpen={isOpen} />

    return (
        <Page header={Header} sidebar={Sidebar}></Page>
    )
}

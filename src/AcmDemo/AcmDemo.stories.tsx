import {
    Alert,
    Button,
    ButtonVariant,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Divider,
    Drawer,
    DrawerActions,
    DrawerCloseButton,
    DrawerContent,
    DrawerContentBody,
    DrawerHead,
    DrawerPanelBody,
    DrawerPanelContent,
    Dropdown,
    DropdownToggle,
    InputGroup,
    Label,
    LabelGroup,
    Nav,
    NavItem,
    NavList,
    Page,
    PageGroup,
    PageHeader,
    PageHeaderTools,
    PageNavigation,
    PageSection,
    PageSectionVariants,
    PageSidebar,
    Pagination,
    Stack,
    Text,
    TextContent,
    TextInput,
    TextVariants,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
} from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css'
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon'
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon'
import { Table, TableBody, TableHeader } from '@patternfly/react-table'
import { Meta } from '@storybook/react'
import React, { Fragment, useState } from 'react'

const meta: Meta = {
    title: 'Demo',
}
export default meta

export const Demo = () => {
    const [activeItem, setActiveitem] = useState('1')
    const [isDrawerExpanded, setDrawerExpanded] = useState(true)

    return (
        <Page
            header={
                <PageHeader
                    logo={
                        <Stack>
                            <Title headingLevel="h3" style={{ color: 'white' }}>
                                Red Hat
                            </Title>
                            <Text style={{ color: 'white' }}>Advanced Cluster Management for Kubernetes</Text>
                        </Stack>
                    }
                    logoProps={{
                        href: 'https://patternfly.org',
                        target: '_blank',
                    }}
                    headerTools={<PageHeaderTools> </PageHeaderTools>}
                    showNavToggle
                />
            }
            sidebar={
                <PageSidebar
                    nav={
                        <Nav onSelect={(result) => setActiveitem(result.itemId.toString())} aria-label="Nav">
                            <NavList>
                                <NavItem itemId={0} isActive={activeItem === '0'}>
                                    Welcome
                                </NavItem>
                                <NavItem itemId={1} isActive={activeItem === '1'}>
                                    Cluster Management
                                </NavItem>
                                <NavItem itemId={2} isActive={activeItem === '2'}>
                                    Application Management
                                </NavItem>
                                <NavItem itemId={3} isActive={activeItem === '3'}>
                                    Policy Management
                                </NavItem>
                            </NavList>
                        </Nav>
                    }
                />
            }
            isManagedSidebar
        >
            <PageGroup>
                {/* <PageBreadcrumb>
                    <Breadcrumb>
                        <BreadcrumbItem>Clusters</BreadcrumbItem>
                        <BreadcrumbItem to="#" isActive>
                            local-cluster
                        </BreadcrumbItem>
                    </Breadcrumb>
                </PageBreadcrumb> */}
                {/* <Alert isInline title="Alert" variant="info"></Alert> */}
                <PageSection variant={PageSectionVariants.light}>
                    <TextContent>
                        <Text component="h1">Cluster Management</Text>
                    </TextContent>
                </PageSection>
                <Divider component="div" />
                <PageNavigation style={{ paddingTop: '0' }}>
                    <Nav aria-label="Nav" variant="tertiary">
                        <NavList>
                            <NavItem itemId={0} isActive>
                                Clusters
                            </NavItem>
                            <NavItem itemId={1}>Discovered clusters</NavItem>
                            <NavItem itemId={2}>Provider connections</NavItem>
                            <NavItem itemId={3}>Bare metal assets</NavItem>
                        </NavList>
                    </Nav>
                </PageNavigation>
            </PageGroup>
            <Divider component="div" />

            <Drawer isExpanded={true} isInline>
                <DrawerContent
                    panelContent={
                        <DrawerPanelContent style={{ flexBasis: 'unset' }}>
                            <DrawerHead style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ paddingRight: '64px' }}>Cluster Details</div>
                                <DrawerActions>
                                    <DrawerCloseButton />
                                </DrawerActions>
                            </DrawerHead>

                            <DrawerPanelBody>
                                <DescriptionList>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>Name</DescriptionListTerm>
                                        <DescriptionListDescription>Cluster 1</DescriptionListDescription>
                                    </DescriptionListGroup>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>Namespace</DescriptionListTerm>
                                        <DescriptionListDescription>
                                            <a href="#">Cluster 1</a>
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>Labels</DescriptionListTerm>
                                        <DescriptionListDescription>
                                            <Label>example</Label>
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>Pod selector</DescriptionListTerm>
                                        <DescriptionListDescription>
                                            <Button variant="link" isInline icon={<PlusCircleIcon />}>
                                                app=MyApp
                                            </Button>
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>Annotation</DescriptionListTerm>
                                        <DescriptionListDescription>2 Annotations</DescriptionListDescription>
                                    </DescriptionListGroup>
                                </DescriptionList>
                            </DrawerPanelBody>
                        </DrawerPanelContent>
                    }
                >
                    <DrawerContentBody>
                        {/* <Alert isInline title="Alert" variant="info"></Alert> */}

                        <Toolbar className="pf-m-page-insets">
                            <ToolbarContent>
                                <ToolbarItem variant="search-filter">
                                    <InputGroup>
                                        <TextInput
                                            name="full-page-data-toolbar-input1"
                                            id="full-page-data-toolbar-input1"
                                            type="search"
                                            aria-label="search input example"
                                            // onChange={this.onInputChange}
                                            // value={inputValue}
                                        />
                                        <Button
                                            variant={ButtonVariant.control}
                                            aria-label="search button for search input"
                                        >
                                            <SearchIcon />
                                        </Button>
                                    </InputGroup>
                                </ToolbarItem>
                                <ToolbarItem>
                                    <Dropdown toggle={<DropdownToggle isPrimary>Actions</DropdownToggle>} />
                                </ToolbarItem>

                                <ToolbarItem alignment={{ default: 'alignRight' }} variant="pagination">
                                    <Pagination itemCount={523} perPage={10} page={1} isCompact />
                                </ToolbarItem>
                            </ToolbarContent>
                        </Toolbar>
                        <Divider component="div" />
                        <PageSection variant={PageSectionVariants.light}>
                            <Table
                                // variant={'compact'}
                                borders={true}
                                cells={columns}
                                rows={rows}
                                actions={[
                                    {
                                        title: 'Some action',
                                        onClick: (event, rowId, rowData, extra) =>
                                            console.log('clicked on Some action, on row: ', rowId),
                                    },
                                    {
                                        title: <a href="https://www.patternfly.org">Link action</a>,
                                    },
                                    {
                                        isSeparator: true,
                                    },
                                    {
                                        title: 'Third action',
                                        onClick: (event, rowId, rowData, extra) =>
                                            console.log('clicked on Third action, on row: ', rowId),
                                    },
                                ]}
                            >
                                <TableHeader />
                                <TableBody />
                            </Table>
                            <Toolbar className="pf-m-page-insets">
                                <ToolbarContent>
                                    <ToolbarItem alignment={{ default: 'alignRight' }} variant="pagination">
                                        <Pagination itemCount={523} perPage={10} page={1} />
                                    </ToolbarItem>
                                </ToolbarContent>
                            </Toolbar>
                        </PageSection>
                    </DrawerContentBody>
                </DrawerContent>
            </Drawer>
        </Page>
    )
}
Demo.args = {}

const columns = ['Name', 'Status', 'Provider', 'Distribution', 'Labels', 'Nodes']
const rows = [...new Array(10)].map((v, i) => {
    return [
        <Fragment key={`name-${i}`}>
            <Button variant="link" isInline>
                {`Cluster ${i + 1}`}
            </Button>
        </Fragment>,
        ['Ready', 'Offline', 'Pending'][i % 3],
        ['Amazon Web Services', 'Microsoft Azure', 'Google Cloud'][i % 3],
        ['OpenShift 4.4.0', 'OpenShift 4.5.0', 'OpenShift 4.6.8'][i % 3],
        <Fragment key={`labels-${i}`}>
            <LabelGroup>
                {['Label 1', 'Label 2', 'Label 3'].map((label) => (
                    <Label key={label}>{label}</Label>
                ))}
            </LabelGroup>
        </Fragment>,
        <Fragment key="5">
            <Label key="5" color="green">
                6
            </Label>
        </Fragment>,
    ]
})

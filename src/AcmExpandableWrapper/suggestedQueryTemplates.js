/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
'use strict'

export default {
    templates: [
        {
            id: 'search.suggested.workloads.name',
            name: 'Workloads',
            description: 'A pre-defined search to help you review your workloads.',
            resultHeader: 'search.tile.results',
            searchText: 'kind:daemonset,deployment,job,statefulset,replicaset',
        },
        {
            id: 'search.suggested.unhealthy.name',
            name: 'Unhealthy Pods',
            description: 'Show pods with unhealthy status.',
            resultHeader: 'table.header.status.unhealthy',
            searchText:
                'kind:pod status:Pending,Error,Failed,Terminating,ImagePullBackOff,CrashLoopBackOff,RunContainerError,ContainerCreating',
        },
        {
            id: 'search.suggested.createdLastHour.name',
            name: 'Created last hour',
            description: 'Search for resources created within the last hour.',
            resultHeader: 'search.tile.results',
            searchText: 'created:hour',
        },
    ],
}

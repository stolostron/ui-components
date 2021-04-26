###############################################################################
# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project
###############################################################################
BEFORE_SCRIPT := $(shell build/before-make.sh)

.PHONY: check
check: check-copyright

.PHONY: check-copyright
check-copyright:
	@build/check-copyright.sh

MIN_PNPM_VER_MAJOR=10
MIN_PNPM_VER_MINOR=4
MIN_PNPM_VER_PATCH=0

CUR_PNPM_VER := $(shell pnpm -v)
CUR_PNPM_VER_MAJOR := $(shell echo $(CUR_PNPM_VER) | cut -f1 -d.)
CUR_PNPM_VER_MINOR := $(shell echo $(CUR_PNPM_VER) | cut -f2 -d.)
CUR_PNPM_VER_PATCH := $(shell echo $(CUR_PNPM_VER) | cut -f3 -d.)
IS_PNPM_OK := $(shell [ $(CUR_PNPM_VER_MAJOR) -gt $(MIN_PNPM_VER_MAJOR) -o \( $(CUR_PNPM_VER_MAJOR) -eq $(MIN_PNPM_VER_MAJOR) -a \( $(CUR_PNPM_VER_MINOR) -gt $(MIN_PNPM_VER_MINOR) -o \( $(CUR_PNPM_VER_MINOR) -eq $(MIN_PNPM_VER_MINOR) -a $(CUR_PNPM_VER_PATCH) -ge $(MIN_PNPM_VER_PATCH) \)  \) \) ] && echo true)

CUSTOMER_LIST = demo fhtek totalplay
WIFI_VERSION_LIST = v6 v7

ifndef CUSTOMER_ID
CUSTOMER_ID=demo
endif

ifndef WIFI_VERSION
WIFI_VERSION=v6
endif

ifeq ($(shell echo $(CUSTOMER_LIST) | grep $(CUSTOMER_ID)),)
$(error CUSTOMER_ID should be oneof ($(CUSTOMER_LIST)))
endif

ifeq ($(shell echo $(WIFI_VERSION_LIST) | grep $(WIFI_VERSION)),)
$(error WIFI_VERSION should be oneof ($(WIFI_VERSION_LIST)))
endif

all: install

install:
	make build

check_pnpm_version:
ifneq ($(IS_PNPM_OK),true)
	$(error pnpm-v$(MIN_PNPM_VER_MAJOR).$(MIN_PNPM_VER_MINOR).$(MIN_PNPM_VER_PATCH)+ required)
endif

depend: package.json pnpm-lock.yaml check_pnpm_version
	pnpm install

build: depend
	@CUSTOMER_ID=$(CUSTOMER_ID) WIFI_VERSION=$(WIFI_VERSION) pnpm build-only

dev: depend
	@CUSTOMER_ID=$(CUSTOMER_ID) WIFI_VERSION=$(WIFI_VERSION) pnpm dev

.PHONY: all install check_pnpm_version depend dev build

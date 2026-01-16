<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0827') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form">
        <fh-form-item :label="$t('trans0827')">
          <fh-switch v-model="form.enable"></fh-switch>
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0104')">
            <!--  @change="changeFilterMode" 暂时不用切换提示 -->
            <fh-radio-group v-model="form.mode">
              <fh-radio v-for="mode in filteringModes" :key="mode.value" :label="mode.value">
                {{ mode.text }}
              </fh-radio>
            </fh-radio-group>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__table">
        <fh-table
          :columns="columns"
          :data-source="data"
          :show-row-checkbox="false"
          :show-header="isShowAddBtn"
        >
          <template #operationgroup>
            <fh-icon
              class="page__header-icon"
              v-if="isShowAddBtn"
              @click="openAddModal"
              name="icon-add"
              :title="$t('trans0164')"
            />
          </template>
          <template #operation="scope">
            <fh-icon
              class="page__header-icon"
              @click="openEditModal(scope.row)"
              name="icon-edit-square"
              :title="$t('trans0165')"
            />
            <fh-icon
              class="page__header-icon"
              @click="del(scope.row)"
              name="icon-delete"
              :title="$t('trans0111')"
            />
          </template>
        </fh-table>
      </div>
      <fh-modal v-model="visible" :title="modalTitle" :before-close="handleClose">
        <template #body>
          <fh-form
            class="form modal-form"
            ref="modalFormRef"
            :model="modalForm"
            :rules="modalRules"
          >
            <fh-form-item :label="$t('trans0711')" prop="id">
              <fh-select v-model="modalForm.id" :options="ssidOpts" @change="changeSsid">
              </fh-select>
            </fh-form-item>
            <fh-form-item :label="$t('trans0097')" prop="mac" ref="macRef">
              <fh-input v-model="modalForm.mac" :placeholder="$t('trans0396')"> </fh-input>
            </fh-form-item>
            <fh-form-item class="form__submit-btn">
              <fh-button @click="saveItem" block>
                {{ $t('trans0002') }}
              </fh-button>
            </fh-form-item>
          </fh-form>
        </template>
      </fh-modal>
    </div>
  </div>
</template>

<script>
import { isMac, format, successTips } from '@/util/tool'
import { FilteringModes, ModalType, SsidText, Ssid4, Ssidac4, customers } from '@/util/constant'
import {
  getWifiMacFilterStatus,
  setWifiMacFilterStatus,
  getWifiMacFilter,
  addWifiMacFilter,
  editWifiMacFilter,
  delWifiMacFilter,
  getWifi2g,
  getWifi5g,
} from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

const { convertBooleanStatus } = useDataClean()
const maxRuleNum = 16
export default {
  name: 'WifiMacFilterPage',
  data() {
    return {
      form: {
        enable: false,
        mode: FilteringModes.blackList,
      },
      modalForm: {
        id: '',
        index: -1,
        mac: '',
        pre_id: '',
        pre_mac: '',
      },
      ssidOpts: [],
      columns: [
        {
          key: 'idAlias',
          title: this.$t('trans0711'),
        },
        {
          key: 'mac',
          title: this.$t('trans0097'),
        },
      ],
      data: [],
      visible: false,
      modalType: ModalType.add,
      all: 'all',
      modalRules: {
        id: [
          {
            rule: (value) => value.trim(),
            message: this.$t('trans0677').format(this.$t('trans0711')),
          },
        ],
        mac: [
          {
            rule: (value) => value.trim(),
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isMac(value),
            message: format(this.$t('trans0566'), [this.$t('trans0097')]),
          },
          {
            rule: (value) => {
              let flag = true
              let tempData = []
              if (this.isAdd) {
                tempData = this.data
              } else {
                tempData = this.data.filter((item) => item.index !== this.modalForm.index)
              }
              flag = !tempData.some((item) => {
                let flag1 = false
                if (this.modalForm.id === this.all || item.id === this.all) {
                  flag1 = true
                } else {
                  flag1 = item.id === this.modalForm.id
                }
                return flag1 && item.mac === value
              })
              return flag
            },
            message: this.$t('trans0400'),
          },
        ],
      },
      filteringModes: [
        {
          value: FilteringModes.blackList,
          text: this.$t('trans0105'),
        },
        {
          value: FilteringModes.whiteList,
          text: this.$t('trans0106'),
        },
      ],
    }
  },
  computed: {
    isBlackList() {
      return this.form.mode === FilteringModes.blackList
    },
    isShowAddBtn() {
      return this.data.length < maxRuleNum
    },
    isAdd() {
      return this.modalType === ModalType.add
    },
    isEdit() {
      return this.modalType === ModalType.edit
    },
    modalTitle() {
      return this.isAdd ? this.$t('trans0164') : this.$t('trans0165')
    },
  },
  methods: {
    changeFilterMode() {
      const message = this.$t('trans0125').format(
        this.isBlackList ? this.$t('trans0105') : this.$t('trans0106'),
      )
      this.$dialog
        .confirm({
          okText: this.$t('trans0019'),
          cancelText: this.$t('trans0020'),
          message,
        })
        .then(() => {})
        .catch(() => {
          this.form.mode = this.isBlackList ? FilteringModes.whiteList : FilteringModes.blackList
        })
    },
    getWifiMacFilterStatusData() {
      getWifiMacFilterStatus().then(({ data }) => {
        this.form.enable = convertBooleanStatus(data.enable)
        this.form.mode = data.mode
        this.init()
      })
    },
    save() {
      const data = {
        enable: convertBooleanStatus(this.form.enable),
        mode: this.form.mode,
      }
      return setWifiMacFilterStatus(data).then(() => {
        successTips()
      })
    },
    openAddModal() {
      this.modalForm.id = this.ssidOpts[0].value || ''
      this.modalForm.mac = ''
      this.modalForm.pre_id = ''
      this.modalForm.pre_mac = ''
      this.modalForm.index = -1
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.id = row.id
      this.modalForm.mac = row.mac
      this.modalForm.pre_id = row.pre_id
      this.modalForm.pre_mac = row.pre_mac
      this.modalForm.index = row.index
      this.modalType = ModalType.edit
      this.visible = true
    },
    getWifiMacFilterList(isInit = false) {
      return getWifiMacFilter()
        .then(({ data }) => {
          const tableData = []
          const { items } = data
          items.forEach((item, i) => {
            if (item.id !== Ssid4 && item.id !== Ssidac4) {
              tableData.push({
                ...item,
                idAlias: item.id === this.all ? this.$t('trans0537') : SsidText[item.id],
                pre_id: item.id,
                pre_mac: item.mac,
                index: i,
              })
            }
          })
          this.data = tableData
        })
        .catch(() => {})
        .finally(() => {
          if (!isInit) this.visible = false
        })
    },
    handleClose() {
      this.$refs.modalFormRef.clearValidate()
    },
    getSsidIndex() {
      return Promise.all([getWifi2g(), getWifi5g()]).then(([res1, res2]) => {
        const wifi2g = res1.data.items
        const wifi5g = res2.data.items
        const ssidOpts = [
          {
            value: this.all,
            text: this.$t('trans0537'),
          },
        ]
        ;[...wifi2g, ...wifi5g].forEach((item) => {
          if (convertBooleanStatus(item.enable)) {
            if (
              __APP_CUSTOMER_CONFIG__.name !== customers.totalplay ||
              (__APP_CUSTOMER_CONFIG__.name === customers.totalplay &&
                item.id !== Ssid4 &&
                item.id !== Ssidac4)
            ) {
              ssidOpts.push({
                value: item.id,
                text: SsidText[item.id],
              })
            }
          }
        })
        this.ssidOpts = ssidOpts
      })
    },
    saveItem() {
      if (!this.$refs.modalFormRef.validate()) return
      const data = {
        id: this.modalForm.id,
        mac: this.modalForm.mac,
      }
      if (this.isAdd) {
        addWifiMacFilter(data).then(() => {
          successTips()
          this.getWifiMacFilterList()
        })
      }
      if (this.isEdit) {
        delWifiMacFilter({
          id: this.modalForm.pre_id,
          mac: this.modalForm.pre_mac,
        }).then(() => {
          editWifiMacFilter(data).then(() => {
            successTips()
            this.getWifiMacFilterList()
          })
        })
      }
    },
    del(row) {
      delWifiMacFilter({
        id: row.id,
        mac: row.mac,
      }).then(() => {
        successTips('trans0410')
        this.getWifiMacFilterList()
      })
    },
    init() {
      if (this.$route.query.mac) {
        if (!this.form.enable) {
          this.$dialog
            .confirm({
              okText: this.$t('trans0019'),
              cancelText: this.$t('trans0020'),
              message: this.$t('trans0940'),
            })
            .then(() => {
              this.form.enable = true
              this.form.mode = FilteringModes.blackList
              this.save().then(() => {
                this.openAddModal()
                this.modalForm.mac = this.$route.query.mac
              })
            })
            .catch(() => {})
          return
        }
        if (this.isBlackList) {
          this.openAddModal()
          this.modalForm.mac = this.$route.query.mac
        } else {
          this.form.mode = FilteringModes.blackList
          this.save().then(() => {
            this.openAddModal()
            this.modalForm.mac = this.$route.query.mac
          })
        }
      }
    },
    changeSsid() {
      if (this.modalForm.mac) {
        this.$refs.macRef.validate()
      }
    },
  },
  async mounted() {
    await this.getSsidIndex()
    await this.getWifiMacFilterList(true)
    await this.getWifiMacFilterStatusData()
  },
}
</script>

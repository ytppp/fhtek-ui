<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0099') }}</h1>
    </div>
    <div class="page__content">
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
    </div>
    <fh-modal v-model="visible" :title="modalTitle" :before-close="handleBeforeClose">
      <template #body>
        <fh-form class="form modal-form" ref="modalForm" :model="modalForm" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0256')" prop="domain">
            <fh-input v-model="modalForm.domain"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0179')" prop="ip">
            <fh-input v-model="modalForm.ip"></fh-input>
          </fh-form-item>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="save" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </fh-form>
      </template>
    </fh-modal>
  </div>
</template>

<script>
import {
  isIP,
  isValidDomain,
  isMulticast,
  isLoopback,
  isNetworkIP,
  isBoardcastIP,
  successTips,
} from '@/util/tool'
import { getStaticDnsList, addStaticDns, editStaticDns, delStaticDns } from '@/http/api'
import { ModalType } from '@/util/constant'

const maxRuleNum = 16
export default {
  data() {
    return {
      maxRuleNum,
      modalType: ModalType.add,
      visible: false,
      // lanIp: '',
      // defaultDomainName: '',
      modalForm: {
        id: '',
        domain: '',
        ip: '',
        index: -1,
      },
      mask: '255.255.255.0',
      modalFormRules: {
        domain: [
          {
            rule: (value) => value.trim(),
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => value.trim().length <= 255 && isValidDomain(value, false),
            message: this.$t('trans0116'),
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
                return item.domain === value
              })
              return flag
            },
            message: this.$t('trans0405'),
          },
          // {
          //   rule: (value) => {
          //     if (this.defaultDomainName && this.defaultDomainName === value) {
          //       return false
          //     }
          //     return true
          //   },
          //   message: this.$t('trans0516'),
          // },
        ],
        ip: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
            message: this.$t('trans0397'),
          },
          {
            rule: (value) => !isNetworkIP(value, this.mask),
            message: this.$t('trans0397'),
          },
          {
            rule: (value) => !isBoardcastIP(value, this.mask),
            message: this.$t('trans0397'),
          },
          // {
          //   rule: (value) => {
          //     if (!this.lanIp) {
          //       return true
          //     }
          //     if (this.lanIp === value) {
          //       return false
          //     }
          //     return true
          //   },
          //   message: this.$t('trans0117'),
          // },
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
                return item.ip === value
              })
              return flag
            },
            message: this.$t('trans0399'),
          },
        ],
      },
      columns: [
        {
          key: 'domain',
          title: this.$t('trans0256'),
        },
        {
          key: 'ip',
          title: this.$t('trans0179'),
        },
      ],
      data: [],
    }
  },
  computed: {
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
    handleBeforeClose() {
      this.$refs.modalForm.clearValidate()
    },
    openAddModal() {
      this.modalForm.id = ''
      this.modalForm.domain = ''
      this.modalForm.ip = ''
      this.modalForm.index = -1
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.id = row.id
      this.modalForm.domain = row.domain
      this.modalForm.ip = row.ip
      this.modalForm.index = row.index
      this.modalType = ModalType.edit
      this.visible = true
    },
    save() {
      if (this.$refs.modalForm.validate()) {
        const data = {}
        if (this.isAdd) {
          data.domain = this.modalForm.domain
          data.ip = this.modalForm.ip
          addStaticDns([data]).then((res) => {
            successTips()
            this.getStaticDnsListData()
          })
        }
        if (this.isEdit) {
          data.id = this.modalForm.id
          data.domain = this.modalForm.domain
          data.ip = this.modalForm.ip
          editStaticDns([data]).then((res) => {
            successTips()
            this.getStaticDnsListData()
          })
        }
      }
    },
    del(row) {
      delStaticDns({ id: row.id }).then((res) => {
        successTips('trans0410')
        this.getStaticDnsListData()
      })
    },
    getStaticDnsDefault() {
      // this.lanIp = ''
      // this.defaultDomainName = ''
      // todo
    },
    getStaticDnsListData() {
      getStaticDnsList()
        .then(({ data }) => {
          const tableData = []
          const { items } = data
          items.forEach((item, i) => {
            tableData.push({
              ...item,
              index: i,
            })
          })
          this.data = tableData
        })
        .catch(() => {})
        .finally(() => {
          this.visible = false
        })
    },
  },
  created() {
    this.getStaticDnsListData()
  },
}
</script>

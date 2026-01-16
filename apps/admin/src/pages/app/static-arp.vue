<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0805') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table :columns="columns" :data-source="data" :show-row-checkbox="false">
          <template #operationgroup>
            <fh-button size="small" v-if="isShowAddBtn" @click="openAddModal">
              {{ $t('trans0164') }}
            </fh-button>
          </template>
          <template #operation="scope">
            <fh-button type="text" @click="openEditModal(scope.row)">
              {{ $t('trans0165') }}
            </fh-button>
            <fh-button type="text" @click="del(scope.row)">
              {{ $t('trans0111') }}
            </fh-button>
          </template>
        </fh-table>
      </div>
    </div>
    <fh-modal v-model="visible" :title="modalTitle" :before-close="handleClose">
      <template #body>
        <fh-form class="form modal-form" ref="modalForm" :model="modalForm" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0140')" prop="interface">
            <fh-select v-model="modalForm.interface" :options="wanOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0179')" prop="ip">
            <fh-input v-model="modalForm.ip"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0097')" prop="mac">
            <fh-input v-model="modalForm.mac"></fh-input>
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
        mac: '',
        ip: '',
        interface: '',
      },
      wanOpts: [],
      mask: '255.255.255.0',
      index: -1,
      modalFormRules: {
        mac: [
          {
            rule: (value) => value.trim(),
            message: this.$t('trans0004'),
          },
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
            rule: (value) =>
              !this.data.some((item) => item.index !== this.index && item.ip === value),
            message: this.$t('trans0399'),
          },
        ],
      },
      columns: [
        {
          key: 'ip',
          title: this.$t('trans0179'),
        },
        {
          key: 'mac',
          title: this.$t('trans0256'),
        },
        {
          key: 'interface',
          title: this.$t('trans0140'),
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
    openAddModal() {
      this.modalForm.id = ''
      this.modalForm.domain = ''
      this.modalForm.ip = ''
      this.index = -1
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.id = row.id
      this.modalForm.domain = row.domain
      this.modalForm.ip = row.ip
      this.index = row.index
      this.modalType = ModalType.edit
      this.visible = true
    },
    handleClose() {
      this.$refs.modalForm.clearValidate()
    },
    save() {
      if (this.$refs.modalForm.validate()) {
        const data = {}
        if (this.isAdd) {
          data.domain = this.modalForm.domain
          data.ip = this.modalForm.ip
          addStaticDns([data]).then((res) => {
            this.getStaticDnsListData()
          })
        }
        if (this.isEdit) {
          data.id = this.modalForm.id
          data.domain = this.modalForm.domain
          data.ip = this.modalForm.ip
          editStaticDns([data]).then((res) => {
            this.getStaticDnsListData()
          })
        }
      }
    },
    del(row) {
      delStaticDns({ id: row.id }).then((res) => {
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

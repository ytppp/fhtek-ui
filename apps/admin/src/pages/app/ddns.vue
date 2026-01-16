<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0245') }}</h1>
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
          <template #enable="scope">
            <fh-switch v-model="scope.row.enable" @change="toggleStatus(scope.row)" />
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
    <fh-modal v-model="visible" :title="modalTitle" :before-close="handleClose">
      <template #body>
        <fh-form class="form modal-form" ref="modalForm" :model="modalForm" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0166')">
            <fh-switch v-model="modalForm.enable" />
          </fh-form-item>
          <fh-form-item :label="$t('trans0140')" prop="interface">
            <fh-select v-model="modalForm.interface" :options="wanList"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0255')">
            <fh-select v-model="modalForm.server" :options="serverList"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0256')" prop="domain">
            <fh-input v-model="modalForm.domain"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0053')" prop="username">
            <fh-input v-model="modalForm.username"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0196')" prop="password">
            <fh-input v-model="modalForm.password" type="password" show-password></fh-input>
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
import { ModalType, ServiceType, WanMode } from '@/util/constant'
import { getWan, getDdns, addDdns, editDdns, delDdns } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { successTips } from '@/util/tool'

const { convertBooleanStatus } = useDataClean()
const maxRuleNum = 1
const servers = [
  'www.no-ip.com',
  'www.dyndns.org',
  'www.justlinux.com',
  'www.dhs.org',
  'www.ods.org',
  'www.gnudip.cheapnet.net',
  'www.tzo.com',
  'www.easydns.com',
]
const serverList = servers.map((val) => ({
  value: val,
  text: val,
}))

export default {
  name: 'DdnsPage',
  data() {
    return {
      maxRuleNum,
      modalType: ModalType.add,
      visible: false,
      modalForm: {
        id: '',
        enable: true,
        server: servers[0],
        domain: '',
        username: '',
        password: '',
        interface: '',
      },
      wanList: [],
      modalFormRules: {
        interface: [
          {
            rule: (value) => value,
            message: this.$t('trans0677').format(this.$t('trans0140')),
          },
        ],
        domain: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
        ],
        username: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
        ],
        password: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
        ],
      },
      serverList: serverList,
      columns: [
        {
          key: 'server',
          title: this.$t('trans0257'),
        },
        {
          key: 'domain',
          title: this.$t('trans0256'),
        },
        {
          key: 'username',
          title: this.$t('trans0053'),
        },
        {
          key: 'enable',
          title: this.$t('trans0166'),
          width: '60',
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
      this.modalForm.enable = true
      this.modalForm.id = ''
      this.modalForm.interface = this.wanList[0]?.value ?? ''
      this.modalForm.domain = ''
      this.modalForm.username = ''
      this.modalForm.password = ''
      this.modalForm.server = servers[0]
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.enable = row.enable
      this.modalForm.id = row.id
      this.modalForm.interface = row.interface
      this.modalForm.domain = row.domain
      this.modalForm.username = row.username
      this.modalForm.password = row.password
      this.modalForm.server = row.server
      this.modalType = ModalType.edit
      this.visible = true
    },
    toggleStatus(row) {
      const data = {
        id: row.id,
        enable: convertBooleanStatus(row.enable),
      }
      editDdns([data]).then(() => {
        this.getDdnsList()
      })
    },
    handleClose() {
      this.$refs.modalForm.clearValidate()
    },
    save() {
      if (this.$refs.modalForm.validate()) {
        const data = {
          enable: convertBooleanStatus(this.modalForm.enable),
          server: this.modalForm.server,
          domain: this.modalForm.domain,
          username: this.modalForm.username,
          password: this.modalForm.password,
          interface: this.modalForm.interface,
        }
        if (this.isAdd) {
          addDdns([data]).then(() => {
            successTips()
            this.getDdnsList()
          })
        }
        if (this.isEdit) {
          data.id = this.modalForm.id
          editDdns([data]).then(() => {
            successTips()
            this.getDdnsList()
          })
        }
      }
    },
    del(row) {
      delDdns({ id: row.id }).then((res) => {
        successTips('trans0410')
        this.getDdnsList()
      })
    },
    getDdnsList() {
      getDdns()
        .then(({ data }) => {
          const tableData = []
          const { items } = data
          items.forEach((item, i) => {
            tableData.push({
              ...item,
              enable: convertBooleanStatus(item.enable),
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
    getWanData() {
      getWan().then(({ data }) => {
        const { items } = data
        const wanList = []
        items.forEach((item) => {
          if (
            (item.serviceType === ServiceType.INTERNET ||
              item.serviceType === ServiceType.TR069_INTERNET) &&
            item.wanMode === WanMode.route
          ) {
            wanList.push({
              value: item.id,
              text: item.wanName,
            })
          }
        })
        this.wanList = wanList
      })
    },
  },
  created() {
    this.getWanData()
    this.getDdnsList()
  },
}
</script>

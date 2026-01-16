<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0422') }}</h1>
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
        <fh-form
          class="form modal-form"
          ref="modalForm"
          :model="modalForm"
          :rules="modalFormRules"
          method="post"
        >
          <fh-form-item :label="$t('trans0166')">
            <fh-switch v-model="modalForm.enable" />
          </fh-form-item>
          <!-- <fh-form-item :label="$t('trans0424')">
            <fh-radio-group v-model="modalForm.mappingMode" @change="changeMappingMode">
              <fh-radio v-for="mode in mappingModes" :key="mode.value" :label="mode.value">
                {{ mode.text }}
              </fh-radio>
            </fh-radio-group>
          </fh-form-item> -->
          <fh-form-item :label="$t('trans0426')" v-if="isTemp">
            <fh-select v-model="modalForm.temp" :options="tempList" @change="changeTempList">
            </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0425')" prop="mappingName">
            <fh-input v-model="modalForm.mappingName"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0135')">
            <fh-select v-model="modalForm.protocol" :options="protocalList"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0446')" prop="extHost">
            <fh-input v-model="modalForm.extHost"></fh-input>
            <template #extra>
              <ul style="list-style: disc">
                <li>{{ $t('trans0958') }}</li>
                <li>{{ placeholderTips }}</li>
              </ul>
            </template>
          </fh-form-item>
          <fh-form-item :label="$t('trans0273')" prop="extPort">
            <fh-input name="ExternalPort" v-model="modalForm.extPort"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0449')" prop="intHost">
            <fh-input name="InternalClient" v-model="modalForm.intHost"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0274')" prop="intPort">
            <fh-input name="InternalPort" v-model="modalForm.intPort"></fh-input>
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
import { ModalType, ProtocolType } from '@/util/constant'
import {
  isValidInteger,
  isValidVal,
  isIP,
  successTips,
  cidrToSubnetMask,
  isMulticast,
  isLoopback,
  format,
  isValidStaticRouteMask,
} from '@/util/tool'
import { getPortMapping, setPortMapping, editPortMapping, delPortMapping } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

const { convertBooleanStatus } = useDataClean()
const maxRuleNum = 8
const MappingMode = {
  customize: 'Customize',
  temp: 'Template',
}
const Temp = [
  {
    name: 'Domain Name Server',
    protocal: ProtocolType.UDP,
    extPort: 53,
  },
  {
    name: 'FTP Server',
    protocal: ProtocolType.TCP,
    extPort: 21,
  },
  {
    name: 'IPSEC',
    protocal: ProtocolType.UDP,
    extPort: 500,
  },
  {
    name: 'Mail POP3',
    protocal: ProtocolType.TCP,
    extPort: 110,
  },
  {
    name: 'Mail SMTP',
    protocal: ProtocolType.TCP,
    extPort: 25,
  },
  {
    name: 'PPTP',
    protocal: ProtocolType.TCP,
    extPort: 1723,
  },
  {
    name: 'Real Player 8 Plus',
    protocal: ProtocolType.UDP,
    extPort: 7070,
  },
  {
    name: 'Secure Shell Server',
    protocal: ProtocolType.TCP,
    extPort: 22,
  },
  {
    name: 'Secure Web Server HTTPS',
    protocal: ProtocolType.TCP,
    extPort: 443,
  },
  {
    name: 'SNMP',
    protocal: ProtocolType.UDP,
    extPort: 161,
  },
  {
    name: 'SNMP Trap',
    protocal: ProtocolType.UDP,
    extPort: 162,
  },
  {
    name: 'Telnet Server',
    protocal: ProtocolType.TCP,
    extPort: 23,
  },
  {
    name: 'TFTP',
    protocal: ProtocolType.UDP,
    extPort: 69,
  },
  {
    name: 'Web Server HTTP',
    protocal: ProtocolType.TCP,
    extPort: 80,
  },
]
const tempList = Temp.map((item) => ({
  value: item.name,
  text: item.name,
}))
export default {
  name: 'PortMappingPage',
  data() {
    return {
      maxRuleNum,
      modalType: ModalType.add,
      visible: false,
      modalForm: {
        enable: true,
        id: '',
        index: -1,
        mappingMode: MappingMode.customize,
        temp: null,
        mappingName: '',
        protocol: ProtocolType.ALL,
        extHost: '',
        extPort: '',
        intHost: '',
        intPort: '',
      },
      modalFormRules: {
        mappingName: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidVal(value, 0, 32),
            message: this.$t('trans0453'),
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
              flag = !!!tempData.find((item) => item.mappingName === value)
              return flag
            },
            message: this.$t('trans0638'),
          },
        ],
        extHost: [
          {
            rule: (value) => {
              if (!value) return true
              const parts = value.split('/')
              if (parts.length !== 2) return false
              const ip = parts[0]
              const suffix = parts[1]
              if (isIP(ip)) {
                const mask = cidrToSubnetMask(parseInt(suffix))
                if (!mask) return false
                if (isMulticast(ip) || isLoopback(ip) || !isValidStaticRouteMask(ip, mask)) {
                  return false
                }
                return true
              }
              return false
            },
            message: this.$t('trans0566').format(this.$t('trans0446')),
          },
        ],
        extPort: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidInteger(value, 1, 65535),
            message: this.$t('trans0452'),
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
              flag = !!!tempData.find((item) => item.extPort == value)
              return flag
            },
            message: this.$t('trans0639'),
          },
        ],
        intHost: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isIP(value),
            message: this.$t('trans0397'),
          },
        ],
        intPort: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidInteger(value, 1, 65535),
            message: this.$t('trans0452'),
          },
        ],
      },
      mappingModes: [
        {
          value: MappingMode.temp,
          text: this.$t('trans0426'),
        },
        {
          value: MappingMode.customize,
          text: this.$t('trans0423'),
        },
      ],
      tempList,
      protocalText: {
        [ProtocolType.TCP]: this.$t('trans0190'),
        [ProtocolType.UDP]: this.$t('trans0191'),
        [ProtocolType.ICMP]: this.$t('trans0192'),
        [ProtocolType.ALL]: this.$t('trans0158'),
      },
      columns: [
        {
          key: 'mappingName',
          title: this.$t('trans0425'),
        },
        {
          key: 'protocolAlias',
          title: this.$t('trans0135'),
        },
        {
          key: 'extHost',
          title: this.$t('trans0446'),
        },
        {
          key: 'extPort',
          title: this.$t('trans0273'),
        },
        {
          key: 'intHost',
          title: this.$t('trans0449'),
        },
        {
          key: 'intPort',
          title: this.$t('trans0274'),
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
    isTemp() {
      return this.modalForm.mappingMode === MappingMode.temp
    },
    protocalList() {
      return [
        {
          text: this.protocalText[ProtocolType.ALL],
          value: ProtocolType.ALL,
        },
        {
          text: this.protocalText[ProtocolType.TCP],
          value: ProtocolType.TCP,
        },
        {
          text: this.protocalText[ProtocolType.UDP],
          value: ProtocolType.UDP,
        },
        // {
        //   value: this.protocalText[ProtocolType.ICMP],
        //   text: this.$t('trans0192'),
        // },
      ]
    },
    placeholderTips() {
      return this.$t('trans0959').format(
        `${format(this.$t('trans0598'), [this.$t('trans0456')])}/${this.$t('trans0459')}`,
      )
    },
  },
  methods: {
    handleClose() {
      this.$refs.modalForm.clearValidate()
    },
    openAddModal() {
      this.modalForm = {
        enable: true,
        id: '',
        index: -1,
        mappingMode: MappingMode.customize,
        temp: null,
        mappingName: '',
        protocol: ProtocolType.ALL,
        extHost: '',
        extPort: '',
        intHost: '',
        intPort: '',
      }
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      const item = Temp.find((temp) => temp.name === row.mappingName)
      this.modalForm = {
        id: row.id,
        enable: row.enable,
        index: row.index,
        extHost: row.extHost,
        extPort: row.extPort,
        intHost: row.intHost,
        intPort: row.intPort,
        mappingName: row.mappingName,
        protocol: row.proto,
        mappingMode: !!item ? MappingMode.temp : MappingMode.customize,
        temp: !!item && item.name,
      }
      this.modalType = ModalType.edit
      this.visible = true
    },
    save() {
      if (this.$refs.modalForm.validate()) {
        const data = {
          src: 'wan', // 传固定值
          dest: 'lan', // 传固定值
          target: 'DNAT', // 传固定值
          name: this.modalForm.mappingName,
          proto: this.modalForm.protocol,
          src_ip: this.modalForm.extHost,
          src_port: this.modalForm.extPort,
          dest_ip: this.modalForm.intHost,
          dest_port: this.modalForm.intPort,
          enable: convertBooleanStatus(this.modalForm.enable),
        }
        if (this.isEdit) {
          data.id = this.modalForm.id
          editPortMapping([data]).then(() => {
            successTips()
            this.getPortMappingData()
          })
        } else {
          setPortMapping([data]).then(() => {
            successTips()
            this.getPortMappingData()
          })
        }
      }
    },
    del(row) {
      delPortMapping({
        id: row.id,
      }).then(() => {
        successTips('trans0410')
        this.getPortMappingData()
      })
    },
    toggleStatus(row) {
      editPortMapping([
        {
          id: row.id,
          enable: convertBooleanStatus(row.enable),
        },
      ])
    },
    changeMappingMode() {
      if (this.isTemp) {
        this.modalForm.temp = Temp[0].name
        this.modalForm.mappingName = Temp[0].name
        this.modalForm.protocol = Temp[0].protocal
        this.modalForm.extPort = Temp[0].extPort
      } else {
        this.modalForm.temp = null
        this.modalForm.mappingName = ''
        this.modalForm.protocol = ProtocolType.TCP
        this.modalForm.extPort = ''
      }
    },
    changeTempList(val) {
      const temp = Temp.find((item) => item.name === val)
      this.modalForm.temp = temp.name
      this.modalForm.mappingName = temp.name
      this.modalForm.protocol = temp.protocal
      this.modalForm.extPort = temp.extPort
      this.$refs.modalForm.clearValidate()
    },
    getPortMappingData(isInit = false) {
      getPortMapping()
        .then(({ data }) => {
          const tableData = []
          const { items } = data
          items.forEach((item, index) => {
            tableData.push({
              ...item,
              index: index,
              mappingName: item.name,
              protocolAlias: this.protocalText[item.proto],
              extHost: item.src_ip,
              extPort: item.src_port,
              intHost: item.dest_ip,
              intPort: item.dest_port,
              enable: convertBooleanStatus(item.enable),
            })
          })
          this.data = tableData
        })
        .catch(() => {})
        .finally(() => {
          if (!isInit) this.visible = false
        })
    },
  },
  mounted() {
    this.getPortMappingData(false)
  },
}
</script>

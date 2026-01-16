<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0059') }}</h1>
    </div>
    <div class="page__content">
      <template v-if="isEnable">
        <!-- <fh-form class="form" ref="form" :model="form">
        <fh-form-item :label="$t('trans0059')">
          <fh-switch v-model="form.enable" @change="switchEnable"></fh-switch>
        </fh-form-item>
      </fh-form> -->
        <div class="page__table">
          <fh-table :columns="columns" :data-source="data" :show-header="isShowAddBtn">
            <template #operationgroup>
              <fh-icon
                class="page__header-icon"
                v-if="isShowAddBtn"
                @click="openAddModal"
                name="icon-add"
                :title="$t('trans0164')"
              />
            </template>
            <template #enabled="scope">
              <fh-switch v-model="scope.row.enabled" @change="toggleStatus(scope.row)" />
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
              ref="modalForm"
              :model="modalForm"
              :rules="modalFormRules"
            >
              <fh-form-item :label="$t('trans0166')">
                <fh-switch v-model="modalForm.enable"></fh-switch>
              </fh-form-item>
              <fh-form-item :label="$t('trans0150')" prop="aclRuleName">
                <fh-input name="AclRuleName" v-model="modalForm.aclRuleName"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0136')" prop="src_ip" ref="srcIpRef">
                <fh-input name="ScrIPAddrBegin" v-model="modalForm.src_ip"></fh-input>
                <template #extra>
                  {{ placeholderTips }}
                </template>
              </fh-form-item>
              <!-- <fh-form-item :label="$t('trans0153')">
            <fh-select
              v-model="modalForm.interface"
              :options="interfaceList"
              name="Interface"
            >
            </fh-select>
          </fh-form-item> -->
              <fh-form-item :label="$t('trans0154')">
                <fh-select
                  v-model="modalForm.application"
                  :options="applicationList"
                  name="Application"
                  @change="changeApplication"
                >
                </fh-select>
              </fh-form-item>
              <fh-form-item class="form__submit-btn">
                <fh-button id="submitbutton" @click="save" block>
                  {{ $t('trans0002') }}
                </fh-button>
              </fh-form-item>
            </fh-form>
          </template>
        </fh-modal>
      </template>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0903') }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  isValidVal,
  isValidName,
  isPrivateIP,
  cidrToSubnetMask,
  isMulticast,
  isLoopback,
  successTips,
  isValidStaticRouteMask,
  isIP,
  isValidIpv6AddrExtra,
  tranSimIpv6ToFullIpv6,
} from '@/util/tool'
import { ModalType, ProtocolType, IP } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'
import { getAcl, addAcl, editAcl, delAcl, getFirewall } from '@/http/api'

const { convertBooleanStatus } = useDataClean()
const Interface = {
  wan: 'wan',
  lan: 'lan',
  both: 'both',
}
const Application = {
  ALL: 'all',
  TELNET: 'telnet',
  WEB: 'web',
  PING: 'ping',
  FTP: 'ftp',
  SNMP: 'snmp',
  SSH: 'ssh',
  FTP: 'ftp',
}
const ApplicationPort = {
  [Application.TELNET]: {
    port: '23',
    proto: ProtocolType.TCP,
  },
  [Application.SSH]: {
    port: '22',
    proto: ProtocolType.TCP,
  },
  [Application.WEB]: {
    port: '80',
    proto: ProtocolType.TCP,
  },
  [Application.PING]: {
    port: '',
    proto: ProtocolType.ICMP,
  },
  [Application.FTP]: {
    port: '21',
    proto: ProtocolType.TCP,
  },
  [Application.ALL]: {
    port: '',
    proto: ProtocolType.ALL,
  },
}
const maxAclRuleNum = 8
export default {
  name: 'AclPage',
  data() {
    return {
      maxAclRuleNum,
      modalType: ModalType.add,
      visible: false, // dialog visible
      form: {
        enable: false,
      },
      lanIp: '',
      modalForm: {
        index: -1,
        id: '',
        src_ip: '',
        enable: true,
        port: ApplicationPort[Application.ALL].port,
        proto: ApplicationPort[Application.ALL].proto,
        aclRuleName: '',
        application: Application.ALL,
      },
      modalFormRules: {
        aclRuleName: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidName(value),
            message: this.$t('trans0167'),
          },
          {
            rule: (value) => isValidVal(value, 1, 32),
            message: this.$t('trans0167'),
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
                return item.name === value
              })
              return flag
            },
            message: this.$t('trans0678').format(this.$t('trans0150')),
          },
        ],
        src_ip: [
          {
            rule: (value) => {
              if (!value) return true
              const parts = value.split('/')
              if (parts.length !== 2) return false
              const ip = parts[0]
              let suffix = parts[1]
              if (isIP(ip, IP.IPv4)) {
                if (isPrivateIP(ip)) {
                  const mask = cidrToSubnetMask(parseInt(suffix))
                  if (!mask) return false
                  // isNetworkIP(ip, mask) || sBoardcastIP(ip, mask)
                  if (isMulticast(ip) || isLoopback(ip) || !isValidStaticRouteMask(ip, mask)) {
                    return false
                  }
                  if (!this.lanIp && this.lanIp === ip) {
                    return false
                  }
                  return true
                }
              }
              if (isIP(ip, IP.IPv6)) {
                const fullIp = tranSimIpv6ToFullIpv6(ip)
                suffix = parseInt(suffix)
                if (
                  isValidIpv6AddrExtra(ip) &&
                  (fullIp !== '2200:3366::1' ||
                    fullIp !== '2200:3366::1/10' ||
                    fullIp !== '2200:3366::1/65') &&
                  suffix >= 16 &&
                  suffix <= 64
                ) {
                  return true
                }
              }
              return false
            },
            message: this.$t('trans0197'),
          },
          {
            rule: (value) => {
              if (!value) return true
              let flag = true
              let tempData = []
              if (this.isAdd) {
                tempData = this.data
              } else {
                tempData = this.data.filter((item) => item.index !== this.modalForm.index)
              }
              flag = !tempData.some((item) => {
                if (this.modalForm.application === Application.ALL) {
                  return item.src_ip === value
                }
                return item.application === this.modalForm.application && item.src_ip === value
              })
              return flag
            },
            message: this.$t('trans0678').format(this.$t('trans0136')),
          },
        ],
      },
      interfaceList: [
        {
          value: Interface.Wan,
          text: this.$t('trans0140'),
        },
        {
          value: Interface.Lan,
          text: this.$t('trans0156'),
        },
        // {
        //   value: Interface.Both,
        //   text: this.$t('trans0157'),
        // },
      ],
      applicationText: {
        [Application.ALL]: this.$t('trans0158'),
        [Application.PING]: this.$t('trans0159'),
        [Application.FTP]: this.$t('trans0160'),
        [Application.WEB]: this.$t('trans0161'),
        [Application.TELNET]: this.$t('trans0162'),
        [Application.SNMP]: this.$t('trans0163'),
        [Application.SSH]: this.$t('trans0402'),
        [Application.FTP]: this.$t('trans0160'),
      },
      columns: [
        {
          key: 'name',
          title: this.$t('trans0150'),
          width: 180,
        },
        {
          key: 'src_ip',
          title: this.$t('trans0136'),
        },
        // {
        //   key: 'interface',
        //   title: this.$t('trans0153'),
        // },
        {
          key: 'applicationAlias',
          title: this.$t('trans0154'),
        },
        {
          key: 'enabled',
          title: this.$t('trans0166'),
          width: '60',
        },
      ],
      data: [],
      isEnable: false,
    }
  },
  computed: {
    isShowAddBtn() {
      return this.data.length < maxAclRuleNum
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
    placeholderTips() {
      return `${this.$t('trans0598').format(this.$t('trans0456'))}/${this.$t('trans0459')} | ${this.$t('trans0598').format(this.$t('trans0457'))}/${this.$t('trans0477')}`
    },
    applicationList() {
      return [
        {
          value: Application.ALL,
          text: this.applicationText[Application.ALL],
        },
        {
          value: Application.PING,
          text: this.applicationText[Application.PING],
        },
        // {
        //   value: Application.FTP,
        //   text: this.applicationText[Application.FTP],
        // },
        {
          value: Application.WEB,
          text: this.applicationText[Application.WEB],
        },
        {
          value: Application.TELNET,
          text: this.applicationText[Application.TELNET],
        },
        {
          value: Application.SSH,
          text: this.applicationText[Application.SSH],
        },
        {
          value: Application.FTP,
          text: this.applicationText[Application.FTP],
        },
        // {
        //   value: Application.SNMP,
        //   text: this.applicationText[Application.SNMP],
        // },
      ]
    },
  },
  methods: {
    // switchEnable(val) {
    // },
    handleClose() {
      this.$refs.modalForm.clearValidate()
    },
    openAddModal() {
      this.modalForm.index = -1
      this.modalForm.id = ''
      this.modalForm.src_ip = ''
      this.modalForm.enable = true
      this.modalForm.port = ApplicationPort[Application.ALL].port
      this.modalForm.proto = ApplicationPort[Application.ALL].proto
      this.modalForm.aclRuleName = ''
      this.modalForm.application = Application.ALL
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.index = row.index
      this.modalForm.id = row.id
      this.modalForm.src_ip = row.src_ip
      this.modalForm.enable = row.enabled
      this.modalForm.port = row.port
      this.modalForm.proto = row.proto
      this.modalForm.aclRuleName = row.name
      this.modalForm.application = row.application
      this.modalType = ModalType.edit
      this.visible = true
    },
    toggleStatus(row) {
      editAcl([
        {
          id: row.id,
          enabled: convertBooleanStatus(row.enabled),
        },
      ]).then(() => {
        this.getAclData()
      })
    },
    changeApplication() {
      this.modalForm.port = ApplicationPort[this.modalForm.application].port
      this.modalForm.proto = ApplicationPort[this.modalForm.application].proto
      this.$refs.srcIpRef.validate()
    },
    del(row) {
      delAcl({
        id: row.id,
      }).then(() => {
        successTips('trans0410')
        this.getAclData()
      })
    },
    save() {
      if (!this.$refs.modalForm.validate()) return
      const data = {
        src: Interface.wan, // 传固定值
        dest: Interface.lan, // 传固定值
        target: 'ACCEPT',
        src_ip: this.modalForm.src_ip,
        enabled: convertBooleanStatus(this.modalForm.enable),
        application: this.modalForm.application,
        port: this.modalForm.port,
        proto: this.modalForm.proto,
        name: this.modalForm.aclRuleName,
      }
      if (this.isAdd) {
        addAcl([data]).then(() => {
          successTips()
          this.getAclData()
        })
      }
      if (this.isEdit) {
        data.id = this.modalForm.id
        editAcl([data]).then(() => {
          successTips()
          this.getAclData()
        })
      }
    },
    getAclData(isInit = false) {
      getAcl()
        .then(({ data }) => {
          const { items } = data
          const tableData = []
          items.forEach((item, i) => {
            tableData.push({
              ...item,
              applicationAlias: this.applicationText[item.application],
              enabled: convertBooleanStatus(item.enabled),
              index: i,
            })
          })
          this.data = tableData
        })
        .catch(() => {})
        .finally(() => {
          if (!isInit) this.visible = false
        })
    },
    getFirewallData() {
      getFirewall().then(({ data }) => {
        const { enable, custom } = data
        this.isEnable = convertBooleanStatus(enable) && convertBooleanStatus(custom)
        if (this.isEnable) {
          this.getAclData(true)
        }
      })
    },
  },
  created() {
    this.getFirewallData()
  },
}
</script>

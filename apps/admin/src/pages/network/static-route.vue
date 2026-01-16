<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0793') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table
          :columns="columns"
          :data-source="diplayData"
          :show-row-checkbox="false"
          :show-header="isShowAddBtn"
        >
          <template #filtergroup>
            <fh-select v-model="display" :options="displayOptions"></fh-select>
          </template>
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
    <fh-modal v-model="visible" :title="modalTitle" :before-close="handleClose">
      <template #body>
        <fh-form class="form modal-form" ref="modalForm" :model="modalForm" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0135')">
            <fh-radio-group v-model="modalForm.type" @change="changeIpType">
              <fh-radio v-for="item in ipOptions" :key="item.value" :label="item.value">
                {{ item.text }}
              </fh-radio>
            </fh-radio-group>
          </fh-form-item>
          <fh-form-item :label="$t('trans0140')" prop="interface">
            <fh-select v-model="modalForm.interface" :options="wanOptions"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0792')" prop="target">
            <fh-input v-model="modalForm.target"></fh-input>
            <template #extra>
              {{ placeholderTips }}
            </template>
          </fh-form-item>
          <fh-form-item :label="$t('trans0656')" prop="gateway">
            <fh-input v-model="modalForm.gateway"></fh-input>
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
  isMulticast,
  isLoopback,
  format,
  cidrToSubnetMask,
  isValidIpv6AddrExtra,
  successTips,
  isValidStaticRouteMask,
} from '@/util/tool'
import {
  getWanInfo,
  getStaticRoute,
  addStaticRoute,
  editStaticRoute,
  delStaticRoute,
} from '@/http/api'
import { ModalType, IP, NetType } from '@/util/constant'

const maxRuleNum = 32
const all = 'all'
export default {
  data() {
    return {
      all,
      maxRuleNum,
      modalType: ModalType.add,
      wanList: [],
      wanText: {},
      visible: false,
      display: all,
      displayOptions: [
        {
          value: all,
          text: this.$t('trans0537'),
        },
        {
          value: IP.IPv4,
          text: this.$t('trans0456'),
        },
        {
          value: IP.IPv6,
          text: this.$t('trans0457'),
        },
      ],
      ipOptions: [
        {
          value: IP.IPv4,
          text: this.$t('trans0456'),
        },
        {
          value: IP.IPv6,
          text: this.$t('trans0457'),
        },
      ],
      modalForm: {
        id: '',
        index: -1,
        type: '',
        type_pre: '',
        target: '',
        gateway: '',
        interface: '',
      },
      lanIp: '',
      modalFormRules: {
        interface: [
          {
            rule: (value) => value,
            message: this.$t('trans0677').format(this.$t('trans0140')),
          },
        ],
        target: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => {
              const parts = value.split('/')
              if (parts.length !== 2) return false
              const ip = parts[0]
              let suffix = parts[1]
              if (!suffix) return false
              if (this.isIpv4 && isIP(ip)) {
                const mask = cidrToSubnetMask(parseInt(suffix))
                if (!mask) return false
                if (isMulticast(ip) || isLoopback(ip) || !isValidStaticRouteMask(ip, mask)) {
                  return false
                }
                if (!this.lanIp && this.lanIp === ip) {
                  return false
                }
                return true
              }
              if (this.isIpv6 && isIP(ip, IP.IPv6)) {
                suffix = parseInt(suffix)
                if (isValidIpv6AddrExtra(ip) && suffix > 0 && suffix <= 128) {
                  return true
                }
              }
              return false
            },
            message: this.$t('trans0566').format(this.$t('trans0792')),
          },
          {
            rule: (value) =>
              !this.data.some(
                (item) => item.index !== this.modalForm.index && item.target === value,
              ),
            message: this.$t('trans0399'),
          },
        ],
        gateway: [
          {
            rule: (value) => {
              if (!value) return true
              if (
                (this.isIpv4 && isIP(value) && !isLoopback(value) && !isMulticast(value)) ||
                (this.isIpv6 && isIP(value, IP.IPv6))
              )
                return true
              return false
            },
            message: this.$t('trans0566').format(this.$t('trans0656')),
          },
          // {
          //   rule: (value) =>
          //     !this.data.some((item) => item.index !== this.modalForm.index && item.gateway === value),
          //   message: this.$t('trans0405'),
          // },
        ],
      },
      columns: [
        {
          key: 'target',
          title: this.$t('trans0792'),
        },
        {
          key: 'gateway',
          title: this.$t('trans0656'),
        },
        {
          key: 'interfaceAlias',
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
    isIpv4() {
      return this.modalForm.type === IP.IPv4
    },
    isIpv6() {
      return this.modalForm.type === IP.IPv6
    },
    wanOptions() {
      return this.wanList.filter((item) => item.type === this.modalForm.type)
    },
    placeholderTips() {
      if (this.isIpv4) {
        return `${format(this.$t('trans0598'), [this.$t('trans0456')])}/${this.$t('trans0459')}`
      }
      if (this.isIpv6) {
        return `${format(this.$t('trans0598'), [this.$t('trans0457')])}/${this.$t('trans0477')}`
      }
    },
    diplayData() {
      if (this.display === all) return this.data
      else if (this.display === IP.IPv4) return this.data.filter((item) => item.type === IP.IPv4)
      else if (this.display === IP.IPv6) return this.data.filter((item) => item.type === IP.IPv6)
    },
  },
  methods: {
    changeIpType() {
      this.modalForm.interface = ''
      this.$refs.modalForm.clearValidate()
    },
    handleClose() {
      this.$refs.modalForm.clearValidate()
    },
    openAddModal() {
      this.modalForm.id = -1
      this.modalForm.type_pre = this.modalForm.type = IP.IPv4
      this.modalForm.target = ''
      this.modalForm.gateway = ''
      this.modalForm.interface = ''
      this.modalForm.index = -1
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.id = row.id
      this.modalForm.type_pre = this.modalForm.type = row.type
      this.modalForm.target = row.target
      this.modalForm.gateway = row.gateway
      this.modalForm.interface = row.interface
      this.modalForm.index = row.index
      this.modalType = ModalType.edit
      this.visible = true
    },
    save() {
      if (this.$refs.modalForm.validate()) {
        const data = {}
        if (this.isIpv4) {
          const parts = this.modalForm.target.split('/')
          data.target = parts[0]
          data.mask = parts[1]
        }
        if (this.isIpv6) {
          data.target = this.modalForm.target
        }
        if (this.isAdd) {
          data.type = this.modalForm.type
          data.gateway = this.modalForm.gateway
          data.interface = this.modalForm.interface
          addStaticRoute(data).then((res) => {
            successTips()
            this.getStaticRouteListData()
          })
        }
        if (this.isEdit) {
          data.type_pre = this.modalForm.type_pre
          data.id = this.modalForm.id
          data.type = this.modalForm.type
          data.gateway = this.modalForm.gateway
          data.interface = this.modalForm.interface
          editStaticRoute(data).then((res) => {
            successTips()
            this.getStaticRouteListData()
          })
        }
      }
    },
    del(row) {
      delStaticRoute({ id: row.id, type: row.type }).then((res) => {
        successTips('trans0410')
        this.getStaticRouteListData()
      })
    },
    getWanData() {
      getWanInfo().then(({ data }) => {
        const { items } = data
        if (items.length === 0) {
          return
        }
        const wanList = []
        const wanText = {}
        items.forEach((item) => {
          if (item.protocol !== NetType.bridge) {
            wanList.push({
              value: item.interface,
              text: item.wanname,
              type:
                item.ipv4.length ||
                item.protocol === NetType.dhcp ||
                item.protocol === NetType.pppoe
                  ? IP.IPv4
                  : item.ipv6.length ||
                      item.protocol === NetType.slaac ||
                      item.protocol === NetType.dhcpv6
                    ? IP.IPv6
                    : '',
            })
            wanText[item.interface] = item.wanname
          }
        })
        this.wanList = wanList
        this.wanText = wanText
        this.getStaticRouteListData()
      })
    },
    getStaticRouteListData() {
      getStaticRoute()
        .then(({ data }) => {
          const tableData = []
          const { items } = data
          items.forEach((item, i) => {
            tableData.push({
              ...item,
              target: item.type === IP.IPv4 ? `${item.target}/${item.mask}` : item.target,
              interfaceAlias: this.wanText[item.interface],
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
    this.getWanData()
  },
}
</script>

<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0131') }}</h1>
    </div>
    <div class="page__content">
      <template v-if="isEnable">
        <!-- <fh-form class="form" ref="form" :model="form">
          <fh-form-item :label="$t('trans0059')">
            <fh-switch v-model="form.enable" @change="switchEnable"></fh-switch>
          </fh-form-item>
        </fh-form> -->
        <div class="page__table">
          <div class="page__sub-header">
            <h2 class="page__title">{{ $t('trans0132') }}</h2>
          </div>
          <fh-table :columns="columns" :data-source="dataUp" :show-header="isShowAddBtnUp">
            <template #operationgroup>
              <fh-icon
                class="page__header-icon"
                v-if="isShowAddBtnUp"
                @click="openAddModalUp"
                name="icon-add"
                :title="$t('trans0164')"
              />
            </template>
            <template #enable="scope">
              <fh-switch v-model="scope.row.enable" @change="toggleStatusUp(scope.row)" />
            </template>
            <template #operation="scope">
              <fh-icon
                class="page__header-icon"
                @click="openEditModalUp(scope.row)"
                name="icon-edit-square"
                :title="$t('trans0165')"
              />
              <fh-icon
                class="page__header-icon"
                @click="delUp(scope.row)"
                name="icon-delete"
                :title="$t('trans0111')"
              />
            </template>
          </fh-table>
          <div class="page__sub-header">
            <h2 class="page__title">{{ $t('trans0133') }}</h2>
          </div>
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
        <fh-modal v-model="visible" :title="modalTitle" :before-close="handleClose">
          <template #body>
            <fh-form class="form modal-form" ref="modalForm" :model="modalForm" :rules="formRules">
              <fh-form-item :label="$t('trans0166')">
                <fh-switch v-model="modalForm.enable"></fh-switch>
              </fh-form-item>
              <fh-form-item :label="$t('trans0150')" prop="name">
                <fh-input name="AclRuleName" v-model="modalForm.name"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0136')" prop="src_ip" ref="srcIpRef">
                <fh-input name="src_ip" v-model="modalForm.src_ip"></fh-input>
                <template #extra>
                  {{ placeholderTips }}
                </template>
              </fh-form-item>
              <fh-form-item :label="$t('trans0138')" prop="dest_ip" ref="destIpRef">
                <fh-input name="dest_ip" v-model="modalForm.dest_ip"></fh-input>
                <template #extra>
                  {{ placeholderTips }}
                </template>
              </fh-form-item>
              <fh-form-item
                :label="$t('trans0139')"
                prop="dest_port"
                ref="destPortRef"
                v-if="showDestPort"
              >
                <fh-input
                  name="dest_port"
                  v-model="modalForm.dest_port"
                  :placeholder="numPlaceholder"
                ></fh-input>
                <template #extra>
                  {{ $t('trans0902').format($t('trans0139')) }}
                </template>
              </fh-form-item>
              <fh-form-item :label="$t('trans0135')">
                <fh-select
                  v-model="modalForm.proto"
                  :options="protoList"
                  name="proto"
                  @change="changeProto"
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
        <fh-modal v-model="visibleUp" :title="modalTitleUp" :before-close="handleCloseUp">
          <template #body>
            <fh-form
              class="form modal-form"
              ref="modalFormUp"
              :model="modalFormUp"
              :rules="formRules"
            >
              <fh-form-item :label="$t('trans0166')">
                <fh-switch v-model="modalFormUp.enable"></fh-switch>
              </fh-form-item>
              <fh-form-item :label="$t('trans0150')" prop="name">
                <fh-input name="AclRuleNameUp" v-model="modalFormUp.name"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0136')" prop="src_ip" ref="srcIpRefUp">
                <fh-input name="src_ipUp" v-model="modalFormUp.src_ip"></fh-input>
                <template #extra>
                  {{ placeholderTips }}
                </template>
              </fh-form-item>
              <fh-form-item :label="$t('trans0138')" prop="dest_ip" ref="destIpRefUp">
                <fh-input name="dest_ipUp" v-model="modalFormUp.dest_ip"></fh-input>
                <template #extra>
                  {{ placeholderTips }}
                </template>
              </fh-form-item>
              <fh-form-item
                :label="$t('trans0139')"
                prop="dest_port"
                ref="destPortRefUp"
                v-if="showDestPortUp"
              >
                <fh-input
                  name="dest_portUp"
                  v-model="modalFormUp.dest_port"
                  :placeholder="numPlaceholder"
                ></fh-input>
                <template #extra>
                  {{ $t('trans0902').format($t('trans0139')) }}
                </template>
              </fh-form-item>
              <fh-form-item :label="$t('trans0135')">
                <fh-select
                  v-model="modalFormUp.proto"
                  :options="protoList"
                  name="protoUp"
                  @change="changeProtoUp"
                >
                </fh-select>
              </fh-form-item>
              <fh-form-item class="form__submit-btn">
                <fh-button id="submitbuttonUp" @click="saveUp" block>
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
  isValidInteger,
  isValidStaticRouteMask,
} from '@/util/tool'
import { ModalType, ProtocolType } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'
import {
  getIpv4Filter,
  addIpv4Filter,
  editIpv4Filter,
  delIpv4Filter,
  getIpv4FilterUp,
  addIpv4FilterUp,
  editIpv4FilterUp,
  delIpv4FilterUp,
  getFirewall,
} from '@/http/api'

const { convertBooleanStatus } = useDataClean()
const Interface = {
  wan: 'wan',
  lan: 'lan',
  both: 'both',
}
const numPlaceholder = '0-65535'
const maxAclRuleNum = 8
export default {
  name: 'Ipv4FilterPage',
  data() {
    return {
      numPlaceholder,
      maxAclRuleNum,
      form: {
        enable: false,
      },
      isEnable: false,
      protoText: {
        [ProtocolType.ALL]: this.$t('trans0158'),
        [ProtocolType.TCP]: this.$t('trans0190'),
        [ProtocolType.UDP]: this.$t('trans0191'),
        [ProtocolType.ICMP]: this.$t('trans0192'),
        [ProtocolType.IGMP]: this.$t('trans0375'),
      },
      showDestPort: false,
      showDestPortUp: false,
      modalType: ModalType.add,
      modalTypeUp: ModalType.add,
      visible: false,
      visibleUp: false,
      modalForm: {
        index: -1,
        id: '',
        src_ip: '',
        dest_ip: '',
        dest_port: '',
        enable: true,
        name: '',
        proto: ProtocolType.ALL,
      },
      modalFormUp: {
        index: -1,
        id: '',
        src_ip: '',
        dest_ip: '',
        dest_port: '',
        enable: true,
        name: '',
        proto: ProtocolType.ALL,
      },
      formRules: {
        name: [
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
        ],
        src_ip: [
          {
            rule: (value) => {
              if (!value) return true
              const parts = value.split('/')
              if (parts.length !== 2) return false
              const ip = parts[0]
              const suffix = parts[1]
              if (isPrivateIP(ip)) {
                const mask = cidrToSubnetMask(parseInt(suffix))
                if (!mask) return false
                if (isMulticast(ip) || isLoopback(ip) || !isValidStaticRouteMask(ip, mask)) {
                  return false
                }
                return true
              }
              return false
            },
            message: this.$t('trans0566').format(this.$t('trans0136')),
          },
        ],
        dest_ip: [
          {
            rule: (value) => {
              if (!value) return true
              const parts = value.split('/')
              if (parts.length !== 2) return false
              const ip = parts[0]
              const suffix = parts[1]
              if (isPrivateIP(ip)) {
                const mask = cidrToSubnetMask(parseInt(suffix))
                if (!mask) return false
                if (isMulticast(ip) || isLoopback(ip) || !isValidStaticRouteMask(ip, mask)) {
                  return false
                }
                return true
              }
              return false
            },
            message: this.$t('trans0566').format(this.$t('trans0138')),
          },
        ],
        dest_port: [
          {
            rule: (value) => {
              if (!value) return true
              const ports = value.split(':')
              if (ports.length > 2) return false
              return ports.every((port) => isValidInteger(port, 0, 65535))
            },
            message: this.$t('trans0566').format(this.$t('trans0139')),
          },
        ],
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
        {
          key: 'dest_ip',
          title: this.$t('trans0138'),
        },
        {
          key: 'dest_port',
          title: this.$t('trans0139'),
        },
        {
          key: 'protoAlias',
          title: this.$t('trans0135'),
        },
        {
          key: 'enable',
          title: this.$t('trans0166'),
          width: '60',
        },
      ],
      data: [],
      dataUp: [],
    }
  },
  computed: {
    isShowAddBtn() {
      return this.data.length < maxAclRuleNum
    },
    isShowAddBtnUp() {
      return this.dataUp.length < maxAclRuleNum
    },
    isAdd() {
      return this.modalType === ModalType.add
    },
    isAddUp() {
      return this.modalTypeUp === ModalType.add
    },
    isEdit() {
      return this.modalType === ModalType.edit
    },
    isEditUp() {
      return this.modalTypeUp === ModalType.edit
    },
    modalTitle() {
      return `${this.isAdd ? this.$t('trans0164') : this.$t('trans0165')} ${this.$t('trans0133')}`
    },
    modalTitleUp() {
      return `${this.isAdd ? this.$t('trans0164') : this.$t('trans0165')} ${this.$t('trans0132')}`
    },
    placeholderTips() {
      return `${this.$t('trans0598').format(this.$t('trans0456'))}/${this.$t('trans0459')}`
    },
    protoList() {
      return [
        {
          value: ProtocolType.ALL,
          text: this.protoText[ProtocolType.ALL],
        },
        {
          value: ProtocolType.TCP,
          text: this.protoText[ProtocolType.TCP],
        },
        {
          value: ProtocolType.UDP,
          text: this.protoText[ProtocolType.UDP],
        },
        {
          value: ProtocolType.ICMP,
          text: this.protoText[ProtocolType.ICMP],
        },
        // {
        //   value: ProtocolType.IGMP,
        //   text: this.protoText[ProtocolType.IGMP],
        // },
      ]
    },
  },
  methods: {
    handleClose() {
      this.$refs.modalForm.clearValidate()
    },
    handleCloseUp() {
      this.$refs.modalFormUp.clearValidate()
    },
    getDefaultModalForm() {
      return {
        index: -1,
        id: '',
        src_ip: '',
        dest_port: '',
        enable: true,
        name: '',
        dest_ip: '',
        proto: ProtocolType.ALL,
      }
    },
    openAddModalCommon(formProp, typeProp, visibleProp) {
      this[formProp] = this.getDefaultModalForm()
      this[formProp === 'modalFormUp' ? 'showDestPortUp' : 'showDestPort'] = true
      this[typeProp] = ModalType.add
      this[visibleProp] = true
    },
    openEditModalCommon(row, formProp, typeProp, visibleProp) {
      const showDestPort = row.proto !== ProtocolType.ICMP
      this[formProp] = {
        index: row.index,
        id: row.id,
        src_ip: row.src_ip,
        dest_ip: row.dest_ip,
        dest_port: row.dest_port,
        enable: row.enable,
        name: row.name,
        proto: row.proto,
      }
      this[formProp === 'modalFormUp' ? 'showDestPortUp' : 'showDestPort'] = showDestPort
      this[typeProp] = ModalType.edit
      this[visibleProp] = true
    },
    openAddModal() {
      this.openAddModalCommon('modalForm', 'modalType', 'visible')
    },
    openAddModalUp() {
      this.openAddModalCommon('modalFormUp', 'modalTypeUp', 'visibleUp')
    },
    openEditModal(row) {
      this.openEditModalCommon(row, 'modalForm', 'modalType', 'visible')
    },
    openEditModalUp(row) {
      this.openEditModalCommon(row, 'modalFormUp', 'modalTypeUp', 'visibleUp')
    },
    toggleStatuCommon(row, apiCall, fetchMethod) {
      apiCall([
        {
          id: row.id,
          enabled: convertBooleanStatus(row.enable),
        },
      ]).then(() => {
        successTips()
        this[fetchMethod]()
      })
    },
    toggleStatus(row) {
      this.toggleStatuCommon(row, editIpv4Filter, 'getIpv4FilterData')
    },
    toggleStatusUp(row) {
      this.toggleStatuCommon(row, editIpv4FilterUp, 'getIpv4FilterDataUp')
    },
    deleteCommon(row, apiCall, fetchMethod) {
      apiCall({
        id: row.id,
      }).then(() => {
        successTips('trans0410')
        this[fetchMethod]()
      })
    },
    del(row) {
      this.deleteCommon(row, delIpv4Filter, 'getIpv4FilterData')
    },
    delUp(row) {
      this.deleteCommon(row, delIpv4FilterUp, 'getIpv4FilterDataUp')
    },
    saveCommon(modalForm, isAdd, isUp) {
      const formRef = isUp ? this.$refs.modalFormUp : this.$refs.modalForm
      if (!formRef.validate()) return

      const data = {
        src: isUp ? Interface.lan : Interface.wan,
        dest: isUp ? Interface.wan : Interface.lan,
        target: 'REJECT',
        src_ip: modalForm.src_ip,
        dest_ip: modalForm.dest_ip,
        dest_port: modalForm.dest_port || '',
        enabled: convertBooleanStatus(modalForm.enable),
        proto: modalForm.proto,
        name: modalForm.name.trim(),
      }

      const currentData = isUp ? this.dataUp : this.data
      const tempData = isAdd
        ? currentData
        : currentData.filter((item) => item.index !== modalForm.index)

      let flag = true
      /*
       * 如果新增是ALL协议
       *  判断与列表项src_ip、dest_ip、dest_port是否完全一致
       * 如果新增不是ALL协议
       *  判断与列表中ALL协议项两者src_ip、dest_ip、dest_port是否完全一致，一致则不允许新增
       *  判断与列表中不是ALL协议项两者proto、src_ip、dest_ip、dest_port是否完全一致，一致则不允许新增
       */
      if (modalForm.proto === ProtocolType.ALL) {
        flag = !tempData.some(
          (item) =>
            modalForm.src_ip === item.src_ip &&
            modalForm.dest_ip === item.dest_ip &&
            modalForm.dest_port === item.dest_port,
        )
      } else {
        flag = !(
          tempData
            .filter((item) => item.proto !== ProtocolType.ALL)
            .some(
              (item) =>
                modalForm.proto === item.proto &&
                modalForm.src_ip === item.src_ip &&
                modalForm.dest_ip === item.dest_ip &&
                modalForm.dest_port === item.dest_port,
            ) ||
          tempData
            .filter((item) => item.proto === ProtocolType.ALL)
            .some(
              (item) =>
                modalForm.src_ip === item.src_ip &&
                modalForm.dest_ip === item.dest_ip &&
                modalForm.dest_port === item.dest_port,
            )
        )
      }

      if (!flag) {
        this.$toast({
          text: this.$t('trans0678').format(this.$t('trans0112')),
          type: 'error',
        })
        return
      }

      let apiCall
      if (isAdd) {
        apiCall = isUp ? addIpv4FilterUp([data]) : addIpv4Filter([data])
      } else {
        data.id = modalForm.id
        apiCall = isUp ? editIpv4FilterUp([data]) : editIpv4Filter([data])
      }

      apiCall.then(() => {
        successTips()
        isUp ? this.getIpv4FilterDataUp() : this.getIpv4FilterData()
      })
    },
    save() {
      this.saveCommon(this.modalForm, this.isAdd, false)
    },
    saveUp() {
      this.saveCommon(this.modalFormUp, this.isAddUp, true)
    },
    fetchIpv4FilterData(apiCall, dataProp, visibleProp, isInit = false) {
      apiCall()
        .then(({ data }) => {
          const { items } = data
          const tableData = items.map((item, i) => ({
            ...item,
            enable: convertBooleanStatus(item.enabled),
            protoAlias: this.protoText[item.proto] || this.$t('trans0158'),
            index: i,
          }))
          this[dataProp] = tableData
        })
        .catch(() => {})
        .finally(() => {
          if (!isInit) this[visibleProp] = false
        })
    },
    getIpv4FilterData(isInit = false) {
      this.fetchIpv4FilterData(getIpv4Filter, 'data', 'visible', isInit)
    },
    getIpv4FilterDataUp(isInit = false) {
      this.fetchIpv4FilterData(getIpv4FilterUp, 'dataUp', 'visibleUp', isInit)
    },
    getFirewallData() {
      getFirewall().then(({ data }) => {
        const { enable, custom } = data
        this.isEnable = convertBooleanStatus(enable) && convertBooleanStatus(custom)
        if (this.isEnable) {
          this.getIpv4FilterData(true)
          this.getIpv4FilterDataUp(true)
        }
      })
    },
    changeProtoCommon(srcIpRef, destPortRef, isUp) {
      const modalForm = isUp ? this.modalFormUp : this.modalForm
      const showDestPort = modalForm.proto !== ProtocolType.ICMP

      if (modalForm.proto === ProtocolType.ICMP) {
        modalForm.dest_port = ''
      } else {
        this.$nextTick(() => {
          this.$refs[srcIpRef].validate()
          this.$refs[destPortRef].validate()
        })
      }
      this[isUp ? 'showDestPortUp' : 'showDestPort'] = showDestPort
    },
    changeProto() {
      this.changeProtoCommon('srcIpRef', 'destPortRef', false)
    },
    changeProtoUp() {
      this.changeProtoCommon('srcIpRefUp', 'destPortRefUp', true)
    },
  },
  created() {
    this.getFirewallData()
  },
}
</script>

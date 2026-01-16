<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0832') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form">
        <fh-form-item :label="$t('trans0832')">
          <fh-switch v-model="form.enable"></fh-switch>
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0104')">
            <fh-radio-group v-model="form.mode" @change="changeFilterMode">
              <fh-radio v-for="mode in filteringModes" :key="mode.value" :label="mode.value">{{
                mode.text
              }}</fh-radio>
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
            <fh-form-item :label="$t('trans0058')" prop="url">
              <fh-input v-model="modalForm.url"> </fh-input>
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
import { isValidDomain, successTips } from '@/util/tool'
import { FilteringModes, ModalType } from '@/util/constant'
import {
  getUrlFilterStatus,
  editUrlFilterStatus,
  getUrlFilterItems,
  addUrlFilterItem,
  editUrlFilterItem,
  delUrlFilterItem,
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
        url: '',
      },
      ssidOpts: [],
      columns: [
        {
          key: 'url',
          title: this.$t('trans0058'),
        },
      ],
      data: [],
      visible: false,
      modalType: ModalType.add,
      modalRules: {
        url: [
          {
            rule: (value) => value.trim(),
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidDomain(value),
            message: this.$t('trans0566').format(this.$t('trans0058')),
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
                return item.url === value
              })
              return flag
            },
            message: this.$t('trans0678').format(this.$t('trans0058')),
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
    getUrlFilterStatusData() {
      getUrlFilterStatus().then(({ data }) => {
        this.form.enable = convertBooleanStatus(data.enable)
        this.form.mode = data.mode
      })
    },
    save() {
      const data = {
        enable: convertBooleanStatus(this.form.enable),
        mode: this.form.mode,
      }
      editUrlFilterStatus(data).then(() => {
        successTips()
      })
    },
    openAddModal() {
      this.modalForm.id = ''
      this.modalForm.url = ''
      this.modalForm.index = -1
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.id = row.id
      this.modalForm.url = row.url
      this.modalForm.index = row.index
      this.modalType = ModalType.edit
      this.visible = true
    },
    getUrlFilterList() {
      getUrlFilterItems()
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
    handleClose() {
      this.$refs.modalFormRef.clearValidate()
    },
    saveItem() {
      if (!this.$refs.modalFormRef.validate()) return
      const data = {
        url: this.modalForm.url,
      }
      if (this.isAdd) {
        addUrlFilterItem(data).then(() => {
          successTips()
          this.getUrlFilterList()
        })
      }
      if (this.isEdit) {
        data.id = this.modalForm.id
        editUrlFilterItem(data).then(() => {
          successTips()
          this.getUrlFilterList()
        })
      }
    },
    del(row) {
      const data = {
        id: row.id,
      }
      delUrlFilterItem(data).then(() => {
        successTips('trans0410')
        this.getUrlFilterList()
      })
    },
  },
  mounted() {
    this.getUrlFilterStatusData()
    this.getUrlFilterList()
  },
}
</script>

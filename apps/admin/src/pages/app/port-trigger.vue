<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0427') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table :columns="columns" :data-source="getPortTrigger_list">
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
              @click="deleteOperator(scope.row)"
              name="icon-delete"
              :title="$t('trans0111')"
            />
          </template>
        </fh-table>
      </div>
      <fh-modal v-model="visible" :title="modalTitle" :before-close="handleClose">
        <template #body>
          <fh-form
            class="form"
            ref="portTrigerform"
            :rules="portTriggerRules"
            :model="portTrigerform"
          >
            <fh-form-item :label="$t('trans0429')">
              <fh-switch
                v-model="portTrigerform.enable"
                @change="(val) => portTrigerformEnable(val)"
              >
              </fh-switch>
            </fh-form-item>
            <fh-form-item :label="$t('trans0430')">
              <fh-select
                v-model="portTrigerform.triggerProtocol"
                :options="ProtocalList"
                name="TriggerProtocol"
              ></fh-select>
            </fh-form-item>
            <fh-form-item :label="$t('trans0431')">
              <fh-select
                v-model="portTrigerform.openProtocol"
                :options="ProtocalList"
                name="OpenProtocol"
              ></fh-select>
            </fh-form-item>
            <fh-form-item :label="$t('trans0432')" prop="startTriggerPort">
              <fh-input
                name="StartTriggerPort"
                v-model:number="portTrigerform.startTriggerPort"
              ></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0433')" prop="endTriggerPort">
              <fh-input
                name="EndTriggerPort"
                v-model:number="portTrigerform.endTriggerPort"
              ></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0434')" prop="startOpenPort">
              <fh-input
                name="StartOpenPort"
                v-model:number="portTrigerform.startOpenPort"
              ></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0434')" prop="endOpenPort">
              <fh-input name="EndOpenPort" v-model:number="portTrigerform.endOpenPort"></fh-input>
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
  </div>
</template>

<script>
const ProtocolType = {
  TCP: 'TCP',
  UDP: 'UDP',
  ALL: 'TCP/UDP',
}
const maxNum = 16
export default {
  name: 'PortTrigger',
  data() {
    return {
      portTrigerform: {
        enable: true,
        WanInterface_Ifname: '',
        triggerProtocol: ProtocolType.TCP,
        openProtocol: ProtocolType.TCP,
        startTriggerPort: '',
        endTriggerPort: '',
        startOpenPort: '',
      },
      portTriggerRules: {
        triggerProtocol: [
          {
            rule: (value) => value,
            message: this.$t('trans0052').format(this.$t('trans0430')),
          },
        ],
        openProtocol: [
          {
            rule: (value) => value,
            message: this.$t('trans0052').format(this.$t('trans0431')),
          },
        ],
        startTriggerPort: [
          {
            rule: (value) => value,
            message: this.$t('trans0052').format(this.$t('trans0432')),
          },
          {
            rule: (value) => isValidInteger(value),
            message: this.$t('trans0437'),
          },
          {
            rule: (value) => isValidPort(value, 1, 65535),
            message: this.$t('trans0437'),
          },
        ],
        endTriggerPort: [
          {
            rule: (value) => value,
            message: this.$t('trans0052').format(this.$t('trans0433')),
          },
          {
            rule: (value) => isValidInteger(value),
            message: this.$t('trans0437'),
          },
          {
            rule: (value) => isValidPort(value, 1, 65535),
            message: this.$t('trans0437'),
          },
          {
            rule: (value) => {
              if (parseInt(this.portTrigerform.startTriggerPort) > parseInt(value)) {
                return false
              } else {
                return true
              }
            },
            message: this.$t('trans0438'),
          },
        ],
        startOpenPort: [
          {
            rule: (value) => value,
            message: this.$t('trans0052').format(this.$t('trans0434')),
          },
          {
            rule: (value) => isValidInteger(value),
            message: this.$t('trans0437'),
          },
          {
            rule: (value) => isValidPort(value, 1, 65535),
            message: this.$t('trans0437'),
          },
        ],
        endOpenPort: [
          {
            rule: (value) => value,
            message: this.$t('trans0052').format(this.$t('trans0434')),
          },
          {
            rule: (value) => isValidInteger(value),
            message: this.$t('trans0437'),
          },
          {
            rule: (value) => isValidPort(value, 1, 65535),
            message: this.$t('trans0437'),
          },
          {
            rule: (value) => {
              if (parseInt(this.portTrigerform.startOpenPort) > parseInt(value)) {
                return false
              } else {
                return true
              }
            },
            message: this.$t('trans0444'),
          },
        ],
      },
      getPortTrigger_list: [],
      columns: [
        {
          key: 'portTriggerPro',
          title: this.$t('trans0430'),
        },
        {
          key: 'portOpenPro',
          title: this.$t('trans0431'),
        },
        {
          key: 'portStartTriggerPort',
          title: this.$t('trans0432'),
        },
        {
          key: 'portStopTriggerPort',
          title: this.$t('trans0433'),
        },
        {
          key: 'portStartOpenPort',
          title: this.$t('trans0434'),
        },
        {
          key: 'portEndOpenPort',
          title: this.$t('trans0435'),
        },
        {
          key: 'portstatus',
          title: this.$t('trans0429'),
        },
      ],
      data: [],
      indexList: [],
      ProtocalList: [
        { text: this.$t('trans0190'), value: ProtocolType.TCP },
        { text: this.$t('trans0191'), value: ProtocolType.UDP },
        { text: this.$t('trans0189'), value: ProtocolType.ALL },
      ],
    }
  },
  methods: {
    handleClose() {
      this.$refs.portTrigerform.clearValidate()
    },
    save() {
      // todo
    }
  },
}
</script>

<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0246') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form">
        <fh-form-item :label="$t('trans0246')">
          <fh-switch v-model="form.enable" @change="switchEnable"></fh-switch>
        </fh-form-item>
      </fh-form>
      <div class="page__table">
        <fh-table :columns="columns" :data-source="data" :show-row-checkbox="false" />
      </div>
    </div>
  </div>
</template>

<script>
import { getUpnpConfig, setUpnpConfig, getUpnpList } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { successTips } from '@/util/tool'

const { convertBooleanStatus } = useDataClean()
export default {
  data() {
    return {
      maxRuleNum: 32,
      form: {
        enable: false,
      },
      columns: [
        {
          key: 'description',
          title: this.$t('trans0272'),
        },
        {
          key: 'protocol',
          title: this.$t('trans0135'),
        },
        {
          key: 'extPort',
          title: this.$t('trans0273'),
        },
        {
          key: 'intPort',
          title: this.$t('trans0274'),
        },
        {
          key: 'ip',
          title: this.$t('trans0179'),
        },
        {
          key: 'statusAlias',
          title: this.$t('trans0166'),
        },
      ],
      data: [],
    }
  },
  methods: {
    switchEnable() {
      setUpnpConfig({
        enable: convertBooleanStatus(this.form.enable),
      }).then(() => {
        successTips()
      })
    },
    getUpnpConfigData() {
      getUpnpConfig().then(({ data }) => {
        this.form.enable = convertBooleanStatus(data.enable)
      })
    },
    getUpnpListData() {
      getUpnpList().then(({ data }) => {
        const { items } = data
        const newItems = items.map((item) => {
          return {
            ...item,
            statusAlias: convertBooleanStatus(item.status)
              ? this.$t('trans0103')
              : this.$t('trans0054'),
          }
        })
        this.data = newItems
      })
    },
  },
  mounted() {
    this.getUpnpConfigData()
    this.getUpnpListData()
  },
}
</script>

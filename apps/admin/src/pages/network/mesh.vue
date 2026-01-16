<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0568') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0568') }}</h2>
      </div>
      <fh-form class="form form--padding" :model="form">
        <fh-form-item :label="$t('trans0641')">
          <fh-switch v-model="form.enable" />
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0835')">
            <fh-switch v-model="form.enableSteering" />
            <template #extra>
              {{ $t('trans0890') }}
            </template>
          </fh-form-item>
          <fh-form-item :label="$t('trans0569')">
            <div>{{ roleText }}</div>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item class="form__submit-btn" v-if="enableIninial">
          <fh-button @click="trigger" block>
            {{ $t('trans0574') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item>
          <div class="mesh-tip-btn">
            <fh-button type="text" @click="visible = true">
              {{ $t('trans0061') }}
            </fh-button>
          </div>
        </fh-form-item>
        <fh-form-item>
          <fh-alert type="info" :title="meshTip" show-icon :center="false" />
        </fh-form-item>
      </fh-form>
      <fh-modal class="mesh-tip-modal" v-model="visible" width="50%">
        <template #body>
          <h2>{{ $t('trans0026') }}</h2>
          <h3>{{ $t('trans0113') }}</h3>
          <p>{{ $t('trans0114') }}</p>
          <p>{{ $t('trans0130') }}</p>
          <h3>{{ $t('trans0148') }}</h3>
          <p>{{ $t('trans0149') }}</p>
          <p>{{ $t('trans0216') }}</p>
          <h3>{{ $t('trans0230') }}</h3>
          <p>{{ $t('trans0258') }}</p>
          <p>{{ $t('trans0390') }}</p>
        </template>
      </fh-modal>
      <template v-if="enableIninial">
        <div class="page__sub-header">
          <h2 class="page__title">{{ $t('trans0120') }}</h2>
        </div>
        <div id="topo" class="echarts"></div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import { genData, MediumTypeText, DeviceRoleText } from '@/util/topo'
import { getMesh, setMesh, triggerMesh, getTopology, getMeshStatus } from '@/http/api'
import { MeshRole } from '@/util/constant'
import { successTips } from '@/util/tool'
import { useDataClean } from '@/hooks/data-clean'
import { useCountDown } from '@/hooks/countdown'
import { useAppStore } from '@/stores/modules/app-store'

defineOptions({
  name: 'MeshPage',
})

const appStore = useAppStore()
const { t } = useI18n()
const { convertBooleanStatus, defaultVal } = useDataClean()
const loading = inject('loading')
const timeout = -1
const meshStatusTimeout = 2 * 60 * 1000
const interval = 30 * 1000
const meshStatusInterval = 5 * 1000
const onboarding = '1'
const visible = ref<boolean>(false)
const roles = [
  // {
  //   value: MeshRole.auto,
  //   text: t('trans0571'),
  // },
  {
    value: MeshRole.controller,
    text: t('trans0572'),
  },
  {
    value: MeshRole.agent,
    text: t('trans0573'),
  },
]
const chart = ref(null)
const enableIninial = ref(false)
const form = reactive({
  enable: false,
  enableSteering: false,
  role: MeshRole.controller,
})

const roleText = computed(() => {
  return roles.find((item) => item.value === form.role).text
})
const meshTip = computed(() => {
  return t('trans0960')
})
const getTopoData = () => {
  getTopology().then(({ data }) => {
    const { items } = data
    drawTopo(items)
  })
}
const getMeshStatusData = (fn: (done: boolean) => void) => {
  getMeshStatus().then(({ data }) => {
    const { done } = data
    fn(convertBooleanStatus(done) as boolean)
  })
}
const doingMeshStatusHandle = () => {
  getMeshStatusData((done) => {
    if (done) {
      cleanMeshStatusCountDown()
    }
  })
}
const startMeshStatus = () => {
  loading.open({
    tip: t('trans0576'),
  })
  createMeshStatusCountDown()
}
const doneMeshStatusHandle = () => {
  loading.close()
  getMeshData()
}
const { createCountDown: createMeshStatusCountDown, cleanCountDown: cleanMeshStatusCountDown } =
  useCountDown(meshStatusTimeout, meshStatusInterval, doingMeshStatusHandle, doneMeshStatusHandle)
const save = () => {
  const enable = convertBooleanStatus(form.enable)
  const steering = convertBooleanStatus(form.enableSteering)
  setMesh({
    enable,
    steering,
  }).then(() => {
    successTips()
    if (appStore.isWifiV7) {
      startMeshStatus()
    } else if (appStore.isWifiV6) {
      getTopoData()
    }
  })
}
const trigger = () => {
  triggerMesh({
    onboarding,
  })
}
const initChart = () => {
  const topoEl = document.getElementById('topo')
  chart.value = echarts.init(topoEl)
  window.addEventListener('resize', () => {
    chart.value && chart.value.resize()
  })
}
const drawTopo = (routers) => {
  const data = genData(routers, chart.value, true)
  if (!data) {
    return
  }
  const option = {
    tooltip: {
      trigger: 'item',
      padding: [20],
      confine: true,
      backgroundColor: '#fff',
      extraCssText: 'box-shadow:-3px 8px 22px 0px rgba(223,226,239,1);border-radius:4px;',
      textStyle: {
        color: '#333',
      },
      formatter: (params) => {
        const data = params.data
        if (!data.name) return
        const str = []
        str.push('<div class="popup-info">')
        const strFormatter = (str) => {
          return str || defaultVal
        }
        const tagBuilder = (value, cls) => {
          const content = value instanceof Array ? value.join('') : value
          return `<div class="${cls}">${content}</div>`
        }
        const rowBuilder = (label, content) => {
          return tagBuilder(
            [tagBuilder(label, 'popup-info__label'), tagBuilder(content, 'popup-info__value')],
            'popup-info__row',
          )
        }
        str.push(
          tagBuilder(tagBuilder(`${data.originName}`, 'popup-info__title'), 'popup-info__row'),
        )
        str.push(rowBuilder(`${t('trans0570')}:`, strFormatter(t(DeviceRoleText[data.nodeType]))))
        str.push(rowBuilder(`${t('trans0097')}:`, strFormatter(data.name)))
        str.push('</div>')
        return str.join('')
      },
    },
    series: [
      {
        type: 'graph',
        roam: 'move',
        edgeSymbol: ['circle', 'circle'],
        edgeSymbolSize: 3,
        // focusNodeAdjacency: true, 鼠标覆盖高亮显示节点及关系名称
        cursor: 'pointer',
        layout: 'force',
        force: {
          repulsion: 2000,
          edgeLength: 200,
          layoutAnimation: false,
        },
        emphasis: {
          scale: false,
        },
        edgeLabel: {
          show: true,
          formatter: (series) => {
            let format = ''
            const { type, rssi } = series.data
            format = `{a|${t(MediumTypeText[type])}} `
            // if (rssi) { // 不显示 rssi
            //   format += `{b|${rssi}}`
            // }
            return format
          },
          rich: {
            a: {
              color: '#000',
              backgroundColor: '#fff',
            },
            b: {
              width: 20,
              height: 16,
              color: '#fff',
              fontSize: 10,
              align: 'center',
              borderRadius: 3,
              backgroundColor: '#000',
            },
          },
        },
        label: {
          show: true,
          position: 'bottom',
          color: '#333',
          backgroundColor: '#fff',
          formatter(category) {
            const { name, stationsCount } = category.data
            let format = ''
            // mac 地址不格式化处理
            // let nameFormatted = '';
            // const splitor = ' ';
            // if (name.includes(splitor)) {
            //   const sp = name.split(splitor);
            //   let index = 1;
            //   let start = sp[0];
            //   while ((start + sp[index]).length < 10 && index < sp.length) {
            //     start += ` ${sp[index]}`;
            //     index += 1;
            //   }
            //   const end = sp.slice(index).join(splitor);
            //   nameFormatted = `${start}\n${end}`;
            // }
            // nameFormatted = name.match(/.{1,10}/g).join('\n');
            // format = `{a|${nameFormatted}} `;
            format = `{a|${name}} `
            if (stationsCount) {
              format += `{b|${stationsCount}}`
            }
            return format
          },
          rich: {
            a: {
              color: '#000',
              backgroundColor: '#fff',
            },
            b: {
              width: 20,
              height: 16,
              color: '#fff',
              fontSize: 10,
              align: 'center',
              borderRadius: 3,
              backgroundColor: '#999',
            },
          },
        },
        data: data.nodes,
        links: data.lines,
        lineStyle: { width: 2 },
      },
    ],
  }
  chart.value.setOption(option, true)
}
const getMeshData = () => {
  cleanCountDown()
  getMesh().then(({ data }) => {
    enableIninial.value = form.enable = convertBooleanStatus(data.enable)
    form.role = data.role
    form.enableSteering = convertBooleanStatus(data.steering)
    if (enableIninial.value) {
      nextTick(() => {
        initChart()
        createCountDown()
      })
    }
  })
}
const doingHandle = () => {
  getTopoData()
}
const { createCountDown, cleanCountDown } = useCountDown(timeout, interval, doingHandle)
onMounted(() => {
  if (appStore.isWifiV7) {
    getMeshStatusData((done) => {
      if (!done) {
        startMeshStatus()
      } else {
        getMeshData()
      }
    })
  } else if (appStore.isWifiV6) {
    getTopoData()
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {
    chart.value && chart.value.resize()
  })
})
</script>

<style lang="less">
.echarts {
  margin-top: 20px;
  width: 100%;
  height: 600px;
  border: 1px solid #c9c9c9;
}
.mesh-tip-btn {
  text-align: center;
}
.mesh-tip-modal {
  h2,
  h3,
  p {
    margin: 0;
    padding: 0;
  }
  h2,
  h3 {
    font-weight: 500;
  }
  h2 {
    font-size: 30px;
    text-align: center;
  }
  h3 {
    font-size: 24px;
    padding: 20px 0;
  }
  p {
    font-size: 18px;
    padding: 8px 0;
  }
}
.popup-info {
  .popup-info__row {
    display: flex;
    & + .popup-info__row {
      margin-top: 10px;
    }
  }
  .popup-info__label {
    color: #333;
    font-size: 14px;
    line-height: 1.2;
    font-weight: bold;
    width: 150px;
    white-space: normal;
  }
  .popup-info__title {
    width: 100%;
    color: #c0c4cc;
    font-size: 12px;
    display: flex;
    position: relative;
    margin-top: 10px;
    &::after {
      content: '';
      margin-left: 10px;
      flex: 1;
      display: block;
      height: 1px;
      background: #ebeef5;
      position: relative;
      margin-top: -1px;
      top: 50%;
    }
  }
  .popup-info__value {
  }
}
</style>

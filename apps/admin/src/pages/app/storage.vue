<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0810') }}</h1>
    </div>
    <div class="page__content">
      <template v-if="hasUsbDevice">
        <div class="page__sub-header">
          <h2 class="page__title">{{ $t('trans0811') }}</h2>
        </div>
        <fh-form
          class="form form--padding"
          ref="clientFormRef"
          :model="clientForm"
          :rules="clientFormRules"
        >
          <fh-form-item :label="$t('trans0812')" prop="url">
            <fh-input v-model="clientForm.url">
              <template v-slot:prepend>{{ UrlAppend }}</template>
            </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0754')" prop="port">
            <fh-input v-model="clientForm.port"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0053')" prop="username">
            <fh-input v-model="clientForm.username"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0196')" prop="password">
            <fh-input v-model="clientForm.password" type="password" show-password></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0814')" prop="path">
            <fh-input v-model="clientForm.path"></fh-input>
            <template #extra>
              <ul style="list-style: disc">
                <li>{{ $t('trans0818') }}</li>
                <li>{{ $t('trans0855') }}</li>
              </ul>
            </template>
          </fh-form-item>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="download" block>
              {{ $t('trans0820') }}
            </fh-button>
          </fh-form-item>
        </fh-form>
        <div class="page__table">
          <fh-table :columns="columns" :data-source="tableData" :show-row-checkbox="false">
            <template #url="scope">
              <fh-popover :title="scope.row.url">
                <div class="ellipsis" style="width: 100px">{{ scope.row.url }}</div>
              </fh-popover>
            </template>
            <template #path="scope">
              <fh-popover :title="scope.row.path">
                <div class="ellipsis" style="width: 100px">{{ scope.row.path }}</div>
              </fh-popover>
            </template>
          </fh-table>
        </div>
        <div class="page__sub-header">
          <h2 class="page__title">{{ $t('trans0815') }}</h2>
        </div>
        <fh-form
          class="form form--padding"
          ref="serverFormRef"
          :model="serverForm"
          :rules="serverFormRules"
        >
          <fh-form-item :label="t('trans0816')">
            <fh-switch v-model="serverForm.enable" />
          </fh-form-item>
          <template v-if="serverForm.enable">
            <fh-form-item :label="$t('trans0053')" prop="username">
              <fh-input v-model="serverForm.username"></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0196')" prop="password">
              <fh-input v-model="serverForm.password" type="password" show-password></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0754')" prop="port">
              <fh-input v-model="serverForm.port"></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0825')" prop="rootPath">
              <fh-input v-model="serverForm.rootPath"></fh-input>
              <template #extra>
                <ul style="list-style: disc">
                  <li>{{ $t('trans0819') }}</li>
                  <li>{{ $t('trans0855') }}</li>
                </ul>
              </template>
            </fh-form-item>
          </template>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="save" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </fh-form>
      </template>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0821') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  isValidInteger,
  isValidSymbol,
  isValidUnixPath,
  format,
  specialChar,
  successTips,
  invalidChar,
  isInvalidSymbol,
} from '@/util/tool'
import { getUsb, usbDownload, editUsbServer, getUsbDownloadList, getUsbServer } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

enum DownloadStatus {
  done = '0',
  failed = '2',
  doing = '1',
  init = '3',
}
const { t } = useI18n()
const UrlAppend = 'ftp://'
const DownloadStatusText = {
  [DownloadStatus.done]: t('trans0748'),
  [DownloadStatus.failed]: t('trans0750'),
  [DownloadStatus.doing]: t('trans0765'),
}
const { convertBooleanStatus } = useDataClean()
const clientFormRef = ref(null)
const serverFormRef = ref(null)
const hasUsbDevice = ref(false)
const clientForm = reactive({
  url: '',
  port: '',
  username: '',
  password: '',
  path: '',
})
const serverForm = reactive({
  enable: false,
  username: '',
  password: '',
  port: '',
  rootPath: '',
})
const clientFormRules = {
  url: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  port: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 1, 65535),
      message: t('trans0452'),
    },
  ],
  username: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0053'), format(t('trans0042'), [specialChar])]),
    },
  ],
  password: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0196'), format(t('trans0042'), [specialChar])]),
    },
  ],
  path: [
    {
      rule: (value) => {
        if (!value) return true
        return !isInvalidSymbol(value)
      },
      message: t('trans0957').format(t('trans0814'), invalidChar),
    },
    {
      rule: (value) => {
        if (!value) return true
        return isValidUnixPath(value)
      },
      message: t('trans0830'),
    },
  ],
}
const serverFormRules = {
  port: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 1, 65535),
      message: t('trans0452'),
    },
  ],
  username: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0053'), format(t('trans0042'), [specialChar])]),
    },
  ],
  password: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0196'), format(t('trans0042'), [specialChar])]),
    },
  ],
  rootPath: [
    {
      rule: (value) => {
        if (!value) return true
        return !isInvalidSymbol(value)
      },
      message: t('trans0957').format(t('trans0825'), invalidChar),
    },
    {
      rule: (value) => {
        if (!value) return true
        return isValidUnixPath(value)
      },
      message: t('trans0830'),
    },
  ],
}
const columns = reactive([
  {
    key: 'username',
    title: t('trans0053'),
  },
  // {
  //   key: 'password',
  //   title: t('trans0196'),
  // },
  {
    key: 'port',
    title: t('trans0754'),
  },
  {
    key: 'url',
    title: t('trans0812'),
  },
  {
    key: 'path',
    title: t('trans0814'),
  },
  {
    key: 'statusAilas',
    title: t('trans0166'),
  },
])
const tableData = reactive([])

const getUsbInfo = () => {
  getUsb().then(({ data }) => {
    hasUsbDevice.value = convertBooleanStatus(data.has_usb)
    if (hasUsbDevice.value) {
      getDownloadList()
      getUsbServerData()
    }
  })
}

const download = () => {
  if (!clientFormRef.value.validate()) return
  const data = {
    url: `${UrlAppend}${clientForm.url}`,
    port: clientForm.port,
    username: clientForm.username,
    password: clientForm.password,
    path: clientForm.path,
    status: DownloadStatus.init,
  }
  usbDownload([data]).then(() => {
    successTips()
    getDownloadList()
  })
}
const save = () => {
  if (!serverFormRef.value.validate()) return
  const data = {
    enable: convertBooleanStatus(serverForm.enable),
    port: serverForm.port,
    username: serverForm.username,
    password: serverForm.password,
    root_path: serverForm.rootPath,
  }
  editUsbServer(data).then(() => {
    successTips()
  })
}

const getUsbServerData = () => {
  getUsbServer().then(({ data }) => {
    serverForm.enable = convertBooleanStatus(data.enable)
    serverForm.username = data.username
    serverForm.password = data.password
    serverForm.port = data.port
    serverForm.rootPath = data.root_path
  })
}

const getDownloadList = () => {
  getUsbDownloadList().then(({ data }) => {
    const { items } = data
    const table = []
    items.forEach((item, i) => {
      table.push({
        ...item,
        index: i,
        statusAilas: DownloadStatusText[item.status],
      })
    })
    tableData.splice(0, tableData.length, ...table)
    if (tableData.length) {
      const index = tableData.length - 1
      clientForm.url = tableData[index].url.substring(UrlAppend.length)
      clientForm.port = tableData[index].port
      clientForm.username = tableData[index].username
      clientForm.password = tableData[index].password
      clientForm.path = tableData[index].path
    }
  })
}

onMounted(() => {
  getUsbInfo()
})
</script>

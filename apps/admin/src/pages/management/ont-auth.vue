<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0780') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0714')">
          <fh-select v-model="form.authType" :options="authModeOpts"> </fh-select>
        </fh-form-item>
        <template v-if="isLoid">
          <fh-form-item :label="$t('trans0781')" prop="loid.loid">
            <fh-input v-model="form.loid.loid"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0768')" prop="loid.checkCode">
            <fh-input v-model="form.loid.checkCode"> </fh-input>
          </fh-form-item>
        </template>
        <template v-if="isPassword">
          <fh-form-item :label="$t('trans0541')" prop="password.sn">
            <fh-input v-model="form.password.sn"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0196')" prop="password.password">
            <fh-input v-model="form.password.password"> </fh-input>
            <template #extra>
              {{ $t('trans0913') }}
            </template>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isValidLength, format, isValidSymbol, successTips, isHexadecimal } from '@/util/tool'
import { getOntAuth, editOntAuth } from '@/http/api'

enum AuthMode {
  loid = 'LOID',
  password = 'sn',
}
const specialChar = '!#+-.=?@_~'
const ruleReg = /^[\w!#+\-.=?@_~]+$/i
const { t } = useI18n()
const authModeOpts = [
  {
    value: AuthMode.loid,
    text: t('trans0781'),
  },
  {
    value: AuthMode.password,
    text: t('trans0541'),
  },
]
const formRef = ref(null)
const form = reactive({
  authType: AuthMode.loid,
  loid: {
    loid: '',
    checkCode: '',
  },
  password: {
    password: '',
    sn: '',
  },
})
function getLastCharsByIndex(str: string, index: number) {
  if (typeof str !== 'string') {
    return ''
  }
  return str.slice(-index)
}
const rules = {
  'loid.loid': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 1, 24),
      message: format(t('trans0003'), [t('trans0781'), 1, 24]),
    },
    {
      rule: (value) => isValidSymbol(value, ruleReg),
      message: t('trans0013').format(t('trans0781'), t('trans0042').format(specialChar)),
    },
  ],
  'loid.checkCode': [
    {
      rule: (value) => {
        if (!value) return true
        return isValidLength(value, 1, 12)
      },
      message: format(t('trans0003'), [t('trans0768'), 1, 12]),
    },
    {
      rule: (value) => {
        if (!value) return true
        return isValidSymbol(value, ruleReg)
      },
      message: t('trans0013').format(t('trans0768'), t('trans0042').format(specialChar)),
    },
  ],
  'password.password': [
    {
      rule: (value) => {
        if (!value) return true
        return isValidLength(value, 1, 10)
      },
      message: format(t('trans0003'), [t('trans0196'), 1, 10]),
    },
    {
      rule: (value) => {
        if (!value) return true
        return isValidSymbol(value, ruleReg)
      },
      message: format(t('trans0013'), [t('trans0196'), format(t('trans0042'), [specialChar])]),
    },
  ],
  'password.sn': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => value.length === 12 && isHexadecimal(getLastCharsByIndex(value, 8)),
      message: format(t('trans0769'), [t('trans0541'), 12, 8]),
    },
  ],
}
const isLoid = computed(() => form.authType === AuthMode.loid)
const isPassword = computed(() => form.authType === AuthMode.password)

const getOntAuthData = () => {
  getOntAuth().then((res) => {
    const { data } = res
    form.authType = data.auth_type
    form.loid.loid = data.loid.loid
    form.loid.checkCode = data.loid.checkcode
    form.password.password = data.sn.password
    form.password.sn = data.sn.sn
  })
}

const save = () => {
  if (formRef.value.validate()) {
    const data = {
      auth_type: form.authType,
      loid: {
        loid: form.loid.loid,
        checkcode: form.loid.checkCode,
      },
      sn: {
        password: form.password.password,
        sn: form.password.sn,
      },
    }
    editOntAuth(data).then(() => {
      successTips()
    })
  }
}

onMounted(() => {
  getOntAuthData()
})
</script>

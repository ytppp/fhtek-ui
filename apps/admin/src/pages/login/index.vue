<template>
  <div class="signin">
    <div class="signin-form">
      <div style="text-align: center">
        <img class="signin-form__img" :src="logoSrc" alt="" />
      </div>
      <fh-form
        label-position="top"
        ref="formRef"
        :disabled="formDisabled"
        :model="userinfo"
        :rules="rules"
      >
        <fh-form-item prop="username" :cancel-blur-validate="true">
          <fh-input :placeholder="$t('trans0621')" v-model="userinfo.username" clearable>
            <template #prefix>
              <fh-icon name="icon-user" class="input__icon"></fh-icon>
            </template>
          </fh-input>
        </fh-form-item>
        <fh-form-item prop="password" :cancel-blur-validate="true">
          <fh-input
            type="password"
            :placeholder="$t('trans0622')"
            v-model="userinfo.password"
            show-password
          >
            <template #prefix>
              <fh-icon name="icon-lock" class="input__icon"></fh-icon>
            </template>
          </fh-input>
        </fh-form-item>
        <fh-form-item class="signin-form__action">
          <fh-button block @click="doLogin" :plain="false">{{ $t('trans0616') }}</fh-button>
        </fh-form-item>
        <fh-form-item v-show="alert">
          <fh-alert :title="alert" type="error"> </fh-alert>
        </fh-form-item>
      </fh-form>
      <div class="signin__forget">
        <fh-button type="text" @click="() => toggleModalVisible(true)">
          {{ $t('trans0623') }}
        </fh-button>
      </div>
      <fh-modal class="signin-modal" v-model="visible" width="25%">
        <template #body>
          <h2 class="signin-modal__title">{{ $t('trans0624') }}</h2>
          <p class="signin-modal__content">{{ $t('trans0625') }}</p>
        </template>
        <template #footer>
          <div class="signin-modal__action">
            <fh-button type="text" @click="() => toggleModalVisible(false)">
              {{ $t('trans0626') }}
            </fh-button>
          </div>
        </template>
      </fh-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getPublicFile,
  isValidLength,
  isValidSymbol,
  getStringByte,
  specialChar,
  successTips,
} from '@/util/tool'
import { Role, customers } from '@/util/constant'
import { login } from '@/http/api'
import { ResultEnum } from '@/http/config'
import { router } from '@/router/index'
import { useSessionStorage } from '@/hooks/session-storage'
import { useCountDown } from '@/hooks/countdown'
import { useAppStore } from '@/stores/modules/app-store'

const logoSrc = getPublicFile(__APP_CUSTOMER_CONFIG__.logo)

const { t } = useI18n()
const formRef = ref(null)
const visible = ref(false)
const alert = ref('')
const formDisabled = ref(false)
const appStore = useAppStore()
const userinfo = reactive({
  username: '',
  password: '',
})
const rules = reactive({
  username: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => getStringByte(value) <= 64,
      message: t('trans0005').format(t('trans0053')),
    },
  ],
  password: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 1, 64),
      message: t('trans0003').format(t('trans0196'), 1, 64),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: t('trans0013').format(t('trans0196'), t('trans0042').format(specialChar)),
    },
  ],
})

const footerInfo = computed(() => {
  return `&copy;&nbsp;${t('trans0009')}&nbsp;${t('trans0008')}`
})

const {
  value: login3TimesUser,
  setValue: setDelayTime,
  removeItem: clearDelayTime,
} = useSessionStorage('login3TimesUser', { username: '', time: 0 })

const toggleModalVisible = (val) => {
  visible.value = val
}
const clearValidate = () => {
  formRef.value.clearValidate()
}
const doLogin = () => {
  if (formRef.value.validate()) {
    formDisabled.value = true
    login(userinfo)
      .then(({ data }) => {
        switch (__APP_CUSTOMER_CONFIG__.name) {
          case customers.demo:
          case customers.fhtek:
            appStore.setRole(Role.super)
            break
          case customers.totalplay:
            appStore.setRole(data.role as Role)
            break
          default:
            appStore.setRole(Role.super)
            break
        }
        appStore.setLoggedUser(userinfo.username)
        router.push('/home')
      })
      .catch((err) => {
        if (err.code === ResultEnum.LOGIN_3_TIMES_FAILED) {
          setDelayTime({ username: userinfo.username, time: 60 })
          filt_lock_time()
        } else {
          formDisabled.value = false
        }
      })
  }
}
const onKeyDown = (e, el, fn) => {
  if (typeof fn !== 'function') {
    return
  }
  let key = 0
  if (window.event) {
    key = window.event.keyCode
  } else if (e) {
    key = e.which
  }
  if (key == 13 && document.activeElement.id != el) {
    fn()
  }
}
const filt_lock_time = () => {
  createCountDown()
}
const doingHandle = () => {
  const login3TimesUsername = login3TimesUser.value.username
  let login3TimesTime = login3TimesUser.value.time
  alert.value = t('trans0010').format(login3TimesTime)
  if (--login3TimesTime > -1) {
    userinfo.username = login3TimesUsername
    formDisabled.value = true
    setDelayTime({ username: login3TimesUsername, time: login3TimesTime })
  } else {
    clearDelayTime()
    cleanCountDown()
    formDisabled.value = false
    alert.value = ''
  }
}
const { createCountDown, cleanCountDown } = useCountDown(-1, 1000, doingHandle)

onMounted(() => {
  document.onkeypress = (e) => onKeyDown(e, 'loginbutton', doLogin)
  if (login3TimesUser.value.time > 0) {
    filt_lock_time()
  }
})
</script>

<style lang="less">
.signin {
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    margin-top: 20%;
  }
  .signin-form {
    width: 350px;
    padding: 25px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.075);
    .signin-form__img {
      display: inline-block;
      width: 200px;
    }
    .signin-form__action {
      .form-item__content {
        flex-direction: column;
      }
    }
    .input,
    .btn {
      max-width: 100% !important;
    }
    @media screen and (max-width: 768px) {
      border: none;
      box-shadow: none;
      padding: 0;
    }
  }
  .signin__forget {
    width: 100%;
    text-align: right;
    margin-top: 5px;
  }
}
.signin-modal {
  .signin-modal__title {
    text-align: center;
    font-size: 22px;
  }
  .signin-modal__content {
    margin: 0;
    padding: 0;
    margin-top: 30px;
    font-size: 16px;
  }
  .signin-modal__action {
    width: 100%;
    text-align: right;
  }
}
</style>
@/http/v1.index.js

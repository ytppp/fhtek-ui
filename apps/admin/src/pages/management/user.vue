<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0184') }}</h1>
    </div>
    <div class="page__content">
      <fh-form ref="form" class="form" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0053')">
          <fh-select v-model="form.role" :options="roleOpts" @change="changeRole"> </fh-select>
        </fh-form-item>
        <!-- <fh-form-item :label="$t('trans0053')" prop="username">
          <fh-input v-model="form.username"> </fh-input>
        </fh-form-item> -->
        <fh-form-item :label="$t('trans0185')" prop="pwd">
          <fh-input v-model="form.pwd" type="password" show-password @blur="changePwd"> </fh-input>
        </fh-form-item>
        <fh-form-item ref="confirmPwd" :label="$t('trans0186')" prop="confirmPwd">
          <fh-input v-model="form.confirmPwd" type="password" show-password> </fh-input>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button block @click="save">
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { isValidLength, isValidSymbol, specialChar, handleLogout, successTips } from '@/util/tool'
import { getAccount, setAccount } from '@/http/api'
import { useAppStore } from '@/stores/modules/app-store'

export default {
  data() {
    return {
      usernameStoraged: '',
      form: {
        id: '',
        role: '',
        username: '',
        pwd: '',
        confirmPwd: '',
      },
      rules: {
        pwd: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidLength(value, 1, 64),
            message: this.$t('trans0003').format(this.$t('trans0185'), 1, 64),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: this.$t('trans0013').format(
              this.$t('trans0185'),
              this.$t('trans0042').format(specialChar),
            ),
          },
        ],
        confirmPwd: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidLength(value, 1, 64),
            message: this.$t('trans0003').format(this.$t('trans0186'), 1, 64),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: this.$t('trans0013').format(
              this.$t('trans0186'),
              this.$t('trans0042').format(specialChar),
            ),
          },
          {
            rule: () => this.validatePwd(),
            message: this.$t('trans0195'),
          },
        ],
      },
      roleOpts: [],
      userList: [],
    }
  },
  computed: {
    ...mapStores(useAppStore),
  },
  created() {
    this.form.username = this.usernameStoraged = this.appStore.loggedUser
    this.form.role = this.appStore.role
  },
  mounted() {
    this.getAccountData()
  },
  methods: {
    changePwd() {
      if (this.$refs.confirmPwd && this.form.confirmPwd) {
        this.$refs.confirmPwd.extraValidate(this.validatePwd, this.$t('trans0195'))
      }
    },
    validatePwd() {
      if (this.form.pwd) {
        return this.form.pwd === this.form.confirmPwd
      }
      return true
    },
    save() {
      if (this.$refs.form.validate()) {
        const data = [
          {
            id: this.form.id,
            name: this.form.username,
            pwd: this.form.pwd,
            role: this.form.role,
          },
        ]
        setAccount(data).then(() => {
          successTips()
          if (this.form.username === this.usernameStoraged) {
            handleLogout()
          }
        })
      }
    },
    getAccountData() {
      const data = {
        role: this.form.role,
      }
      getAccount(data).then(({ data }) => {
        const { items } = data
        if (items.length === 0) {
          return
        }
        const roleOpts = items.map((item) => ({
          value: item.name,
          text: item.role,
        }))
        this.roleOpts = roleOpts
        this.userList = items
        this.changeRole()
      })
    },
    changeRole() {
      const thisUser = this.userList.find((item) => item.role === this.form.role)
      this.form.id = thisUser.id
      this.form.username = thisUser.name
      this.form.role = thisUser.role
    },
  },
}
</script>

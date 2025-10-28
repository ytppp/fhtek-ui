<template>
  <div class="footer">
    <span class="copy">{{ copyright }}</span>
    <!-- <span class="policy-text"
          @click.stop="showPolicy()">
      {{$t('trans0139')}}
    </span> -->
    <!-- <fh-modal v-model="show">
      <template #title>
        <div class="dialog-title">{{ $t('trans0139') }}</div>
      </template>
      <template #body>
        <div class="dialog-content">
          <div style="height:100%;padding:20px 0;font-size:0;"
               v-html="policy"></div>
        </div>
      </template>
      <template #footer>
        <div class="button-container">
          <button class="btn btn-dialog-confirm"
                  @click="close()">
            {{ $t('trans0024') }}
          </button>
        </div>
      </template>
    </fh-modal> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'FhFotter',
})

const show = ref(false)
const { t } = useI18n()

const policy = computed(() => {
  // return require('./policy-en.html');
  return ''
})
const copyright = computed(() => {
  return `${t('trans0009')} ${t('trans0008')}`
})

const showPolicy = () => {
  console.log('showPolicy')
}
const close = () => {
  show.value = false
}
</script>

<style lang="less">
.footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  padding: 15px;
  text-align: center;
  font-size: 18px;
  background: @footer-background-color;
  @media screen and (max-width: 768px) {
    padding: 10px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    .copy {
      display: block;
      padding: 5px;
      margin-left: 0;
    }
  }
}
</style>

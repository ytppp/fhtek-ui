<template>
  <svg @click="click" @mouseover="hover" @mouseout="out" class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
    <title>{{ title }}</title>
  </svg>
</template>

<script lang="ts" setup>
import { computed, ref, withDefaults } from 'vue'
import './iconfont'

defineOptions({
  name: 'FhIcon',
})

export interface IIconProps {
  name: string
  hoverName?: string
  title?: string
}

export interface IIconEmits {
  (e: 'click', mouseEvent: MouseEvent): void // or click: [mouseEvent: MouseEvent]
}

const props = withDefaults(defineProps<IIconProps>(), {
  name: '',
  hoverName: '',
  title: '',
})

const isHover = ref(false)

const emit = defineEmits<IIconEmits>()

const iconName = computed(() => `#${isHover.value ? props.hoverName : props.name}`)

const click = (e: MouseEvent) => {
  emit('click', e)
}
const hover = () => {
  if (!props.hoverName) {
    return
  }
  isHover.value = true
}
const out = () => {
  if (!props.hoverName) {
    return
  }
  isHover.value = false
}
</script>

<style>
@import '../style/base.less';
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
  + .svg-icon {
    margin-left: 5px;
  }
}
</style>

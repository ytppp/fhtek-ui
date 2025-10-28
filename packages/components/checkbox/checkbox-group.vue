<template>
  <div class="checkbox-group" :class="`is-${direction}`">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { provide, ref, withDefaults, watch, type Ref } from 'vue'
import type { ICheckboxGroupContext, ICheckboxGroupEmits, ICheckboxGroupProps } from './interface'
import { CheckboxGroupContextKey } from './interface'

defineOptions({
  name: 'FhCheckboxGroup',
})

const props = withDefaults(defineProps<ICheckboxGroupProps>(), {
  modelValue: () => [],
  circle: false,
  direction: 'horizontal',
  disabled: false,
})

const emit = defineEmits<ICheckboxGroupEmits>()

const checkedValues: Ref<(boolean | string | number)[]> = ref([...props.modelValue])

const handleChange = (value: boolean | string | number) => {
  const index = checkedValues.value.indexOf(value)
  if (index === -1) {
    checkedValues.value.push(value)
  } else {
    checkedValues.value.splice(index, 1)
  }
  const newValue = [...checkedValues.value]
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const checkboxGroupContext: ICheckboxGroupContext = {
  modelValue: checkedValues,
  circle: props.circle,
  direction: props.direction,
  disabled: props.disabled,
  handleChange,
}

provide(CheckboxGroupContextKey, checkboxGroupContext)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      checkedValues.value = [...newVal]
    } else {
      checkedValues.value = []
    }
  },
  { deep: true },
)
</script>

<style lang="less">
.checkbox-group {
  display: flex;
  &.is-vertical {
    flex-direction: column;
    .checkbox {
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  &.is-horizontal {
    flex-wrap: wrap;
    .checkbox {
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
</style>

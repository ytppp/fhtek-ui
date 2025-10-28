<template>
  <label
    class="radio"
    :class="{
      'is-selected': model === label,
      'is-disabled': isDisabled,
    }"
  >
    <span
      class="radio__input"
      :class="{
        'is-selected': model === label,
        'is-disabled': isDisabled,
      }"
    >
      <span class="radio__inner"></span>
      <input
        ref="radio"
        class="radio__original"
        :value="label"
        type="radio"
        v-model="model"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
        autocomplete="off"
      />
    </span>
    <span class="radio__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script>
export default {
  name: 'FhRadio',
  inject: {
    form: {
      default: '',
    },
    formItem: {
      default: '',
    },
    radioGroup: {
      default: '',
    },
  },
  props: {
    value: {},
    label: {},
    disabled: {
      type: Boolean,
      default: false,
    },
    name: String,
  },
  computed: {
    isDisabled() {
      return this.isGroup
        ? this.radioGroup.disabled.value || this.disabled || this.form?.disabled.value
        : this.disabled || this.form?.disabled.value
    },
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'FhRadioGroup') {
          parent = parent.$parent
        } else {
          return true
        }
      }
      return false
    },
    model: {
      get() {
        return this.isGroup ? this.radioGroup.model.value : this.value
      },
      set(val) {
        if (this.isGroup) {
          this.radioGroup.handleInput(val)
        } else {
          this.$emit('input', val)
        }
        this.$refs.radio && (this.$refs.radio.checked = this.model === this.label)
      },
    },
  },
  emits: ['change', 'input'],
  methods: {
    handleChange() {
      this.$nextTick(() => {
        const value = this.label
        if (this.isGroup) {
          this.radioGroup.updateModel(value)
        } else {
          this.$emit('change', value)
        }
      })
    },
  },
}
</script>

<style lang="less">
.radio {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  font-size: 14px;
  user-select: none;
  &.is-selected {
    .radio__inner {
      border-color: @radio-item-selected-color;
      position: relative;
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        background: @radio-item-selected-color;
        border-radius: 50%;
      }
    }
  }
  &.is-disabled {
    .radio__inner {
      border-color: #e4e7ed;
      cursor: not-allowed;
      &::after {
        cursor: not-allowed;
        background-color: #f5f7fa;
      }
    }
    .radio__input {
      &.is-selected {
        .radio__inner {
          border-color: #e4e7ed;
          &::after {
            background-color: #c0c4cc;
          }
        }
      }
    }
    .radio__label {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
  .radio__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
  }
  .radio__inner {
    cursor: pointer;
    display: inline-block;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    border-radius: 9px;
    border: 1px solid @radio-item-color;
  }
  .radio__original {
    opacity: 0;
    outline: none;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
  }
  .radio__label {
    padding-left: 12px;
    font-size: 14px;
  }
}
</style>

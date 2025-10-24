<template>
  <form>
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
defineOptions({
  name: 'FhForm',
})
</script>

<style lang="less">
@import '../style/base.less';
</style>

<template>
  <div>
    <!--
      :is-show-child-menu="false" -->
    <fh-menu
      :menus="menus"
      :active="url"
      mode="vertical"
      :is-enlarge-font-size="true"
      background-color="#474747"
      text-color="#fff"
      active-text-color="#fff"
      active-background-color="#D6001C"
    ></fh-menu>
    <fh-menu
      style="margin-top: 20px"
      :menus="menus"
      :active="url"
      mode="horizontal"
      :is-enlarge-font-size="true"
      background-color="#474747"
      text-color="#fff"
      active-text-color="#fff"
      active-background-color="#D6001C"
    ></fh-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({
  name: 'FhMenuDemo',
})

const menus = ref([
  {
    label: '首页',
    key: '/',
  },
  {
    label: '帮助',
    key: '/help',
  },
  {
    label: '表单',
    key: '/form',
    children: [
      {
        label: '表单1',
        key: '/form1',
      },
      {
        label: '表单2',
        key: '/form2',
      },
    ],
  },
  {
    label: '菜单',
    key: '/menu',
    children: [
      {
        label: '菜单1',
        key: '/menu1',
      },
      {
        label: '菜单2',
        key: '/menu2',
      },
    ],
  },
])
const url = ref('/form2')
</script>

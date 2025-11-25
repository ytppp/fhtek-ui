<template>
  <div style="width: 600px">
    <fh-table
      :columns="columns"
      :data-source="tableData"
      showIndex
      showPagination
      showSearch
      showRowCheckbox
    >
      <template #title> 标题 </template>
      <template #operationgroup>
        <fh-button size="small">新增</fh-button>
        <fh-button size="small" @click="del">删除</fh-button>
      </template>
      <template #url="scope">
        <fh-popover :title="scope.row.url" trigger="click">{{ scope.row.url }}</fh-popover>
      </template>
      <template #enable="scope">
        <fh-switch v-model="scope.row.enable" @change="toggleStatus(scope.row)" />
      </template>
      <template #operation="scope">
        <fh-button type="text" @click="() => operation(scope)">操作</fh-button>
        <fh-button type="text" @click="() => operation(scope)">操作</fh-button>
        <fh-button type="text" @click="() => operation(scope)">操作</fh-button>
        <fh-button type="text" @click="() => operation(scope)">操作</fh-button>
      </template>
      <template #footer> footer </template>
    </fh-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineOptions({
  name: 'FhTableDemo',
})

interface ITableData {
  url: string
  url2: string
  url3: string
  url4: string
  name: string
  enable: boolean
}
const tableData = ref<ITableData[]>([
  {
    url: 'www.apple.com',
    url2: 'www.apple.com',
    url3: 'www.apple.com',
    url4: 'www.apple.com',
    name: '苹果',
    enable: true,
  },
  {
    url: 'www.baidu.com',
    url2: 'www.baidu.com',
    url3: 'www.baidu.com',
    url4: 'www.baidu.com',
    name: '百度',
    enable: false,
  },
  {
    url: 'www.geogle.com',
    url2: 'www.geogle.com',
    url3: 'www.geogle.com',
    url4: 'www.geogle.com',
    name: '谷歌',
    enable: true,
  },
])
const columns = [
  {
    key: 'url',
    title: 'url',
  },
  {
    key: 'url2',
    title: 'url2',
    fixed: 'left',
  },
  {
    key: 'url3',
    title: 'url3',
  },
  {
    key: 'url4',
    title: 'url4',
  },
  {
    key: 'name',
    title: 'name',
  },
  {
    key: 'enable',
    title: 'enable',
    fixed: 'right',
  },
]
const del = () => {}
const operation = (scope: ITableData) => {
  console.log(scope)
}
const toggleStatus = (row: ITableData) => {
  console.log(row)
}
</script>

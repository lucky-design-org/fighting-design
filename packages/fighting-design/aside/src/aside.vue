<script lang="ts" setup name="FAside">
  import { Props } from './props'
  import { useList } from '../../_hooks'

  const prop = defineProps(Props)

  const { styles } = useList(prop, 'aside')

  /** 样式列表 */
  const styleList = styles(['width', 'padding'])
</script>

<template>
  <aside class="f-aside" :style="styleList">
    <slot />
  </aside>
</template>

<script lang="ts" setup name="FTree">
  import { Props } from './props'
  import { FSvgIcon } from '../../svg-icon'
  import { FIconChevronRightVue } from '../../_svg'
  import { useTreeData } from '../../_hooks'
  import type { FormatTreeData } from '../../_hooks'

  const prop = defineProps(Props)

  const { getItem, treeData, flatTreeData } = useTreeData(prop.data as unknown as FormatTreeData)

  /**
   * 点击展开或关闭
   *
   * @param item 每一项
   */
  const handleClick = (item: FormatTreeData): void => {
    getItem(treeData.value, item.id as number)
  }
</script>

<template>
  <div class="f-tree">
    <div v-for="(item, index) in flatTreeData" :key="index" class="f-tree__data">
      <div
        v-show="item.show"
        class="f-tree__label"
        :style="{ paddingLeft: 30 * (item.level - 1) + 5 + 'px' }"
        @click="handleClick(item)"
      >
        <f-svg-icon
          v-if="item.isChild"
          :class="{ 'f-tree__icon-animation': item.open }"
          :size="17"
          :icon="FIconChevronRightVue"
        />

        {{ item.label }}
      </div>
    </div>
  </div>
</template>

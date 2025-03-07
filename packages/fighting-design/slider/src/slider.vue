<script lang="ts" setup name="FSlider">
  import { Props } from './props'
  import { computed, onMounted, ref } from 'vue'
  import { isNumber } from '../../_utils'
  import { useList } from '../../_hooks'
  import { FTooltip } from '../../tooltip'
  import dragDirective from './drag'
  import { EMIT_UPDATE } from '../../_tokens'
  import type { Ref } from 'vue'

  const prop = defineProps(Props)
  const emit = defineEmits({
    [EMIT_UPDATE]: (val: number): boolean => isNumber(val)
  })

  const { styles, classes } = useList(prop, 'slider')

  /** 自定义指令 */
  const vDrag = dragDirective

  /** dom 元素 */
  const sliderEl: Ref<HTMLDivElement | null> = ref(null)

  /** 便宜距离 */
  const rightTx = ref<number>(0)

  /** 宽度 */
  const sliderWidth = computed((): number => {
    return parseInt((sliderEl.value as HTMLDivElement).offsetWidth + '')
  })

  onMounted((): void => {
    const { min, max, modelValue } = prop

    if (typeof modelValue !== 'number' || isNaN(modelValue) || modelValue < min) {
      emit(EMIT_UPDATE, min)
      return
    }

    if (modelValue > max) {
      emit(EMIT_UPDATE, max)
      return
    }

    setPosition(((modelValue - min) * 100) / (max - min))
  })

  /** 类名列表 */
  const classList = classes(['disabled'], 'f-slider')

  /** 样式列表 */
  const styleList = styles(['bgColor'])

  const setPosition = (dot: number): void => {
    const { min, max, step } = prop

    if (dot < 0) {
      dot = 0
    } else if (dot > 100) {
      dot = 100
    }

    const lengthPerStep = 100 / ((max - min) / step)
    const steps = Math.round(dot / lengthPerStep)
    let value = steps * lengthPerStep * (max - min) * 0.01 + min

    value = parseFloat(value.toFixed(0))

    emit(EMIT_UPDATE, value)
    rightTx.value = (sliderWidth.value * (value - min)) / (max - min)
  }

  const onRightDrag = (options: { x: number }): void => {
    if (prop.disabled) return
    const { x } = options
    const percentDot = (x * 100) / sliderWidth.value
    setPosition(percentDot)
  }
</script>

<template>
  <div ref="sliderEl" class="f-slider" :class="classList" :style="styleList">
    <div class="f-slider__selected" :style="`width: ${rightTx}px`" />
    <div
      v-drag="onRightDrag"
      class="f-slider__right__icon f-slider__icon"
      :style="`transform: translateX(${rightTx}px)`"
    >
      <f-tooltip :content="modelValue.toString()" position="top" state="always">
        <div style="height: 25px" />
      </f-tooltip>
    </div>
  </div>
</template>

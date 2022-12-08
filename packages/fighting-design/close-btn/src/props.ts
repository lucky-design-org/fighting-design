import type { ExtractPropTypes, PropType, VNode, Component } from 'vue'
import type { HandleMouseEvent } from '../../_interface'

export const Props = {
  /**
   * 自定义尺寸
   */
  size: {
    type: [String, Number] as PropType<string | number>,
    default: (): null => null
  },
  /**
   * 是否为圆角的
   */
  round: {
    type: Boolean,
    default: (): boolean => false
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: (): boolean => false
  },
  /**
   * 自定义颜色
   */
  color: {
    type: String,
    default: (): null => null
  },
  /**
   * 自定义 icon
   */
  icon: {
    type: Object as PropType<VNode | Component>,
    default: (): null => null
  },
  /**
   * 点击之后执行的回调
   */
  onClick: {
    type: Function as PropType<HandleMouseEvent>,
    default: (): null => null
  }
} as const

export type CloseBtnProps = ExtractPropTypes<typeof Props>

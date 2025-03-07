import { setBooleanProp, setStringProp, setNumberProp, setObjectProp } from '../../_utils'
import { FIGHTING_TYPE } from '../../_tokens'
import type { VNode, PropType, ExtractPropTypes } from 'vue'
import type { NotificationPlacement } from './interface'
import type { FightingType, FightingIcon } from '../../_interface'

export const Props = {
  /** id 唯一值 */
  id: setStringProp(),
  /** 通知标题 */
  title: {
    type: [String, Object] as PropType<VNode | string>,
    default: (): null => null
  },
  /** 通知文本 */
  message: {
    type: [String, Object] as PropType<VNode | string>,
    default: (): null => null,
    required: true
  },
  /**
   * 消息类型
   *
   * @values default primary success danger warning
   * @defaultValue default
   */
  type: setStringProp<FightingType>('default', (val: FightingType): boolean => {
    return FIGHTING_TYPE.includes(val)
  }),
  /** 是否可关闭 */
  close: setBooleanProp(),
  /** 显示时间，单位为毫秒。 设为 0 则不会自动关闭 */
  duration: setNumberProp(3000),
  /** 是否为圆角类型 */
  round: setBooleanProp(),
  /** 是否显示按钮 */
  showIcon: setBooleanProp(true),
  /** 自定义前缀 icon */
  icon: setObjectProp<FightingIcon>(),
  /** 自定义字体颜色 */
  color: setStringProp(),
  /** 自定义背景色 */
  background: setStringProp(),
  /** 偏移距离 */
  offset: setNumberProp(20),
  /**
   * 弹出位置
   *
   * @values top-left top-right bottom-left bottom-right
   * @defaultValue top-right
   */
  placement: setStringProp<NotificationPlacement>('top-right', (val: NotificationPlacement): boolean => {
    return (['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).includes(val)
  }),
  /** 层级 */
  zIndex: setNumberProp(1000),
  /** 自定义关闭按钮 */
  closeBtn: {
    type: [String, Object] as PropType<VNode | string>,
    default: (): null => null
  },
  /** 关闭之后回调 */
  onClose: {
    type: Function,
    default: (): null => null
  }
} as const

export type NotificationProps = ExtractPropTypes<typeof Props>

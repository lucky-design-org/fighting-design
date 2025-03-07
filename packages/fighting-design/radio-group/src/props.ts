import {
  setBooleanProp,
  setStringNumberProp,
  setStringProp,
  setFunctionProp
} from '../../_utils'
import { FIGHTING_SIZE } from '../../_tokens'
import type { ExtractPropTypes, PropType, InjectionKey } from 'vue'
import type { RadioModelValue, RadioChange } from './interface'
import type { FightingSize } from '../../_interface'

export const Props = {
  /** 绑定值 */
  modelValue: {
    type: [String, Number, Boolean] as PropType<RadioModelValue>,
    default: (): null => null
  },
  /** 是否禁用 */
  disabled: setBooleanProp(),
  /** 是否纵向排列 */
  vertical: setBooleanProp(),
  /** 横向排列的间距 */
  columnGap: setStringNumberProp(),
  /** 纵向排列的间距 */
  rowGap: setStringNumberProp(),
  /** 是否显示边框 */
  border: setBooleanProp(),
  /**
   * 尺寸
   *
   * @values large middle small mini
   * @defaultValue middle
   */
  size: setStringProp<FightingSize>('middle', (val: FightingSize): boolean => {
    return FIGHTING_SIZE.includes(val)
  }),
  /**
   * 绑定值变化时触发
   */
  onChange: setFunctionProp<RadioChange>()
} as const

export type RadioGroundProps = ExtractPropTypes<typeof Props>

export const RADIO_GROUP_PROPS_kEY: InjectionKey<RadioGroundProps> = Symbol('radio-group-props-key')

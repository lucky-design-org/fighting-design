import type { Ref } from 'vue'

/**
 * useOperationImg 返回值类型接口
 *
 * 用于 image-preview 组件的方法封装
 *
 * @param scale 放大倍数
 * @param rotate 旋转角度
 * @param smaller 放大操作
 * @param bigger 缩小操作
 * @param scrollZoom 滚轮缩放
 * @param recovery 还原图片
 * @param rotateClockwise 顺时针旋转
 * @param rotateCounterClock 逆时针旋转
 */
export interface UseOperationImgReturn {
  scale: Ref<number>
  rotate: Ref<number>
  smaller: () => void
  bigger: () => void
  scrollZoom(evt: WheelEvent): void
  recovery: () => void
  rotateClockwise: () => void
  rotateCounterClock: () => void
}

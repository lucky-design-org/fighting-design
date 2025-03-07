import { ref } from 'vue'
import { sizeChange, sizeToNum } from '../../_utils'
import { useRun } from '../../_hooks'
import type { UseLoadImgProp, UseLoadImgReturn } from './interface'

export * from './interface.d'

/**
 * 加载图片
 *
 * 用于普通图片加载和懒加载
 *
 * @param prop prop 参数对象
 */
export const useLoadImg = (prop: UseLoadImgProp): UseLoadImgReturn => {
  /** 是否加载成功 */
  const isSuccess = ref<boolean>(true)
  /**
   * 是否展示节点元素
   *
   * 因为在加载过程中 img 会展示一个撕裂的标志
   *
   * 所以使用变量控制显示和隐藏
   */
  const isShowNode = ref<boolean>(false)
  /**
   * 是否加载过 errSrc
   *
   * 该变量控制无限递归
   */
  let isLoadErrSrc = false

  /**
   * 加载成功
   * @param evt 事件对象
   */
  const success = (node: HTMLImageElement, evt: Event, src: string): void => {
    node.src = src
    isSuccess.value = true
    isShowNode.value = true
    useRun(prop.onLoad, evt)
  }

  /**
   * 加载失败
   * @param evt 事件对象
   */
  const failure = (evt: Event): void => {
    isSuccess.value = false
    useRun(prop.onError, evt)
  }

  /**
   * 正常加载图片
   * @param errSrc
   */
  const load = (node: HTMLImageElement, errSrc?: string): void => {
    const el: HTMLImageElement = new Image()

    new Promise((resolve, reject): void => {
      el.src = errSrc || prop.src

      el.addEventListener('load', (evt: Event): void => {
        resolve(evt)
      })

      el.addEventListener('error', (evt: Event): void => {
        reject(evt)
      })
    })
      /** 加载成功 */
      .then(evt => {
        evt && success(node, evt as Event, el.src)
      })
      /** 加载失败 */
      .catch(evt => {
        /** 如果没有加载过 errSrc，并且 errSrc 存在，则继续加载 */
        if (!isLoadErrSrc && prop.errSrc) {
          load(node, prop.errSrc)
          isLoadErrSrc = true
          return
        }
        /** 否则调用失败方法 */
        failure(evt)
      })
  }

  /**
   * 懒加载
   * @param node 元素节点
   */
  const lazy = (node: HTMLImageElement): IntersectionObserver => {
    /**
     * 实例化监测方法
     *
     * @see IntersectionObserver https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API
     * @see IntersectionObserver.IntersectionObserver https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver
     */
    const observer = new IntersectionObserver(
      (arr: IntersectionObserverEntry[]): void => {
        /** 如果到达区域范围开始加载 */
        if (arr[0].isIntersecting) {
          load(node)
          observer.unobserve(node)
        }
      },
      { rootMargin: sizeChange(prop.rootMargin) }
    )

    return observer
  }

  /**
   * 很 Low 的懒加载实现，用于兼容古老版本浏览器
   *
   * 希望你永远也不会触发这个方法
   *
   * @param node 元素节点
   */
  const lazyLow = (node: HTMLImageElement): void => {
    /** 监听浏览器滚动事件 */
    const listerScroll = (): void => {
      /**
       * 获取客户端浏览器视窗口的高度
       * @see innerHeight https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight
       * @see clientHeight https://developer.mozilla.org/zh-CN/docs/Web/API/Element/clientHeight
       */
      const clientHeight: number = window.innerHeight || document.documentElement.clientHeight
      /**
       * 获取当前垂直滚动的像素数
       * @see scrollTop https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollTop
       */
      const scrollTop: number = document.documentElement.scrollTop || document.body.scrollTop
      /**
       * 获取当前元素距离浏览器顶部的高度
       *
       * 因为传入的 node 是 img 元素，真正需要判断的元素为 f-image，所以要获取父级元素的高度
       *
       * @see offsetTop https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetTop
       * @see offsetParent https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetParent
       */
      const elTop: number = (node.offsetParent as HTMLDivElement).offsetTop
      /**
       * 获取到距离需要加载单独图片距离还有多远
       *
       * 浏览器的高度是不变的 + 滚动的距离，也就是浏览器底部距离最顶部的距离
       *
       * 当前元素距离浏览器顶部的高度也是不变的，在没有进入范围的时候 count 为负数
       *
       * 那么大于 0 之后则代表图片已经进入可视范围内部
       */
      const count: number = clientHeight + scrollTop - elTop

      /**
       * 如果到达需要加载的位置，则开始加载图片，并且取消监听滚动
       *
       * 使用绝对值来判断加载距离
       *
       * 以免传入 rootMargin 为负数不能触发加载，所以强制使用正数判断
       *
       * @see Math.abs https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/abs
       */
      if (Math.abs(count) < Math.abs(sizeToNum(prop.rootMargin))) {
        load(node)
        window.removeEventListener('scroll', listerScroll)
      }
    }

    /** 开始监听滚动事件 */
    window.addEventListener('scroll', listerScroll)
  }

  /**
   * 开始加载
   * @param node 元素节点
   */
  const loadImg = (node: HTMLImageElement): void => {
    /**
     * 如果需要懒加载
     *
     * 先判断浏览器是否存在 IntersectionObserver 方法
     *
     * 如果有则使用，否则使用其它方式兼容低版本浏览器的懒加载
     */
    if (prop.lazy) {
      IntersectionObserver ? lazy(node).observe(node) : lazyLow(node)
      return
    }

    load(node)
  }

  return {
    isSuccess,
    isShowNode,
    loadImg
  }
}

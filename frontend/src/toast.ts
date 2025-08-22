import type { ToastContent, ToastOptions, Id as ToastId } from 'react-toastify'
import { toast } from 'react-toastify'
import type { CommonTranslationKeys } from '@/translate'
import { translate } from '@/translate'

export let aToastId: ToastId

let aToastCloseable: boolean

export function aToast(content?: ToastContent<unknown>, options?: ToastOptions<unknown> | undefined) {
  options = { ...{ type: 'info', isLoading: false, closeButton: true, autoClose: 2000 }, ...options }

  aToastCloseable = !!options.closeButton
  if (isAToastActive() && !aToastCloseable) {
    return toast.update(aToastId, {
      ...options,
      render: typeof content === 'string' ? translate(content as CommonTranslationKeys) : content
    })
  }
  aToastId = toast.info(typeof content === 'string' ? translate(content as CommonTranslationKeys) : content, options)
}
export function isAToastActive() {
  return aToastId && toast.isActive(aToastId) && document.querySelector('.Toastify')?.innerHTML
}
export function dismissAToast() {
  toast.dismiss(aToastId)
}
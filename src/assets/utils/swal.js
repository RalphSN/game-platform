import Swal from 'sweetalert2'

/**
 * 輕量吐司提示 (Toast)
 * 用途：登入成功、登出、加入收藏等不干擾操作的行為
 */
export const showToast = (title, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end', // 顯示在右上角
    showConfirmButton: false,
    timer: 2000, // 2 秒後自動消失
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer
      toast.onmouseleave = Swal.resumeTimer
    },
  })

  return Toast.fire({
    icon,
    title,
  })
}

/**
 * 阻擋式確認框 (Confirm)
 * 用途：解鎖遊戲、扣款確認等需要玩家明確答覆的行為
 */
export const showConfirm = async (title, text = '') => {
  return await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#5E60CE',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    reverseButtons: true, // 取消在左，確定在右
    customClass: {
      popup: 'ddfun-swal-popup', // 客製化 CSS
      container: 'ddfun-swal-container'
    },
  })
}

/**
 * 阻擋式一般提示 (Alert)
 * 用途：餘額不足、系統錯誤等必須讓玩家看見的資訊
 */
export const showDialog = (title, text = '', icon = 'info') => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: '#5E60CE',
    confirmButtonText: '我知道了',
  })
}

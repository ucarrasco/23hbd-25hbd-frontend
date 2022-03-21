import Cookies from 'js-cookie'

export default function migrateToCookieTokenIfNeeded() {
  if (localStorage.accessToken) {
    Cookies.set('accessToken', localStorage.getItem('accessToken'), { expires: 45 })
    localStorage.removeItem('accessToken')
  }
}

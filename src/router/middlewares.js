import $store from '../store';

const Cookie = require('js-cookie');

export function initCurrentUserStateMiddleware(to, from, next) {
  const currentUser = $store.state.user.currentUser.profile_id
  if (!currentUser) {
    try {
      const data = {
        id: localStorage.getItem('user_id'),
        email: localStorage.getItem('email'),
        name: localStorage.getItem('name'),
        profile_id: localStorage.getItem('profile_id'),
      };
      $store.commit('user/SET_CURRENT_USER', data);
      next();
    } catch (e) {
      console.log(e);
    }
  }

  next();
}

/**
 * Check access permission to auth routes
 */
export function checkAccessMiddleware(to, from, next) {
  const isAuthRoute = Cookie.get('token')
  if (to.name === 'Index' || to.name === 'Verify') return next()
  if (to.name !== 'Login' && !isAuthRoute) return next({ name: 'Login' })
  return next();
}

export function setPageTitleMiddleware(to, from, next) {
//   const pageTitle = to.matched.find(item => item.meta.title)

  window.document.title = 'Paradox';
  next();
}

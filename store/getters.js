const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
}

export default getters
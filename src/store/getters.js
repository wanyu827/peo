const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  name: state => state.user.userInfo.username,
  avatar: state => state.user.userInfo.staffPhoto
}
export default getters

const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx55d0457fc9933cf0&redirect_uri=${window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`

const wxLogin = () => {
  console.log('调用了登录')
  const redirect_uri = encodeURIComponent(window.location.href)
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx55d0457fc9933cf0&redirect_uri=http%3A%2F%2Fnba.bluewebgame.com%2Foauth_response.php&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`

  window.location.href = url
}
export default wxLogin

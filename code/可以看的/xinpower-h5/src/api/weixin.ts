import axios from 'axios'

export const wxLogin = async (params: any) => {
  try {
    const res = await axios.get('localhost:3000/wxLogin/getWxUserInfo', { params: { ...params } })
    return res
  } catch (err) {
    // return err.response.data
  }
}

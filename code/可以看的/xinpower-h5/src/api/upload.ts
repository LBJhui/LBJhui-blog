import { axios } from '@/utils/axios/axios'

export const uploadAvatar = (data: object) =>
  axios({
    url: '/upload/uploadAvatar',
    data,
    method: 'post',
    config: {
      'Content-Type': 'multipart/form-data'
    }
  })

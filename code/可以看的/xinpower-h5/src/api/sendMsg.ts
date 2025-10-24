import { axios } from '@/utils/axios/axios'

export const sendSpaceMsg = (data: object) =>
  axios({
    url: '/sendMsg/spaceMsg',
    data,
    method: 'get'
  })

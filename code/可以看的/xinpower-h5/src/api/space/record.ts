import { axios } from '@/utils/axios/axios'

export const getSpendList = (data: object) =>
  axios({
    url: '/h5/space/record/getSpendList',
    data,
    method: 'get'
  })

export const getReservationList = (data: object) =>
  axios({
    url: '/h5/space/record/getReservationList',
    data,
    method: 'get'
  })

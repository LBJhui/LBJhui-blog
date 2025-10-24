import { axios } from '@/utils/axios/axios'

export const getCouponList = (data: object) =>
  axios({
    url: '/h5/space/coupon/couponList',
    data,
    method: 'get'
  })

export const getCouponUserList = (data: object) =>
  axios({
    url: '/h5/space/coupon/couponUserList',
    data,
    method: 'get'
  })

export const addCouponUser = (data: object) =>
  axios({
    url: '/h5/space/coupon/addCouponUser',
    data,
    method: 'get'
  })

export const notifyCount = (data: object) =>
  axios({
    url: '/h5/space/coupon/notifyCount',
    data,
    method: 'get'
  })

export const notified = (data: object) =>
  axios({
    url: '/h5/space/coupon/notified',
    data,
    method: 'get'
  })

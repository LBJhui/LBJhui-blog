import { axios } from '@/utils/axios/axios'

export const checkPermission = (data: object) =>
  axios({
    url: '/h5/space/user/checkPermission',
    data,
    method: 'get'
  })

export const register = (data: object) =>
  axios({
    url: '/h5/space/user/register',
    data,
    method: 'post'
  })

export const login = (data: object) =>
  axios({
    url: '/h5/space/user/login',
    data,
    method: 'post'
  })

export const resetPassword = (data: object) =>
  axios({
    url: '/h5/space/user/resetPassword',
    data,
    method: 'post'
  })

export const getUserInfoById = (data: object) =>
  axios({
    url: '/h5/space/user/getUserInfoById',
    data,
    method: 'get'
  })

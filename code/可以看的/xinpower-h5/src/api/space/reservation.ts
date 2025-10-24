import { axios } from '@/utils/axios/axios'

export const getReservationByUserId = (data: object) =>
  axios({
    url: '/h5/space/reservation/getReservationByUserId',
    data,
    method: 'get'
  })

export const isReservationByManager = (data: object) =>
  axios({
    url: '/h5/space/reservation/isReservationByManager',
    data,
    method: 'get'
  })

export const getRoomStatus = (data: object) =>
  axios({
    url: '/h5/space/reservation/getRoomStatus',
    data,
    method: 'get'
  })

export const cancelReservation = (data: object) =>
  axios({
    url: '/h5/space/reservation/cancelReservation',
    data,
    method: 'post'
  })

export const isFullReservation = (data: object) =>
  axios({
    url: '/h5/space/reservation/isFullReservation',
    data,
    method: 'get'
  })

export const getReservationListByRoom = (data: object) =>
  axios({
    url: '/h5/space/reservation/getReservationListByRoom',
    data,
    method: 'get'
  })

export const isReservationUser = (data: object) =>
  axios({
    url: '/h5/space/reservation/isReservationUser',
    data,
    method: 'get'
  })

export const addReservation = (data: object) =>
  axios({
    url: '/h5/space/reservation/addReservation',
    data,
    method: 'post'
  })

export const getReservationById = (data: object) =>
  axios({
    url: '/h5/space/reservation/getReservationById',
    data,
    method: 'get'
  })

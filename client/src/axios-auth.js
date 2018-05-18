/* eslint-disable */
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://namex-dev.pathfinder.gov.bc.ca'
})

export default instance

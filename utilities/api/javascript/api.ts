import axios, { AxiosRequestConfig, Method } from 'axios'

import Environment from '@/utilities/environment'
const endpointBase = window.EnvironmentSettings.endpoint

type AntiForgeryToken = {
  name?: string
  value?: string
}

class API {
  private antiForgeryToken?: AntiForgeryToken
  /**
   * Set an anti forgery token to make AJAX requests to the backend
   */
  setAntiForgeryToken(name: string, value: string) {
    this.antiForgeryToken = { name, value }
  }

  get<T>(path: string, data = {}, json: string | boolean, options: AxiosRequestConfig = {}) {
    let config: AxiosRequestConfig = {
      url: getEndpoint(path, json, 'get'),
      params: data,
      method: getMethod('GET', json),
    }

    config = { ...config, ...options }

    return axios.request<T>(config)
  }

  post<T>(path: string, data = {}, json: string | boolean, options: AxiosRequestConfig = {}) {
    let config: AxiosRequestConfig = {
      url: getEndpoint(path, json, 'post'),
      data,
      method: getMethod('POST', json),
    }

    if (this.antiForgeryToken && this.antiForgeryToken.name) {
      config.headers = {}
      config.headers[this.antiForgeryToken.name] = this.antiForgeryToken.value
    }

    config = { ...config, ...options }

    return axios.request<T>(config)
  }

  put<T>(path: string, data = {}, json: string | boolean, options: AxiosRequestConfig = {}) {
    let config: AxiosRequestConfig = {
      url: getEndpoint(path, json, 'put'),
      data,
      method: getMethod('PUT', json),
    }

    config = { ...config, ...options }

    return axios.request<T>(config)
  }

  delete<T>(path: string, data = {}, json: string | boolean, options: AxiosRequestConfig = {}) {
    let config: AxiosRequestConfig = {
      url: getEndpoint(path, json, 'delete'),
      data,
      method: getMethod('DELETE', json),
    }

    config = { ...config, ...options }

    return axios.request<T>(config)
  }
}

/**
 * Get the endpoint. If we require json we will return a json file.
 */
function getEndpoint(path: string, json: string | boolean, method: Method): string {
  if (path.substr(0, 2) === '//' || path.substr(0, 4) === 'http' || path.substr(0, 1) === '?') {
    return path
  }

  if (json === true || (json === 'local' && Environment.isLocal)) {
    return endpointBase + path + `--${method}.json`
  } else {
    return endpointBase + path
  }
}

/**
 * Will transform the method to GET if we require static json file
 */
function getMethod(method: Method, json: string | boolean): Method {
  return json === true || (json === 'local' && Environment.isLocal) ? 'GET' : method
}

export default new API()

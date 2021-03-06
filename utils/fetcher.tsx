import Path from "path"
import { basePath, serverURL, authorizedFetchArgs, defaultFetchArgs } from "../data/static"

export function baseFetch(path: string, defaultRequestInit?: RequestInit, currentRequestInit?: RequestInit): Promise<Response> {
  const url = new URL(Path.join(basePath, path), serverURL).toString()
  return fetch(url, { ...defaultRequestInit, ...currentRequestInit })
}

export function outsiderFetch(path: string, request?: RequestInit): Promise<Response> {
  return baseFetch(path, defaultFetchArgs(), request)
}

export function authorizedFetch(path: string, request?: RequestInit): Promise<Response> {
  return baseFetch(path, authorizedFetchArgs(), request)
}

export function addBodyToRequest(body: any, request?: RequestInit): RequestInit {
  return {
    body: JSON.stringify(body),
    ...request,
    headers: { "Content-Type": "application/json", ...request?.headers }
  } as RequestInit
}

export function outsiderJSONFetch(path: string, body: any, request?: RequestInit): Promise<Response> {
  return outsiderFetch(path, addBodyToRequest(body, request))
}

export function authorizedJSONFetch(path: string, body: any, request?: RequestInit): Promise<Response> {
  return authorizedFetch(path, addBodyToRequest(body, request))
}
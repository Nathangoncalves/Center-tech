import type { AxiosRequestConfig } from "axios";
import api from "./api";

type Config = AxiosRequestConfig;

const unwrap = <T>(promise: Promise<{ data: T }>) => promise.then((response) => response.data);

export const http = {
    get: <T>(url: string, config?: Config) => unwrap<T>(api.get<T>(url, config)),
    post: <T>(url: string, data?: unknown, config?: Config) => unwrap<T>(api.post<T>(url, data, config)),
    put: <T>(url: string, data?: unknown, config?: Config) => unwrap<T>(api.put<T>(url, data, config)),
    patch: <T>(url: string, data?: unknown, config?: Config) => unwrap<T>(api.patch<T>(url, data, config)),
    delete: <T>(url: string, config?: Config) => unwrap<T>(api.delete<T>(url, config)),
};

// types/native-request.ts

import { Relation } from "../relations";

export type HttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';

export interface NativeRequest {
    rel: Relation;
    method: HttpMethod;
    body?: unknown;
}

export interface Result<T> {
    data: T;
    success: boolean;
}

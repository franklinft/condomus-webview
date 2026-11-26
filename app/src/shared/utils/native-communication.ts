import { NativeRequest } from "./types/native-request";
import { mocks } from "../../../mock/index.mjs";

class NativeCommunication {
    async request<T>(request: NativeRequest): Promise<T> {
        const isNative =
            typeof window !== 'undefined' &&
            !!window.ReactNativeWebView;

        console.log('NODE_ENV:', process.env.NODE_ENV);

        if (!isNative && process.env.NODE_ENV === 'development') {
            if (typeof window !== 'undefined') {
                const isHttps = window.location.protocol === 'https:';
                const mockOrigin = `${isHttps ? 'https' : 'http'}://${window.location.hostname}:${isHttps ? 9001 : 9000}`;
                const mockUrl = new URL(`${mockOrigin}${request.rel}`);

                if (
                    request.method === 'GET' &&
                    request.body &&
                    typeof request.body === 'object'
                ) {
                    Object.entries(request.body).forEach(([key, value]) => {
                        mockUrl.searchParams.set(key, String(value));
                    });
                }

                const response = await fetch(mockUrl, {
                    method: request.method,
                    headers: request.headers,
                    body: request.method === 'GET'
                        ? undefined
                        : JSON.stringify(request.body),
                });

                if (!response.ok) {
                    throw new Error(`Mock request failed: ${response.status}`);
                }

                return await response.json() as T;
            }

            const mockAPI = mocks[request.rel];

            if (!mockAPI) {
                throw new Error(`Mock não encontrado para ${request.rel}`);
            }

            return await mockAPI(request) as T;
        }

        const message = JSON.stringify(request);

        // Android/iOS bridge
        if (
            typeof window !== 'undefined' &&
            window.ReactNativeWebView
        ) {
            window.ReactNativeWebView.postMessage(message);
            const mockAPI = mocks[request.rel];

            return await mockAPI(request) as T;

            // Aqui você implementaria o mecanismo
            // request/response usando Promise + id
            // return new Promise<T>((resolve, reject) => {
            //     // armazenar resolve/reject
            // });
        }

        throw new Error('Native bridge unavailable');
    }
}

export const nativeCommunication =
    new NativeCommunication();

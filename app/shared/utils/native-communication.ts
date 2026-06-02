import { NativeRequest } from "./types/native-request";
import { mocks } from "@/mock/index.mjs";

class NativeCommunication {
    async request<T>(request: NativeRequest): Promise<T> {

        if (process.env.NODE_ENV === 'development') {
            const mockAPI = mocks[request.rel];

            if (mockAPI !== undefined) {
                await new Promise(resolve => setTimeout(resolve, 500));

                return mockAPI as T;
            }
        }

        const message = JSON.stringify(request);

        // Android/iOS bridge
        if (
            typeof window !== 'undefined' &&
            window.ReactNativeWebView
        ) {
            window.ReactNativeWebView.postMessage(message);

            // Aqui você implementaria o mecanismo
            // request/response usando Promise + id
            return new Promise<T>((resolve, reject) => {
                // armazenar resolve/reject
            });
        }

        throw new Error('Native bridge unavailable');
    }
}

export const nativeCommunication =
    new NativeCommunication();

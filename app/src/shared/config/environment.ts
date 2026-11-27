export const Environment = {
    webViewUrl: process.env.DEV_IP
        ? `${process.env.DEV_IP}.nip.io`
        : process.env.NEXT_PUBLIC_WEBVIEW_HOST,
    apiUrl:
        process.env.NEXT_PUBLIC_API_URL ??
        (typeof window !== "undefined"
            ? `http://${window.location.hostname}:8080`
            : "http://localhost:8080"),
};

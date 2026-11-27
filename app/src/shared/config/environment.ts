export const Environment = {
    webViewUrl: process.env.DEV_IP
        ? `${process.env.DEV_IP}.nip.io`
        : process.env.NEXT_PUBLIC_WEBVIEW_HOST,
};

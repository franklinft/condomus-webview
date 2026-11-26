"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

type QrCodeProps = {
    value: string;
    onGenerated?: (source: string) => void;
};

export function QrCode({ value, onGenerated }: QrCodeProps) {
    const [imageSource, setImageSource] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        QRCode.toDataURL(value, { width: 280, margin: 2 }).then((source) => {
            if (isActive) {
                setImageSource(source);
                onGenerated?.(source);
            }
        });

        return () => {
            isActive = false;
        };
    }, [onGenerated, value]);

    if (!imageSource) {
        return (
            <div className="mx-auto h-[280px] w-[280px] animate-pulse rounded-2xl bg-gray-200" />
        );
    }

    return (
        <img
            src={imageSource}
            alt="QR Code do convite"
            className="mx-auto h-[280px] w-[280px] rounded-2xl"
        />
    );
}

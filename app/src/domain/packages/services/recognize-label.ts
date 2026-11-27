type BarcodeDetectorResult = {
    rawValue: string;
};

type BarcodeDetectorInstance = {
    detect: (
        source: HTMLImageElement,
    ) => Promise<BarcodeDetectorResult[]>;
};

type BarcodeDetectorConstructor = new (options?: {
    formats?: string[];
}) => BarcodeDetectorInstance;

type BarcodeDetectorWindow = Window & {
    BarcodeDetector?: BarcodeDetectorConstructor;
};

export type LabelRecognitionResult = {
    suggestions: {
        code?: string;
        recipientName?: string;
        apartment?: string;
        address?: string;
        carrier?: string;
    };
    text?: string;
    method: "barcode" | "ocr" | "manual";
};

type CarrierProfile = {
    name: string;
    keywords: string[];
    nameLabels: string[];
    addressLabels: string[];
    unitLabels: string[];
    codeLabels: string[];
};

const carrierProfiles: CarrierProfile[] = [
    {
        name: "Mercado Livre",
        keywords: ["MERCADO LIVRE", "MELI"],
        nameLabels: ["NOME", "DESTINATARIO", "CLIENTE", "DESTINATARIO ML"],
        addressLabels: ["ENDERECO", "ENDERECO DE ENTREGA", "LOGRADOURO"],
        unitLabels: ["COMPLEMENTO", "APTO", "APARTAMENTO", "CASA", "UNIDADE"],
        codeLabels: ["CODIGO", "ID DE ENVIO", "CODIGO DE ENVIO", "RASTREAMENTO"],
    },
    {
        name: "Shopee",
        keywords: ["SHOPEE"],
        nameLabels: ["NOME", "DESTINATARIO", "CLIENTE"],
        addressLabels: ["ENDERECO", "ENDERECO DE ENTREGA", "LOGRADOURO"],
        unitLabels: ["COMPLEMENTO", "APTO", "APARTAMENTO", "CASA", "UNIDADE"],
        codeLabels: ["CODIGO", "PEDIDO", "N PEDIDO", "RASTREAMENTO", "RASTREIO"],
    },
    {
        name: "Correios",
        keywords: ["CORREIOS", "OBJETO"],
        nameLabels: ["NOME", "DESTINATARIO", "CLIENTE"],
        addressLabels: ["ENDERECO", "ENDERECO DE ENTREGA", "LOGRADOURO"],
        unitLabels: ["COMPLEMENTO", "APTO", "APARTAMENTO", "CASA", "UNIDADE"],
        codeLabels: ["CODIGO", "OBJETO", "RASTREAMENTO", "RASTREIO"],
    },
];

const loadImage = (source: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Não foi possível ler a foto."));
        image.src = source;
    });

const getCodeFromText = (text: string): string | undefined => {
    const candidates = text
        .toUpperCase()
        .replace(/[^A-Z0-9\s-]/g, " ")
        .split(/\s+/)
        .map((value) => value.replace(/-/g, ""))
        .filter((value) => value.length >= 8 && /\d/.test(value));

    return candidates.sort((first, second) => second.length - first.length)[0];
};

const getLabelLines = (text: string) =>
    text
        .split(/\r?\n/)
        .map((line) => line.replace(/\s+/g, " ").trim())
        .filter((line) => line.length > 2);

const normalizeLabel = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

const supportedLabels = new Set([
    "NOME",
    "DESTINATARIO",
    "CLIENTE",
    "ENDERECO",
    "LOGRADOURO",
    "COMPLEMENTO",
    "APTO",
    "APARTAMENTO",
    "CASA",
    "UNIDADE",
    "BLOCO",
    "TRANSPORTADORA",
    "CODIGO",
    "CODIGO DE ENVIO",
    "ID DE ENVIO",
    "ENDERECO DE ENTREGA",
    "DESTINATARIO ML",
    "OBJETO",
    "PEDIDO",
    "N PEDIDO",
    "RASTREAMENTO",
    "RASTREIO",
]);

const parseLabelLine = (line: string) => {
    const match =
        line.match(/^([^:#-]+)\s*[:#-]\s*(.*)$/) ??
        line.match(/^(APTO|APARTAMENTO|CASA|UNIDADE|BLOCO|NOME)\s+(.+)$/i);

    if (!match) {
        return null;
    }

    const label = normalizeLabel(match[1]).replace(/\./g, "").trim();

    if (!supportedLabels.has(label)) {
        return null;
    }

    return {
        label,
        value: match[2].trim(),
    };
};

const getLabeledValues = (lines: string[]) => {
    const values: Record<string, string> = {};

    lines.forEach((line, index) => {
        const parsedLine = parseLabelLine(line);

        if (!parsedLine) {
            return;
        }

        const valueLines = parsedLine.value ? [parsedLine.value] : [];

        for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
            if (parseLabelLine(lines[nextIndex])) {
                break;
            }

            valueLines.push(lines[nextIndex]);
        }

        values[parsedLine.label] = valueLines.join(" ").trim();
    });

    return values;
};

const getFirstLabeledValue = (
    values: Record<string, string>,
    labels: string[],
) => labels.map((label) => values[normalizeLabel(label)]).find(Boolean);

const getCarrierProfile = (text: string) => {
    const normalizedText = normalizeLabel(text);

    return carrierProfiles.find((profile) =>
        profile.keywords.some((keyword) =>
            normalizedText.includes(normalizeLabel(keyword)),
        ),
    );
};

const getSuggestionsFromText = (text: string) => {
    const lines = getLabelLines(text);
    const normalizedText = text.toUpperCase();
    const labeledValues = getLabeledValues(lines);
    const carrierProfile = getCarrierProfile(text);
    const complement = getFirstLabeledValue(
        labeledValues,
        carrierProfile?.unitLabels ?? [
            "COMPLEMENTO",
            "APTO",
            "APARTAMENTO",
            "CASA",
            "UNIDADE",
            "BLOCO",
        ],
    );
    const apartmentMatch = complement?.match(
        /(?:APTO|APARTAMENTO|CASA|UNIDADE)\s*[:#-]?\s*([A-Z0-9-]+)/i,
    );
    const standaloneApartment = lines.find((line) =>
        /^\d{1,4}[A-Z]?$/.test(line.replace(/\s+/g, "")),
    );
    const address =
        getFirstLabeledValue(
            labeledValues,
            carrierProfile?.addressLabels ?? ["ENDERECO", "LOGRADOURO"],
        ) ??
        lines.find((line) =>
        /^(RUA|AVENIDA|AV\.|ALAMEDA|TRAVESSA|RODOVIA|ESTRADA)\b/i.test(line),
        );
    const carrier = [
        "CORREIOS",
        "MERCADO LIVRE",
        "AMAZON",
        "SHOPEE",
        "JADLOG",
        "TOTAL EXPRESS",
        "SEQUOIA",
        "DHL",
        "FEDEX",
        "UPS",
    ].find((name) => normalizedText.includes(name));
    const code =
        getFirstLabeledValue(
            labeledValues,
            carrierProfile?.codeLabels ?? [
                "CODIGO",
                "RASTREAMENTO",
                "RASTREIO",
            ],
        ) ?? getCodeFromText(text);
    const recipientName =
        getFirstLabeledValue(
            labeledValues,
            carrierProfile?.nameLabels ?? [
                "NOME",
                "DESTINATARIO",
                "CLIENTE",
            ],
        ) ??
        lines.find((line) => {
        const upperLine = line.toUpperCase();

        return (
            line.split(" ").length >= 1 &&
            !line.includes(code ?? "\u0000") &&
            !/^(RUA|AVENIDA|AV\.|ALAMEDA|TRAVESSA|RODOVIA|ESTRADA)\b/i.test(line) &&
            !/^(DESTINATÁRIO|DESTINATARIO|REMETENTE|ENTREGA)\b/i.test(upperLine) &&
            !/^\d/.test(line) &&
            !/^(CORREIOS|SHOPEE|AMAZON|MERCADO LIVRE|JADLOG|SEQUOIA)\b/i.test(
                upperLine,
            )
        );
        });

    return {
        code,
        recipientName,
        apartment:
            apartmentMatch?.[1] ??
            (complement && /\d/.test(complement)
                ? complement
                : standaloneApartment),
        address,
        carrier:
            getFirstLabeledValue(labeledValues, ["TRANSPORTADORA"]) ??
            carrier ??
            carrierProfile?.name,
    };
};

export const recognizePackageLabel = async (
    imageSource: string,
): Promise<LabelRecognitionResult> => {
    const image = await loadImage(imageSource);
    const detectorConstructor = (window as BarcodeDetectorWindow)
        .BarcodeDetector;
    let barcodeCode: string | undefined;

    if (detectorConstructor) {
        const detector = new detectorConstructor({
            formats: ["code_128", "code_39", "ean_13", "itf", "qr_code"],
        });
        const detectedCode = (await detector.detect(image))[0]?.rawValue;

        if (detectedCode) {
            barcodeCode = detectedCode;
        }
    }

    try {
        const { recognize } = await import("tesseract.js");
        const result = await recognize(imageSource, "eng");
        const suggestions = getSuggestionsFromText(result.data.text);

        return {
            suggestions: {
                ...suggestions,
                code: barcodeCode ?? suggestions.code,
            },
            text: result.data.text,
            method: barcodeCode ? "barcode" : "ocr",
        };
    } catch (error) {
        if (barcodeCode) {
            return {
                suggestions: { code: barcodeCode },
                text: barcodeCode,
                method: "barcode",
            };
        }

        throw error;
    }
};

"use client";

import {
    Bell,
    Camera,
    CheckCircle2,
    ImagePlus,
    Package,
    ScanBarcode,
    Upload,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { ReceivePackageData } from "../data/package";
import { ResidentRecord } from "../data/residents";
import {
    LabelRecognitionResult,
    recognizePackageLabel,
} from "../services/recognize-label";
import {
    resolveResidentCandidates,
    ResidentCandidate,
} from "../services/resolve-resident";

type PackageReceiptFormProps = {
    onSubmit: (data: ReceivePackageData) => Promise<void>;
    residents: ResidentRecord[];
};

const initialForm: ReceivePackageData = {
    recipientName: "",
    apartment: "",
    carrier: "",
    trackingCode: "",
};

const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        const image = new Image();

        reader.addEventListener("load", () => {
            if (typeof reader.result !== "string") {
                reject(new Error("Não foi possível preparar a imagem."));
                return;
            }

            image.src = reader.result;
        });
        reader.addEventListener("error", () =>
            reject(new Error("Não foi possível ler a imagem.")),
        );
        image.addEventListener("load", () => {
            const maxDimension = 1200;
            const scale = Math.min(
                1,
                maxDimension / Math.max(image.naturalWidth, image.naturalHeight),
            );
            const canvas = document.createElement("canvas");

            canvas.width = Math.round(image.naturalWidth * scale);
            canvas.height = Math.round(image.naturalHeight * scale);
            canvas
                .getContext("2d")
                ?.drawImage(image, 0, 0, canvas.width, canvas.height);

            resolve(canvas.toDataURL("image/jpeg", 0.72));
        });
        image.addEventListener("error", () =>
            reject(new Error("Não foi possível preparar a imagem.")),
        );
        reader.readAsDataURL(file);
    });

export function PackageReceiptForm({
    onSubmit,
    residents,
}: PackageReceiptFormProps) {
    const [form, setForm] = useState(initialForm);
    const [photoUrl, setPhotoUrl] = useState<string | undefined>();
    const [isSaved, setIsSaved] = useState(false);
    const [suggestions, setSuggestions] = useState<
        LabelRecognitionResult["suggestions"]
    >({});
    const [residentCandidates, setResidentCandidates] = useState<
        ResidentCandidate[]
    >([]);
    const [selectedResident, setSelectedResident] =
        useState<ResidentCandidate | null>(null);
    const [recognizedText, setRecognizedText] = useState<string | undefined>();
    const [recognitionState, setRecognitionState] = useState<
        "idle" | "reading" | "recognized" | "manual"
    >("idle");

    const updateField = (field: keyof ReceivePackageData, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setIsSaved(false);
    };

    const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            const compressedPhoto = await compressImage(file);
            setPhotoUrl(compressedPhoto);
            setIsSaved(false);
            void recognizeLabel(compressedPhoto);
        } catch {
            setRecognitionState("manual");
        }
    };

    const recognizeLabel = async (imageSource: string) => {
        setRecognitionState("reading");

        try {
            const result = await recognizePackageLabel(imageSource);
            applyRecognitionResult(result);
        } catch {
            setRecognitionState("manual");
        }
    };

    const selectResident = (resident: ResidentCandidate) => {
        setSelectedResident(resident);
        setForm((current) => ({
            ...current,
            residentId: resident.id,
            recipientName: resident.name,
            apartment: resident.apartment,
            address: resident.address,
        }));
        setIsSaved(false);
    };

    const applyRecognitionResult = (result: LabelRecognitionResult) => {
        setSuggestions(result.suggestions);
        setRecognizedText(result.text);
        setSelectedResident(null);
        const candidates = resolveResidentCandidates(
            result.suggestions,
            residents,
        );
        const [bestCandidate, secondCandidate] = candidates;

        setResidentCandidates(candidates);

        if (
            bestCandidate &&
            bestCandidate.score >= 70 &&
            (!secondCandidate ||
                bestCandidate.score - secondCandidate.score >= 15)
        ) {
            selectResident(bestCandidate);
        }

        if (Object.values(result.suggestions).some(Boolean)) {
            setRecognitionState("recognized");
            return;
        }

        setRecognitionState("manual");
    };

    const handleSelectResident = (resident: ResidentCandidate) => {
        selectResident(resident);
    };

    const applySuggestion = (
        field: keyof ReceivePackageData,
        value: string | undefined,
    ) => {
        if (value) {
            updateField(field, value);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSubmit({ ...form, photoUrl });
        setIsSaved(true);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
            <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
                <span className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                    <Package size={22} />
                </span>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        Nova encomenda
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950">
                        Registrar recebimento
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Fotografe a etiqueta e confirme os dados do pacote.
                    </p>
                </div>
            </div>

            <label className="block cursor-pointer rounded-2xl border border-dashed border-blue-300 bg-blue-50 p-4 transition-colors hover:bg-blue-100">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={handlePhotoChange}
                />
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-white p-2 text-blue-700">
                        {photoUrl ? <CheckCircle2 size={20} /> : <Camera size={20} />}
                    </span>
                    <span className="min-w-0 flex-1">
                        <strong className="block text-sm text-blue-950">
                            {photoUrl ? "Foto da etiqueta capturada" : "Fotografar etiqueta"}
                        </strong>
                        <span className="mt-1 block text-xs text-blue-700">
                            {recognitionState === "reading"
                                ? "Lendo código da etiqueta no dispositivo..."
                                : recognitionState === "recognized"
                                    ? "Código reconhecido. Confirme antes de registrar."
                                    : "A imagem será usada apenas como comprovante temporário."}
                        </span>
                    </span>
                    <ImagePlus className="shrink-0 text-blue-700" size={20} />
                </div>
            </label>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Morador destinatário
                    </label>
                    <input
                        required
                        value={form.recipientName}
                        onChange={(event) =>
                            updateField("recipientName", event.target.value)
                        }
                        placeholder="Ex: João da Silva"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Apartamento
                    </label>
                    <input
                        required
                        value={form.apartment}
                        onChange={(event) =>
                            updateField("apartment", event.target.value)
                        }
                        placeholder="Ex: 302"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Transportadora
                    </label>
                    <input
                        value={form.carrier}
                        onChange={(event) =>
                            updateField("carrier", event.target.value)
                        }
                        placeholder="Ex: Correios"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Endereço{" "}
                        <span className="font-normal text-slate-400">
                            (opcional)
                        </span>
                    </label>
                    <input
                        value={form.address ?? ""}
                        onChange={(event) =>
                            updateField("address", event.target.value)
                        }
                        placeholder="Endereço identificado na etiqueta"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>
            </div>

            <label className="mb-2 mt-5 block text-sm font-bold text-slate-700">
                Código da etiqueta
            </label>
            <div className="relative">
                <ScanBarcode
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                />
                <input
                    required
                    value={form.trackingCode}
                    onChange={(event) =>
                        updateField("trackingCode", event.target.value)
                    }
                    placeholder="Leia ou digite o código do pacote"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 pl-10 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
            </div>
            {recognitionState === "manual" && (
                <p className="mt-2 text-xs text-amber-700">
                    Não identificamos um código automaticamente. Confira ou
                    digite o código manualmente.
                </p>
            )}
            {recognitionState === "recognized" && (
                <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        Sugestões do reconhecimento
                    </p>
                    <div className="mt-2 space-y-2">
                        {[
                            ["Nome", "recipientName", suggestions.recipientName],
                            ["Apartamento/casa", "apartment", suggestions.apartment],
                            ["Endereço", "address", suggestions.address],
                            ["Transportadora", "carrier", suggestions.carrier],
                            ["Código", "trackingCode", suggestions.code],
                        ].map(([label, field, value]) =>
                            typeof value === "string" && value ? (
                                <div
                                    className="flex items-center justify-between gap-3 rounded-xl bg-white p-2.5"
                                    key={field}
                                >
                                    <span className="min-w-0">
                                        <span className="block text-xs text-slate-500">
                                            {label}
                                        </span>
                                        <strong className="block break-words text-sm text-blue-950">
                                            {value}
                                        </strong>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            applySuggestion(
                                                field as keyof ReceivePackageData,
                                                value,
                                            )
                                        }
                                        className="shrink-0 rounded-lg border border-blue-200 px-2 py-1 text-xs font-bold text-blue-900"
                                    >
                                        Usar
                                    </button>
                                </div>
                            ) : null,
                        )}
                    </div>
                    {recognizedText && (
                        <p className="mt-2 line-clamp-2 text-xs text-blue-800">
                            Texto lido: {recognizedText}
                        </p>
                    )}
                </div>
            )}
            {residentCandidates.length > 0 && (
                <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Moradores sugeridos
                    </p>
                    <p className="mt-1 text-sm text-emerald-900">
                        Selecione o destinatário para preencher os dados de uma vez.
                    </p>
                    <div className="mt-3 space-y-2">
                        {residentCandidates.map((resident) => (
                            <button
                                type="button"
                                key={resident.id}
                                onClick={() => handleSelectResident(resident)}
                                className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white p-3 text-left transition-colors ${selectedResident?.id === resident.id
                                    ? "border-emerald-500 ring-2 ring-emerald-100"
                                    : "border-emerald-100 hover:border-emerald-400"
                                    }`}
                            >
                                <span className="min-w-0">
                                    <strong className="block truncate text-sm text-slate-950">
                                        {resident.name}
                                    </strong>
                                    <span className="mt-1 block text-xs text-slate-500">
                                        Apto {resident.apartment}
                                        {resident.block
                                            ? ` · Bloco ${resident.block}`
                                            : ""}
                                    </span>
                                </span>
                                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                                    {Math.round(resident.score)}%
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-5 flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                <Upload className="mt-0.5 shrink-0 text-blue-700" size={16} />
                <span>
                    O código e os dados da etiqueta permanecem no histórico mesmo
                    após o expurgo automático da foto.
                </span>
            </div>

            <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 py-3.5 font-bold text-white transition-colors hover:bg-blue-800"
            >
                {isSaved ? <CheckCircle2 size={20} /> : <Bell size={20} />}
                {isSaved ? "Encomenda registrada" : "Registrar e notificar morador"}
            </button>
        </form>
    );
}

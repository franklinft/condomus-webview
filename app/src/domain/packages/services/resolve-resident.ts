import { ResidentRecord } from "../data/residents";

export type ResidentSuggestions = {
    recipientName?: string;
    apartment?: string;
    address?: string;
};

export type ResidentCandidate = ResidentRecord & {
    score: number;
};

const normalize = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

const normalizeUnit = (value: string) =>
    normalize(value).replace(/^(apto|apartamento|casa|unidade)/, "");

const normalizeWords = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ");

const getTokenOverlap = (first: string, second: string) => {
    const firstTokens = normalizeWords(first)
        .split(/\s+/)
        .filter(Boolean);
    const secondTokens = normalizeWords(second)
        .split(/\s+/)
        .filter(Boolean);
    const matches = firstTokens.filter((token) =>
        secondTokens.some(
            (candidate) =>
                candidate === token ||
                candidate.includes(token) ||
                token.includes(candidate),
        ),
    );

    return matches.length / Math.max(firstTokens.length, secondTokens.length, 1);
};

const similarity = (first: string, second: string) => {
    const normalizedFirst = normalize(first);
    const normalizedSecond = normalize(second);

    if (!normalizedFirst || !normalizedSecond) {
        return 0;
    }

    if (normalizedFirst === normalizedSecond) {
        return 1;
    }

    if (
        normalizedFirst.includes(normalizedSecond) ||
        normalizedSecond.includes(normalizedFirst)
    ) {
        return 0.75;
    }

    return getTokenOverlap(first, second);
};

export const resolveResidentCandidates = (
    suggestions: ResidentSuggestions,
    residents: ResidentRecord[],
): ResidentCandidate[] =>
    residents
        .map((resident) => {
            let score = 0;

            if (
                suggestions.apartment &&
                normalizeUnit(suggestions.apartment) ===
                    normalizeUnit(resident.apartment)
            ) {
                score += 60;
            }

            if (suggestions.recipientName) {
                score += similarity(suggestions.recipientName, resident.name) * 30;
            }

            if (suggestions.address) {
                score += similarity(suggestions.address, resident.address) * 10;
            }

            return { ...resident, score };
        })
        .filter((resident) => resident.score > 0)
        .sort((first, second) => second.score - first.score)
        .slice(0, 3);

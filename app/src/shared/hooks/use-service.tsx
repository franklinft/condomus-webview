"use client";

import {
    ReactNode,
    Suspense,
    useCallback,
    useRef,
    useState,
} from "react";

type FetchResult<TData> = {
    data: TData | null;
    isLoading: boolean;
    error: unknown;
};

type Callback<TArgs extends unknown[], TData> = (
    ...args: TArgs
) => Promise<TData>;

type SuspenseComponentProps = {
    children: ReactNode;
    fallback: ReactNode;
    onError: ReactNode;
};

type UseServiceReturn<TArgs extends unknown[], TData> = {
    fetch: (...args: TArgs) => Promise<TData | null>;
    result: FetchResult<TData>;
    SuspenseComponent: ({
        children,
        fallback,
        onError,
    }: SuspenseComponentProps) => ReactNode;
};

type SuspensePair = {
    promise: Promise<unknown>;
    resolve: (value: unknown) => void;
};

const noop: Callback<[], null> = async () => null;

const createSuspensePair = (): SuspensePair => {
    let resolve!: (value: unknown) => void;
    const promise = new Promise<unknown>((promiseResolve) => {
        resolve = promiseResolve;
    });

    return { promise, resolve };
};

export function useService<
    TArgs extends unknown[] = [],
    TData = unknown,
>(
    fn: Callback<TArgs, TData> = noop as Callback<TArgs, TData>,
): UseServiceReturn<TArgs, TData> {
    const [data, setData] = useState<TData | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const suspenseRef = useRef<SuspensePair>(createSuspensePair());

    const fetch = useCallback(
        async (...args: TArgs) => {
            const pair = createSuspensePair();
            suspenseRef.current = pair;
            setLoading(true);
            setError(null);

            try {
                const response = await fn(...args);
                setData(response);
                pair.resolve(response);
                return response;
            } catch (requestError) {
                setError(requestError);
                pair.resolve(requestError);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [fn],
    );

    const SuspenseComponent = useCallback(
        ({ children, fallback, onError }: SuspenseComponentProps) => (
            <Suspense fallback={fallback}>
                {isLoading
                    ? (() => {
                        throw suspenseRef.current.promise;
                    })()
                    : error
                        ? onError
                        : data !== null
                            ? children
                            : null}
            </Suspense>
        ),
        [data, error, isLoading],
    );

    return {
        fetch,
        result: {
            data,
            isLoading,
            error,
        },
        SuspenseComponent,
    };
}

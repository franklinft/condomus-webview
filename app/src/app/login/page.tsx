"use client";

import { Home, LogIn, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    authenticate,
    getUserProfile,
} from "src/domain/auth/services/authentication";
import { saveAuthSession } from "src/domain/auth/services/session";

type LoginForm = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: LoginForm) => {
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const token = await authenticate(data);
            const profile = await getUserProfile(token);

            saveAuthSession({
                authorized: true,
                accessToken: token.accessToken,
                personId: token.personId,
                accountId: token.accountId,
                tenantId: token.tenantId,
                accountStatus: profile.accountStatus.toLowerCase() as
                    | "active"
                    | "inactive",
                displayName: profile.name,
                expiresAt: token.expiresAt,
            });
            router.push("/home");
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível entrar.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-800 px-6 py-12">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-white">
                    <span className="mb-5 inline-flex rounded-2xl bg-white/15 p-3">
                        <Home size={28} />
                    </span>
                    <p className="text-3xl font-black tracking-tight">condomus</p>
                    <p className="mt-2 text-blue-100">
                        Segurança e tranquilidade para o seu condomínio.
                    </p>
                </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-3xl bg-white p-6 shadow-2xl shadow-blue-950/20">
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-slate-950">Bem-vindo de volta</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Entre para gerenciar seus acessos.
                    </p>
                </div>
                {errorMessage && (
                    <p
                        role="alert"
                        className="rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-700"
                    >
                        {errorMessage}
                    </p>
                )}
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        E-mail
                    </label>

                    <input
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        autoComplete="email"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        {...register("email", {
                            required: "E-mail é obrigatório",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Informe um e-mail válido",
                            },
                        })}
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Senha
                    </label>

                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        autoComplete="current-password"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        {...register("password", {
                            required: "Senha é obrigatória",
                        })}
                    />

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    className="ml-auto block text-sm font-bold text-blue-900 hover:text-blue-700"
                >
                    Esqueci minha senha
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 py-3 font-bold text-white transition-colors hover:bg-blue-800"
                >
                    <LogIn size={20} />
                    {isSubmitting ? "Entrando..." : "Entrar"}
                </button>

                <p className="text-center text-sm text-slate-500">
                    Ainda não tem acesso?{" "}
                    <Link
                        href="/cadastro"
                        className="font-bold text-blue-900 hover:text-blue-700"
                    >
                        Criar cadastro
                    </Link>
                </p>
            </form>
                <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-blue-100">
                    <ShieldCheck size={15} />
                    Seus acessos protegidos pelo Condomus
                </p>
            </div>
        </main>
    );
}

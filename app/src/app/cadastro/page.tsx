"use client";

import { ArrowLeft, Home, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

type RegistrationForm = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegistrationPage() {
    const [submitted, setSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegistrationForm>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = useWatch({ control, name: "password" });

    return (
        <main className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-800 px-6 py-12">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-8 text-white">
                    <Link
                        href="/login"
                        className="mb-6 flex w-fit items-center gap-2 text-sm font-bold text-blue-100 transition hover:text-white"
                    >
                        <ArrowLeft size={17} />
                        Voltar para o login
                    </Link>
                    <div className="mb-5">
                        <span className="mb-3 inline-flex rounded-2xl bg-white/15 p-3">
                            <Home size={28} />
                        </span>
                        <p className="text-3xl font-black tracking-tight">
                            condomus
                        </p>
                    </div>
                    <p className="mt-2 max-w-lg text-blue-100">
                        Crie seu acesso para começar a cuidar do seu condomínio
                        com mais segurança e tranquilidade.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(() => setSubmitted(true))}
                    className="space-y-5 rounded-3xl bg-white p-6 shadow-2xl shadow-blue-950/20 sm:p-8"
                >
                    <div className="mb-2">
                        <h1 className="text-2xl font-bold text-slate-950">
                            Criar cadastro
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Preencha seus dados para começar.
                        </p>
                    </div>

                    {submitted && (
                        <p
                            role="status"
                            className="rounded-2xl bg-blue-50 p-3 text-sm font-medium text-blue-800"
                        >
                            Cadastro preenchido. A integração será concluída no
                            próximo passo.
                        </p>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Nome completo
                        </label>
                        <input
                            type="text"
                            placeholder="Digite seu nome completo"
                            autoComplete="name"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            {...register("name", {
                                required: "Nome é obrigatório",
                                minLength: {
                                    value: 3,
                                    message: "Informe seu nome completo",
                                },
                            })}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Senha
                            </label>
                            <input
                                type="password"
                                placeholder="Crie uma senha"
                                autoComplete="new-password"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                {...register("password", {
                                    required: "Senha é obrigatória",
                                    minLength: {
                                        value: 6,
                                        message: "A senha deve ter pelo menos 6 caracteres",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Confirmar senha
                            </label>
                            <input
                                type="password"
                                placeholder="Repita sua senha"
                                autoComplete="new-password"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                {...register("confirmPassword", {
                                    required: "Confirmação de senha é obrigatória",
                                    validate: (value) =>
                                        value === password ||
                                        "As senhas precisam ser iguais",
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 py-3 font-bold text-white transition-colors hover:bg-blue-800"
                    >
                        <UserPlus size={20} />
                        Criar cadastro
                    </button>
                </form>

                <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-blue-100">
                    <ShieldCheck size={15} />
                    Seus dados protegidos pelo Condomus
                </p>
            </div>
        </main>
    );
}

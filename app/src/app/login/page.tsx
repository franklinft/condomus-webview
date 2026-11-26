"use client";

import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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

    const onSubmit = (data: LoginForm) => {
        console.log("Login submitted:", data);
        router.push("/home");
    };

    return (
        <main className="flex flex-1 flex-col justify-center px-6 py-12">
            <p className="mb-8">
                Entre na sua conta para acessar o Condomus
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block font-bold text-gray-700 mb-2">
                        E-mail
                    </label>

                    <input
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        autoComplete="email"
                        className="border bg-white border-gray-300 rounded-2xl p-3 focus:outline-none w-full focus:ring-2 focus:ring-blue-500"
                        {...register("email", {
                            required: "E-mail é obrigatório",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Informe um e-mail válido",
                            },
                        })}
                    />

                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block font-bold text-gray-700 mb-2">
                        Senha
                    </label>

                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        autoComplete="current-password"
                        className="border bg-white border-gray-300 rounded-2xl p-3 focus:outline-none w-full focus:ring-2 focus:ring-blue-500"
                        {...register("password", {
                            required: "Senha é obrigatória",
                        })}
                    />

                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    className="block ml-auto text-sm font-bold text-blue-900 hover:text-blue-700"
                >
                    Esqueci minha senha
                </button>

                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full bg-blue-900 text-white font-bold py-3 rounded-2xl hover:bg-blue-800 transition-colors"
                >
                    <LogIn size={20} />
                    Entrar
                </button>
            </form>
        </main>
    );
}

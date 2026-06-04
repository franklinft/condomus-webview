'use client';

import { HardHat, Motorbike, Share2, User } from "lucide-react";
import FooterComponent from "src/shared/components/footer/footer";
import { HeaderComponent } from "src/shared/components/header/header";
import { useForm } from "react-hook-form";

type NewInvitationForm = {
    visitorName: string;
    visitorType: "Convidado" | "Prestador" | "Delivery";
    additionalInfo: string;
};

export default function NewInvitationPage() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<NewInvitationForm>({
        defaultValues: {
            visitorName: "",
            visitorType: "Convidado",
            additionalInfo: "",
        },
    });

    const selectedType = watch("visitorType");

    const onSubmit = (data: NewInvitationForm) => {
        console.log("Form submitted:", data);
    };

    const getButtonClass = (type: string) =>
        `font-bold flex flex-col p-6 items-center rounded-2xl transition-colors cursor-pointer ${selectedType === type
            ? "bg-blue-900 text-white"
            : "bg-white border border-gray-300 text-blue-900"
        }`;

    return (
        <>
            <HeaderComponent />

            <div className="px-6">
                <h1 className="text-3xl text-blue-900 font-bold">
                    Novo Convite
                </h1>

                <p className="mb-8">
                    Crie um acesso temporário para seus visitantes
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <label className="block font-bold text-gray-700 mb-2">
                        Nome do visitante
                    </label>

                    <input
                        type="text"
                        placeholder="Ex: João da Silva"
                        className="border bg-white border-gray-300 rounded-2xl p-3 focus:outline-none w-full focus:ring-2 focus:ring-blue-500"
                        {...register("visitorName", {
                            required: "Nome do visitante é obrigatório",
                        })}
                    />

                    {errors.visitorName && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.visitorName.message}
                        </p>
                    )}

                    <label className="mt-8 block font-bold text-gray-700 mb-2">
                        Tipo de Visitante
                    </label>

                    <div className="flex flex-row gap-1 justify-between">
                        <button
                            type="button"
                            className={getButtonClass("Convidado")}
                            onClick={() =>
                                setValue("visitorType", "Convidado")
                            }
                        >
                            <User />
                            Convidado
                        </button>

                        <button
                            type="button"
                            className={getButtonClass("Prestador")}
                            onClick={() =>
                                setValue("visitorType", "Prestador")
                            }
                        >
                            <HardHat />
                            Prestador
                        </button>

                        <button
                            type="button"
                            className={getButtonClass("Delivery")}
                            onClick={() =>
                                setValue("visitorType", "Delivery")
                            }
                        >
                            <Motorbike />
                            Delivery
                        </button>
                    </div>

                    <textarea
                        rows={4}
                        placeholder="Informações adicionais para a portaria"
                        className="mt-8 w-full bg-white border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        {...register("additionalInfo")}
                    />

                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 mt-8 w-full bg-blue-900 text-white font-bold py-3 rounded-2xl hover:bg-blue-800 transition-colors"
                    >
                        <Share2 />
                        Gerar Link do Convite
                    </button>
                </form>
            </div>

            <FooterComponent />
        </>
    );
}

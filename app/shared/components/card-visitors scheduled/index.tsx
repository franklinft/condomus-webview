import { Motorbike, Truck } from "lucide-react";

export function CardVisitorsScheduled() {
    return (
        <div className="bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-2">Visitantes Agendados</h2>
            {/* <p>Veja os visitantes que estão agendados para os próximos dias e gerencie suas visitas com facilidade.</p> */}
            <ul>
                <li className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        <span className="bg-blue-200 p-2 rounded-full"><Motorbike /></span>
                        <span className="ml-4 font-medium">Entrega Uber eats</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-blue-900 font-bold">14:00</span>
                        <span className="text-gray-400">Hoje</span>
                    </div>
                </li>
                <li className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        <span className="bg-blue-200 p-2 rounded-full"><Truck /></span>
                        <span className="ml-4 font-medium">Amazon Hub</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-blue-900 font-bold">14:00</span>
                        <span className="text-gray-400">Hoje</span>
                    </div>
                </li>
            </ul>
            <button
                className="mt-4 px-4 py-2 bg-blue-900 
                text-white rounded-4xl">
                Ver Visitantes Agendados
            </button>
        </div>
    );
}

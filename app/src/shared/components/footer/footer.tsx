import { House, LockKeyhole, UserPlus, UserRound } from "lucide-react";

export default function FooterComponent() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white text-gray-600 py-4 mt-6">
            <ul className="flex flex-row justify-between px-4">
                <li className="flex flex-col items-center justify-center p-2">
                    <House />
                    <span className="font-black">Home</span>
                </li>
                <li className="flex flex-col items-center justify-center p-2">
                    <LockKeyhole />
                    <span className="font-black">Acessos</span>
                </li>
                <li className="flex flex-col items-center justify-center p-2">
                    <UserPlus />
                    <span className="font-black">Convites</span>
                </li>
                <li className="flex flex-col items-center justify-center p-2">
                    <UserRound />
                    <span className="font-black">Perfil</span>
                </li>
            </ul>
        </footer>
    );
}

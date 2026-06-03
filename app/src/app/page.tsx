import HomeComponent from "src/domain/home/components";
import { HeaderComponent } from "../shared/components/header/header";

export default async function HomePage() {
    return (
        <div>
            <HeaderComponent />
            <div className="p-6">
                <HomeComponent />
            </div >
        </div>
    );
}

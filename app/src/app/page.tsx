import HomeComponent from "src/domain/home/components";
import { HeaderComponent } from "../shared/components/header/header";
import FooterComponent from "src/shared/components/footer/footer";

export default async function HomePage() {
    return (
        <div>
            <HeaderComponent />
            <div className="px-6">
                <HomeComponent />
            </div >
            <FooterComponent />
        </div>
    );
}

import Footer from "@/app/shared/components/features/Footer";
import Header from "@/app/shared/components/features/Header";
import ProgressCard from "@/app/shared/components/features/ProgressCard";

export default function Progress() {

    return (
        <main className="text-center text-gray-700">
            <Header text="Fortschritt"/>

            <ProgressCard/>

            <Footer />
        </main>
    );
}
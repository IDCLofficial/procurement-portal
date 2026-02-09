import Navbar from "./homepage/Navbar";
import OfficeHours from "./homepage/OfficeHours";
import HeroSection from "./homepage/HeroSection";
import StatsSection from "./homepage/StatsSection";
import AboutSection from "./homepage/AboutSection";
import DirectorSection from "./homepage/DirectorSection";
import ServicesSection from "./homepage/ServicesSection";
import ContractorCTA from "./homepage/ContractorCTA";
import ContactCTA from "./homepage/ContactCTA";
import Footer from "./homepage/Footer";

export default function HomePage(){
    return (
        <>
            <Navbar />
            <OfficeHours />
            <HeroSection />
            <StatsSection />
            <AboutSection />
            <DirectorSection />
            <ServicesSection />
            <ContractorCTA />
            <ContactCTA/>
            <Footer/>
        </>
    )
}
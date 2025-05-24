import Footer from "@/components/footer";
import GoogleMaps from "@/components/google-maps";
import LandingAbout from "@/components/landing/about";
import LandingBlog from "@/components/landing/blog";
import LandingDonaturs from "@/components/landing/donaturs";
import LandingHero from "@/components/landing/hero";
import LandingProgram from "@/components/landing/program";
import LandingWA from "@/components/landing/whatsapp";
import Navbar from "@/components/navbar";

export default function LandingPage() {
   

    return (
        <main>
            <Navbar />
            <LandingHero />
            <LandingAbout />
            <LandingWA />
            <LandingProgram />
            <LandingDonaturs />
            <LandingBlog />
            <GoogleMaps />
            <Footer/>
        </main>
    );
}
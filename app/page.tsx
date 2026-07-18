import ScrollManager from "@/components/ScrollManager";
import LiveManifest from "@/components/LiveManifest";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import GlobalCanvasLoader from "@/components/GlobalCanvasLoader";
import IntroScreen from "@/components/IntroScreen";

export default function Home() {
  return (
    <main className="bg-background">
      <GlobalCanvasLoader />
      <IntroScreen />
      <ScrollManager>
        <Hero />
      </ScrollManager>

      <LiveManifest />
      <Services />
      <Stats />
      <Footer />
    </main>
  );
}

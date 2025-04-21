import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/ui/layout/Layout";
import Hero from "@/components/home/Hero";
import Sobre from "@/components/home/Sobre";
import Modalidades from "@/components/home/Modalidades";
import Locais from "@/components/home/Locais";
import Galeria from "@/components/home/Galeria";
import Eventos from "@/components/home/Eventos";
import Depoimentos from "@/components/home/Depoimentos";
import Contato from "@/components/home/Contato";
import { HolidaysCalendar } from "@/components/home/calendario/HolidaysCalendar";

const Index = () => {
  const location = useLocation();
  
  useEffect(() => {
    // When route changes, scroll to the relevant section or to top if it's the home page
    const path = location.pathname;
    console.log(`Current path: ${path}`);
    
    if (path === "/") {
      window.scrollTo(0, 0);
      return;
    }
    
    // Remove the leading slash to get the section ID
    const sectionId = path.substring(1);
    const element = document.getElementById(sectionId);
    
    if (element) {
      console.log(`Scrolling to section: ${sectionId}`);
      // Add a small delay to ensure the page has rendered
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      console.log(`Section not found: ${sectionId}`);
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <Layout>
      <div className="flex flex-col w-full">
        <Hero />
        <Sobre />
        <Modalidades />
        <Locais />
        <Galeria />
        <Eventos />
        <Depoimentos />
        <HolidaysCalendar />
        <Contato />
      </div>
    </Layout>
  );
};

export default Index;

import Layout from "@/components/ui/layout/Layout";
import Hero from "@/components/home/Hero";
import Sobre from "@/components/home/Sobre";
import Modalidades from "@/components/home/Modalidades";
import Locais from "@/components/home/Locais";
import Galeria from "@/components/home/Galeria";
import Eventos from "@/components/home/Eventos";
import Depoimentos from "@/components/home/Depoimentos";
import Contato from "@/components/home/Contato";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Sobre />
      <Modalidades />
      <Locais />
      <Galeria />
      <Depoimentos />
      <Eventos />
      <Contato />
    </Layout>
  );
};

export default Index;

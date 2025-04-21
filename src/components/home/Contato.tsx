
import { motion } from "framer-motion";
import { Mail, Phone, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contato = () => {
  return (
    <section className="py-20 bg-viva-gray">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Fale <span className="text-viva-blue">Conosco</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Entre em contato para mais informações sobre matrículas, horários e valores.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Envie uma mensagem</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Seu e-mail"
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Assunto
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Assunto da mensagem"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  placeholder="Sua mensagem"
                  rows={5}
                  className="w-full"
                />
              </div>
              <Button className="bg-viva-blue hover:bg-viva-darkBlue text-white w-full">
                <Send size={16} className="mr-2" /> Enviar mensagem
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Informações de contato</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-viva-blue rounded-full p-3 mr-4">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Telefone</h4>
                    <p className="text-gray-600">(31) 99290-1175</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 rounded-full p-3 mr-4">
                    <FaWhatsapp size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">WhatsApp</h4>
                    <p className="text-gray-600">(31) 99290-1175</p>
                    <a 
                      href="https://wa.me/5511987654321" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline flex items-center mt-1"
                    >
                      Fale conosco agora
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-viva-red rounded-full p-3 mr-4">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">E-mail</h4>
                    <p className="text-gray-600">esportesviva@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-lg mb-4">Horário de atendimento</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Segunda à Sexta:</span>
                  <span className="font-medium">16h às 20h</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Sábado:</span>
                  <span className="font-medium">fechado</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Domingo:</span>
                  <span className="font-medium">Fechado</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contato;

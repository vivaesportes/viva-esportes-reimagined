
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const Contato = () => {
  // All numbers and WhatsApp links use (31) 99290-1175
  const whatsappNumber = "31992901175";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Erro ao enviar",
        description: "Por favor, preencha todos os campos do formulário.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // URL do Supabase Edge Function
      const functionUrl = 'https://fcdxmrbiugpptquxodmx.supabase.co/functions/v1/send-gmail';
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Mensagem enviada!",
          description: "Obrigado pelo contato, retornaremos em breve.",
        });
        
        // Limpar formulário após envio bem-sucedido
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        throw new Error(data.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um problema ao enviar sua mensagem. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-20 bg-viva-gray">
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
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                    value={formData.name}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
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
                  value={formData.subject}
                  onChange={handleChange}
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
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <Button 
                className="bg-viva-blue hover:bg-viva-darkBlue text-white w-full"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <span className="mr-2">Enviando...</span>
                    <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <Send size={16} className="mr-2" /> Enviar mensagem
                  </>
                )}
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
                      href={whatsappUrl} 
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

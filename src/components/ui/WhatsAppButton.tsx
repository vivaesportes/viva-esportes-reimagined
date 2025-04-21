
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

type WhatsAppButtonProps = {
  phoneNumber?: string; // Now optional, default to global number if not provided
  message?: string;
};

const DEFAULT_PHONE = "31992901175";
const DEFAULT_MESSAGE = "Olá! Gostaria de saber mais sobre a Viva Esportes.";

const WhatsAppButton = ({
  phoneNumber = DEFAULT_PHONE,
  message = DEFAULT_MESSAGE,
}: WhatsAppButtonProps) => {
  const formattedPhone = phoneNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <FaWhatsapp size={28} />
    </motion.a>
  );
};

export default WhatsAppButton;

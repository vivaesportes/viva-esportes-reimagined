
import { ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description: string;
}

export const AdminHeader = ({ title, description }: AdminHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-2 flex items-center">
        <ShieldCheck className="mr-2 h-6 w-6 text-purple-600" />
        {title}
      </h1>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

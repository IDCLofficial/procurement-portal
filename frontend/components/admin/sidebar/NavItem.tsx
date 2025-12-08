import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface NavItemProps {
  icon: LucideIcon;
  text: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavItem({ 
  icon: Icon, 
  text, 
  active = false, 
  href = "#",
  onClick 
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        active
          ? 'bg-green-50 text-green-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon
        className={`mr-3 h-5 w-5 ${
          active ? 'text-green-500' : 'text-gray-400'
        }`}
        aria-hidden="true"
      />
      {text}
    </Link>
  );
}

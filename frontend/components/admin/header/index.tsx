import { Bell, UserCircle2, ChevronDown } from 'lucide-react';

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none">
            <Bell className="w-6 h-6" />
          </button>
          
          <div className="relative">
            <button className="flex items-center space-x-2">
              <UserCircle2 className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">System Admin</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

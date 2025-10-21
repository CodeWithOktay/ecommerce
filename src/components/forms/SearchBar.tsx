import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?query=${encodeURIComponent(value)}`);
    // setValue('');
  };
  return (
    <form onSubmit={handleSubmit} className="relative w-full sm:w-96">
      {/* Arama Input */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-10 text-gray-400" size={20} />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ürün, marka veya kategori ara..."
        className="block w-full rounded-full border border-gray-200 bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
      />
    </form>
  );
}

'use client'

import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/logo.png"
                alt="Astrea Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <h3 className="text-lg font-semibold">Astrea</h3>
            </div>
            <p className="text-gray-300">Sebuah warung minuman dan kopi berkualitas tinggi dan rasa yang segar dan nikmat</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategori</h3>
            <ul className="space-y-2 text-gray-300">
              {categories.slice(0, 3).map(category => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <p className="text-gray-300">Email: info@astrea.com</p>
            <p className="text-gray-300">Phone: +62 123 456 789</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-300">
          <p>© 2025 Astrea E-Commerce | Version 2.0</p>
        </div>
      </div>
    </footer>
  );
}
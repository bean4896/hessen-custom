'use client';
import { JSX } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { products } from '../shared/utils/productManager';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-background overflow-hidden lg:overflow-hidden">
      {/* Global Navbar */}
      <Navbar />

      {/* Full Screen Grid Layout */}
      <div className="h-auto lg:h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 border border-gray-300 gap-0">
        {products.map((product, index) => (
          <Link key={product.id} href={product.route} className="group relative overflow-hidden border border-gray-300 h-[25vh] lg:h-auto">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('${getProductBackground(product.id)}')`
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60 group-hover:from-black/40 group-hover:to-black/50 transition-all duration-500" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6 lg:p-8 text-white">
              {/* Top Section */}
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl lg:text-4xl font-bold mb-2 text-white">
                  {product.name.toUpperCase()}
                </h2>
                <p className="text-sm lg:text-lg text-white/80 mb-6 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Bottom Section - CTA Button */}
              <div className="flex justify-start">
                <Button 
                  size="lg"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
                >
                  Configure
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
}

// Get product background images from Hessen's website
function getProductBackground(productId: string): string {
  const backgrounds = {
    'bedframe': 'https://hessen.sg/wp-content/uploads/2024/02/12.-Bedroom-1.jpg',
    'kitchen': 'https://hessen.sg/wp-content/uploads/2024/02/20240110-IMG_1115-2160x2880-min-1536x2048.jpg',
    'storage-cabinets': 'https://hessen.sg/wp-content/uploads/2024/02/leibal_island_way-design-studio_12-min-1367x2048.jpg',
    'living-room-wall': 'https://hessen.sg/wp-content/uploads/2024/04/IMG_3667-4-1920x2560-1-1536x2048.webp'
  };

  return backgrounds[productId as keyof typeof backgrounds] || backgrounds['bedframe'];
}

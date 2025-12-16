'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductById } from '../../../shared/utils/productManager';

interface ProductGalleryProps {
  selectedOptions: Record<string, string | string[]>;
  productId: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ selectedOptions, productId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  
  // Get product information
  const product = getProductById(productId);
  
  // Your Cloudinary configuration - REMOVED fixed dimensions
  const CLOUDINARY_CONFIG = {
    cloudName: 'dxpnm8bat',
    baseUrl: 'https://res.cloudinary.com/dxpnm8bat/image/upload',
    folder: productId === 'bedframe' ? 'bedframes' : productId,
    // Updated transformations for better quality without fixed dimensions
    transformations: 'f_auto,q_auto'
  };
  
  // Define different view angles and their descriptions
  const viewAngles = [
    { name: 'front', label: 'Front View', description: 'Main product view' },
    { name: 'side', label: 'Side View', description: 'Side angle view' },
    { name: 'detail', label: 'Detail Shot', description: 'Close-up details' },
    { name: 'room', label: 'Room Setting', description: 'In bedroom context' },
    { name: 'assembly', label: 'Assembly', description: 'Construction details' }
  ];

  // Generate Cloudinary URLs with flexible dimensions
  const generateImageUrl = (options: Record<string, string | string[]>, viewIndex: number): string => {
    const view = viewAngles[viewIndex];
    const safeView = view.name || 'front';
    
    // Get safe values with fallbacks
    const safeMaterial = (options.material as string) || 'rubberwood';
    const safeFinish = (options.finishColour as string) || 'natural';
    
    // Build path based on product type
    let cloudinaryPath: string;
    if (productId === 'bedframe') {
      const safeSize = (options.size as string) || 'queen';
      const safeHeadboard = (options.headboard as string) || 'panel';
      cloudinaryPath = `${CLOUDINARY_CONFIG.folder}/${safeMaterial}/${safeFinish}/${safeSize}/${safeHeadboard}/${safeView}`;
    } else if (productId === 'kitchen') {
      const safeCountertop = (options.countertop as string) || 'quartz';
      cloudinaryPath = `${CLOUDINARY_CONFIG.folder}/${safeMaterial}/${safeFinish}/${safeCountertop}/${safeView}`;
    } else {
      // For other products, use simpler structure
      cloudinaryPath = `${CLOUDINARY_CONFIG.folder}/${safeMaterial}/${safeFinish}/${safeView}`;
    }
    
    // Use flexible transformations - no fixed dimensions
    const imageUrl = `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.transformations}/${cloudinaryPath}.webp`;
    
    // Check if this specific combination has failed before
    if (imageLoadErrors.has(imageUrl)) {
      return generateFallbackUrl(options, viewIndex, imageUrl);
    }
    
    return imageUrl;
  };

  // Enhanced fallback with proper aspect ratio
  const generateFallbackUrl = (options: Record<string, string | string[]>, viewIndex: number, attemptedUrl: string): string => {
    const view = viewAngles[viewIndex];
    
    const colorMap: Record<string, string> = {
      natural: 'D2B48C',
      coal: '36454F', 
      honey: 'FDB813',
      white: 'F8F8FF'
    };
    
    const safeMaterial = (options.material as string) || 'rubberwood';
    const safeFinish = (options.finishColour as string) || 'natural';
    
    const bgColor = colorMap[safeFinish] || 'D2B48C';
    const textColor = ['natural', 'honey', 'white'].includes(safeFinish) ? '000000' : 'FFFFFF';
    
    const materialName = safeMaterial.charAt(0).toUpperCase() + safeMaterial.slice(1);
    const finishName = safeFinish.charAt(0).toUpperCase() + safeFinish.slice(1);
    
    // Build expected path based on product type
    let expectedPath: string;
    let productName: string;
    
    if (productId === 'bedframe') {
      const safeSize = (options.size as string) || 'queen';
      const safeHeadboard = (options.headboard as string) || 'panel';
      const sizeName = safeSize.charAt(0).toUpperCase() + safeSize.slice(1);
      const headboardName = safeHeadboard.charAt(0).toUpperCase() + safeHeadboard.slice(1);
      expectedPath = `${CLOUDINARY_CONFIG.folder}/${safeMaterial}/${safeFinish}/${safeSize}/${safeHeadboard}/${view.name}`;
      productName = `${materialName} ${sizeName} Bed`;
    } else if (productId === 'kitchen') {
      const safeCountertop = (options.countertop as string) || 'quartz';
      const countertopName = safeCountertop.charAt(0).toUpperCase() + safeCountertop.slice(1);
      expectedPath = `${CLOUDINARY_CONFIG.folder}/${safeMaterial}/${safeFinish}/${safeCountertop}/${view.name}`;
      productName = `${materialName} Kitchen`;
    } else {
      expectedPath = `${CLOUDINARY_CONFIG.folder}/${safeMaterial}/${safeFinish}/${view.name}`;
      productName = `${materialName} ${product?.name || 'Product'}`;
    }
    
    const placeholderText = [
      productName,
      `${finishName} Finish`,
      `${view.label}`,
      ``,
      `📤 Upload to Cloudinary as:`,
      `Public ID: ${expectedPath}`,
      `Format: .webp`
    ].join('%0A');
    
    // Use a more realistic furniture aspect ratio for placeholders
    return `https://via.placeholder.com/1600x1200/${bgColor}/${textColor}?text=${encodeURIComponent(placeholderText)}`;
  };

  // Generate all image variations
  const images = viewAngles.map((view, index) => {
    const url = generateImageUrl(selectedOptions, index);
    const expectedPublicId = url.split('/').slice(-2).join('/').replace('.webp', '');
    
    return {
      url: url,
      view: view.name,
      label: view.label,
      description: view.description,
      cloudinaryPath: `${expectedPublicId}.webp`,
      fullCloudinaryUrl: url,
      expectedPublicId: expectedPublicId,
      isAvailable: !imageLoadErrors.has(url)
    };
  });

  // Handle image load errors with detailed logging
  const handleImageError = (url: string, index: number) => {
    console.log(`❌ Image failed to load: ${url}`);
    console.log(`📋 Expected Public ID: ${images[index]?.expectedPublicId}`);
    setImageLoadErrors(prev => new Set([...prev, url]));
  };

  // Handle successful image loads
  const handleImageLoad = (url: string) => {
    console.log(`✅ Image loaded successfully: ${url}`);
    setImageLoadErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(url);
      return newSet;
    });
  };

  useEffect(() => {
    setCurrentImageIndex(0);
    setImageLoadErrors(new Set());
  }, [selectedOptions]);

  useEffect(() => {
    images.forEach((image, index) => {
      const img = new Image();
      img.onload = () => {
        console.log(`✅ Preloaded: ${image.expectedPublicId}`);
        handleImageLoad(image.url);
      };
      img.onerror = () => {
        console.log(`❌ Failed to preload: ${image.expectedPublicId}`);
        handleImageError(image.url, index);
      };
      img.src = image.url;
    });
  }, [images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [images.length]);

  const handlePrevious = (): void => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNext = (): void => {
    setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  const handleThumbnailClick = (index: number): void => {
    setCurrentImageIndex(index);
  };

  const getConfigSummary = (): string => {
    const formatName = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    
    const safeMaterial = (selectedOptions.material as string) || 'rubberwood';
    const safeFinish = (selectedOptions.finishColour as string) || 'natural';
    
    const parts = [formatName(safeMaterial)];
    
    if (productId === 'bedframe') {
      const safeSize = (selectedOptions.size as string) || 'queen';
      const safeHeadboard = (selectedOptions.headboard as string) || 'panel';
      const safeBedframeBody = (selectedOptions.bedframeBody as string) || 'platform';
      
      parts.push(
        formatName(safeSize),
        'Bed',
        '-',
        formatName(safeFinish),
        'Finish',
        '-',
        formatName(safeHeadboard),
        'Headboard',
        '-',
        formatName(safeBedframeBody),
        'Base'
      );
    } else if (productId === 'kitchen') {
      const safeCountertop = (selectedOptions.countertop as string) || 'quartz';
      
      parts.push(
        'Kitchen',
        '-',
        formatName(safeFinish),
        'Finish',
        '-',
        formatName(safeCountertop),
        'Countertop'
      );
    } else {
      parts.push(
        product?.name || 'Product',
        '-',
        formatName(safeFinish),
        'Finish'
      );
    }
    
    return parts.join(' ');
  };

  const getDetailedConfig = () => {
    const formatName = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    
    const safeMaterial = (selectedOptions.material as string) || 'rubberwood';
    const safeFinish = (selectedOptions.finishColour as string) || 'natural';
    
    const config: Record<string, string> = {
      material: formatName(safeMaterial),
      finish: formatName(safeFinish)
    };
    
    if (productId === 'bedframe') {
      const safeSize = (selectedOptions.size as string) || 'queen';
      const safeHeadboard = (selectedOptions.headboard as string) || 'panel';
      const safeBedframeBody = (selectedOptions.bedframeBody as string) || 'platform';
      
      config.size = formatName(safeSize);
      config.headboard = formatName(safeHeadboard);
      config.base = formatName(safeBedframeBody);
    } else if (productId === 'kitchen') {
      const safeCountertop = (selectedOptions.countertop as string) || 'quartz';
      config.countertop = formatName(safeCountertop);
    }
    
    return config;
  };

      return (
        <div className="flex flex-col h-full lg:min-h-0">
          {/* Product Title Header */}
          <div className="p-4 lg:p-6 border-b border-border bg-card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">Custom {product?.name || 'Product'}</h1>
                <p className="text-sm lg:text-base text-muted-foreground mt-1">{getConfigSummary()}</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs lg:text-sm text-muted-foreground">Starting from</div>
                <div className="text-lg lg:text-xl font-bold text-orange-500">$1,299</div>
              </div>
            </div>
          </div>

          {/* Main Image Display Area */}
          <div className="flex-1 relative bg-background">
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-secondary/40">
              <img
                src={images[currentImageIndex].url}
                alt={`Hessen ${product?.name || 'Product'} - ${images[currentImageIndex].label}`}
                className="max-w-full max-h-full object-contain transition-all duration-300 hover:scale-105"
                loading="eager"
                onError={() => handleImageError(images[currentImageIndex].url, currentImageIndex)}
                onLoad={() => handleImageLoad(images[currentImageIndex].url)}
              />
            </div>

            {/* View Label */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-background/90 text-foreground border border-border shadow-lg backdrop-blur-sm">
                <div className="text-center">
                  <p className="font-medium text-sm">{images[currentImageIndex].label}</p>
                  <p className="text-xs text-muted-foreground">{images[currentImageIndex].description}</p>
                </div>
              </Badge>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-4 right-4">
              <Badge variant={images[currentImageIndex].isAvailable ? "default" : "destructive"} className="shadow-lg">
                {images[currentImageIndex].isAvailable ? 'Available' : 'Missing'}
              </Badge>
            </div>

            {/* Navigation Arrows */}
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg hover:scale-110 transition-all duration-200 border-border"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg hover:scale-110 transition-all duration-200 border-border"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="bg-background/90 text-foreground border border-border shadow-lg backdrop-blur-sm">
                {currentImageIndex + 1} of {images.length}
              </Badge>
            </div>
          </div>
      
          {/* View Controls at Bottom */}
          <div className="p-3 lg:p-4 border-t border-border bg-card">
            {/* Action Buttons - Hidden on mobile */}
            <div className="hidden lg:flex items-center justify-center gap-4 mb-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Screenshot
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Fullscreen
              </Button>
            </div>

            {/* View Angle Controls */}
            <div className="flex items-center justify-center gap-1 lg:gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <Button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  variant="ghost"
                  size="sm"
                  className={`relative w-10 h-6 lg:w-12 lg:h-8 rounded transition-all duration-200 p-0 flex-shrink-0 ${
                    currentImageIndex === index
                      ? 'bg-orange-500/20 border border-orange-500/50'
                      : 'bg-secondary/50 hover:bg-secondary/80'
                  }`}
                  aria-label={`View ${image.label}`}
                  title={image.isAvailable ? `${image.label}` : `Missing: ${image.expectedPublicId}`}
                >
                  <div className={`w-5 h-3 lg:w-6 lg:h-4 rounded-sm ${
                    image.isAvailable ? 'bg-foreground/20' : 'bg-red-500/20'
                  }`}></div>
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-orange-500/10 rounded"></div>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Debug Panel - Hidden by default in production */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="border border-border shadow-sm bg-secondary/20">
              <CardContent className="p-3">
                <details>
                  <summary className="cursor-pointer font-medium text-muted-foreground text-sm hover:text-foreground">
                    🔧 Debug Information
                  </summary>
                  <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>Current Image:</strong> {images[currentImageIndex].expectedPublicId}</p>
                        <p><strong>Status:</strong> {images[currentImageIndex].isAvailable ? '✅ Available' : '❌ Missing'}</p>
                      </div>
                      <div>
                        <p><strong>Transformations:</strong> {CLOUDINARY_CONFIG.transformations}</p>
                        <p><strong>Total Images:</strong> {images.length}</p>
                      </div>
                    </div>
                  </div>
                </details>
              </CardContent>
            </Card>
          )}
    </div>
  );
};

export default ProductGallery;

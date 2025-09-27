'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSavedConfigurations } from '@/hooks/useSavedConfigurations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Heart, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Bed,
  ChefHat,
  Square
} from 'lucide-react';

const productTypeIcons = {
  bedframe: Bed,
  kitchen: ChefHat,
  sideboard: Square,
};

const productTypeLabels = {
  bedframe: 'Bedframe',
  kitchen: 'Kitchen',
  sideboard: 'Sideboard',
};

export default function MySavedConfigurePage() {
  const { configurations, updateConfiguration, removeConfiguration } = useSavedConfigurations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleEditStart = (config: any) => {
    setEditingId(config.id);
    setEditName(config.name);
  };

  const handleEditSave = (id: string) => {
    updateConfiguration(id, { name: editName });
    setEditingId(null);
    setEditName('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName('');
  };

  const getConfigurationSummary = (config: any) => {
    const { material, size, finishColour, headboard, bedframeBody } = config.configuration;
    return `${material} ${size} - ${finishColour} Finish - ${headboard} Headboard`;
  };

  if (configurations.length === 0) {
    return (
      <div className="container mx-auto p-4 lg:p-8 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="bg-card border-border shadow w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">No Saved Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Save your favorite furniture configurations to easily access and modify them later.
            </p>
            <Link href="/">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Start Configuring
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Saved Configure</h1>
          <p className="text-muted-foreground mt-1">
            Manage your saved furniture configurations ({configurations.length} saved)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configurations.map((config) => {
          const IconComponent = productTypeIcons[config.productType];
          
          return (
            <Card key={config.id} className="bg-card border-border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-orange-500" />
                    <Badge variant="secondary" className="text-xs">
                      {productTypeLabels[config.productType]}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStart(config)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeConfiguration(config.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {editingId === config.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Configuration name"
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleEditSave(config.id)}
                        className="h-6 px-2 text-xs bg-orange-600 hover:bg-orange-700"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCancel}
                        className="h-6 px-2 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {config.name}
                  </CardTitle>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Configuration:</p>
                    <p className="text-sm text-foreground font-medium">
                      {getConfigurationSummary(config)}
                    </p>
                  </div>
                  
                  <Separator className="bg-border" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created: {config.createdAt.toLocaleDateString()}</span>
                    <span>Updated: {config.updatedAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Link href={`/?config=${config.id}`} className="flex-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs border-border hover:border-border/80"
                      >
                        Load & Edit
                      </Button>
                    </Link>
                    <Link href={`/?config=${config.id}&addToCart=true`} className="flex-1">
                      <Button 
                        size="sm" 
                        className="w-full text-xs bg-orange-600 hover:bg-orange-700"
                      >
                        Add to Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

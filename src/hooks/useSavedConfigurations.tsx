'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { ProductConfiguration } from '@/shared/types/ecommerce';

export interface SavedConfiguration {
  id: string;
  name: string;
  productType: 'bedframe' | 'kitchen' | 'sideboard';
  configuration: ProductConfiguration;
  createdAt: Date;
  updatedAt: Date;
}

interface SavedConfigurationsContextType {
  configurations: SavedConfiguration[];
  addConfiguration: (config: Omit<SavedConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConfiguration: (id: string, config: Partial<SavedConfiguration>) => void;
  removeConfiguration: (id: string) => void;
  getConfigurationsByType: (productType: 'bedframe' | 'kitchen' | 'sideboard') => SavedConfiguration[];
}

const SavedConfigurationsContext = createContext<SavedConfigurationsContextType | undefined>(undefined);

export const SavedConfigurationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [configurations, setConfigurations] = useState<SavedConfiguration[]>([]);

  // Load configurations from localStorage on mount
  useEffect(() => {
    const savedConfigs = localStorage.getItem('savedConfigurations');
    if (savedConfigs) {
      try {
        const parsed = JSON.parse(savedConfigs);
        // Convert date strings back to Date objects
        const configsWithDates = parsed.map((config: any) => ({
          ...config,
          createdAt: new Date(config.createdAt),
          updatedAt: new Date(config.updatedAt),
        }));
        setConfigurations(configsWithDates);
      } catch (error) {
        console.error('Error loading saved configurations:', error);
      }
    }
  }, []);

  // Save configurations to localStorage whenever configurations change
  useEffect(() => {
    localStorage.setItem('savedConfigurations', JSON.stringify(configurations));
  }, [configurations]);

  const addConfiguration = (config: Omit<SavedConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newConfig: SavedConfiguration = {
      ...config,
      id: `config-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConfigurations(prev => [...prev, newConfig]);
  };

  const updateConfiguration = (id: string, updates: Partial<SavedConfiguration>) => {
    setConfigurations(prev =>
      prev.map(config =>
        config.id === id
          ? { ...config, ...updates, updatedAt: new Date() }
          : config
      )
    );
  };

  const removeConfiguration = (id: string) => {
    setConfigurations(prev => prev.filter(config => config.id !== id));
  };

  const getConfigurationsByType = (productType: 'bedframe' | 'kitchen' | 'sideboard') => {
    return configurations.filter(config => config.productType === productType);
  };

  return (
    <SavedConfigurationsContext.Provider
      value={{
        configurations,
        addConfiguration,
        updateConfiguration,
        removeConfiguration,
        getConfigurationsByType,
      }}
    >
      {children}
    </SavedConfigurationsContext.Provider>
  );
};

export const useSavedConfigurations = () => {
  const context = useContext(SavedConfigurationsContext);
  if (context === undefined) {
    throw new Error('useSavedConfigurations must be used within a SavedConfigurationsProvider');
  }
  return context;
};

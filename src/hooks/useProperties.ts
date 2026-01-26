import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DbProperty, Property, transformDbPropertyToUi } from '@/types/property';

interface UsePropertiesOptions {
  state?: string;
  county?: string;
  minAcres?: number;
  maxAcres?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: string;
  featured?: boolean;
}

interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProperties(options: UsePropertiesOptions = {}): UsePropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.state && options.state !== 'all') {
        query = query.eq('state', options.state);
      }

      if (options.county && options.county !== 'all') {
        query = query.eq('county', options.county);
      }

      if (options.minAcres) {
        query = query.gte('size', options.minAcres);
      }

      if (options.maxAcres) {
        query = query.lte('size', options.maxAcres);
      }


      if (options.minPrice) {
        query = query.gte('price', options.minPrice);
      }

      if (options.maxPrice) {
        query = query.lte('price', options.maxPrice);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.featured !== undefined) {
        query = query.eq('is_featured', options.featured);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      // Transform database properties to UI properties
      let transformedProperties = (data as DbProperty[]).map(transformDbPropertyToUi);

      // Apply text search filter (client-side for flexibility)
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        transformedProperties = transformedProperties.filter(
          (p) =>
            p.title.toLowerCase().includes(searchLower) ||
            p.city.toLowerCase().includes(searchLower) ||
            p.state.toLowerCase().includes(searchLower) ||
            p.county.toLowerCase().includes(searchLower)
        );
      }

      setProperties(transformedProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [
    options.state,
    options.county,
    options.minAcres,
    options.maxAcres,
    options.minPrice,
    options.maxPrice,
    options.search,
    options.status,
    options.featured,
  ]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
  };
}

// Hook to fetch a single property by ID
export function useProperty(id: string | undefined): {
  property: Property | null;
  loading: boolean;
  error: string | null;
} {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (queryError) {
          throw queryError;
        }

        if (data) {
          setProperty(transformDbPropertyToUi(data as DbProperty));
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
}

// Function to increment property views
export async function incrementPropertyViews(propertyId: string): Promise<void> {
  try {
    // Use RPC to increment views atomically, or fallback to update
    const { error } = await supabase.rpc('increment_property_views', { property_id: propertyId });
    
    if (error) {
      // If RPC doesn't exist, try direct update
      const { data: currentData } = await supabase
        .from('properties')
        .select('views')
        .eq('id', propertyId)
        .single();
      
      const currentViews = currentData?.views || 0;
      
      await supabase
        .from('properties')
        .update({ views: currentViews + 1 })
        .eq('id', propertyId);
    }
  } catch (err) {
    console.error('Error incrementing views:', err);
  }
}


export async function getPropertyStates(): Promise<string[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('state');

  if (error) {
    console.error('Error fetching states:', error);
    return [];
  }

  const states = [...new Set(data.map((p) => p.state).filter(Boolean))].sort();
  return states;
}

// Function to get all unique counties from properties
export async function getPropertyCounties(state?: string): Promise<string[]> {
  let query = supabase
    .from('properties')
    .select('county');

  if (state && state !== 'all') {
    query = query.eq('state', state);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching counties:', error);
    return [];
  }

  const counties = [...new Set(data.map((p) => p.county).filter(Boolean))].sort();
  return counties;
}

import React, { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
}

const AddressAutocomplete = ({ value, onChange }: AddressAutocompleteProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadGoogleMapsScript = async () => {
      if (!isMounted) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Get API key from Supabase
        const { data: apiKey, error: secretError } = await supabase.rpc('get_secret', {
          secret_name: 'GOOGLE_PLACES_API_KEY'
        });

        if (secretError) {
          console.error('Error fetching API key:', secretError);
          throw new Error('Failed to load API key');
        }

        if (!apiKey) {
          console.error('No API key found');
          throw new Error('Google Places API key not found');
        }

        // Check if script is already loaded
        if (window.google?.maps) {
          await initializeAutocomplete();
          return;
        }

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onerror = () => {
          if (isMounted) {
            setError('Failed to load Google Maps script');
            toast.error('Failed to load address lookup service');
          }
        };

        script.onload = async () => {
          if (isMounted) {
            try {
              await initializeAutocomplete();
            } catch (error) {
              console.error('Error initializing autocomplete:', error);
              setError('Failed to initialize address lookup');
              toast.error('Failed to initialize address lookup service');
            }
          }
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        if (isMounted) {
          setError('Failed to initialize address lookup');
          toast.error('Failed to load address lookup service. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const initializeAutocomplete = async () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      try {
        // Clean up previous instance if it exists
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address']
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.formatted_address) {
            onChange(place.formatted_address);
          }
        });
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
        throw new Error('Failed to initialize address lookup');
      }
    };

    loadGoogleMapsScript();

    return () => {
      isMounted = false;
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []); // Empty dependency array since we only want to load once

  return (
    <div className="space-y-2">
      <Label htmlFor="address">Address</Label>
      <Input
        ref={inputRef}
        id="address"
        name="address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isLoading ? "Loading address service..." : "Start typing your address"}
        disabled={isLoading}
        className={error ? "border-red-500" : ""}
        required
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
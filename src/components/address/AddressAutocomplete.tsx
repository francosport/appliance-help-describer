import React, { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
}

const AddressAutocomplete = ({ value, onChange }: AddressAutocompleteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;

    const loadGooglePlaces = async () => {
      try {
        const { data: apiKey, error: secretError } = await supabase.rpc('get_secret', {
          secret_name: 'GOOGLE_PLACES_API_KEY'
        });
        
        if (secretError) {
          console.error('Error fetching API key:', secretError);
          setError('Failed to load address autocomplete service');
          setIsLoading(false);
          return;
        }
        
        if (!apiKey) {
          setError('Google Places API key not configured');
          setIsLoading(false);
          return;
        }

        // Create and load the script
        scriptElement = document.createElement('script');
        scriptElement.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        scriptElement.async = true;
        
        const loadScript = new Promise<void>((resolve, reject) => {
          scriptElement!.onload = () => {
            initAutocomplete();
            setIsLoading(false);
            resolve();
          };
          scriptElement!.onerror = () => {
            setError('Failed to load Google Maps service');
            setIsLoading(false);
            reject();
          };
        });

        document.head.appendChild(scriptElement);
        await loadScript;
      } catch (err) {
        console.error('Error loading Google Places:', err);
        setError('Failed to initialize address autocomplete');
        setIsLoading(false);
      }
    };

    // Only load if the script isn't already loaded
    if (!window.google?.maps?.places) {
      loadGooglePlaces();
    } else {
      setIsLoading(false);
      initAutocomplete();
    }

    return () => {
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    try {
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
      console.error('Error initializing Google Places Autocomplete:', error);
      setError('Failed to initialize address autocomplete');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="address">Address</Label>
      <Input
        ref={inputRef}
        id="address"
        name="address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isLoading ? "Loading..." : "Enter your address"}
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
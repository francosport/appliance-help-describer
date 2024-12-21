import React, { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
}

const AddressAutocomplete = ({ value, onChange }: AddressAutocompleteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeGooglePlaces = async () => {
      try {
        // Get API key from Supabase
        const { data: apiKey, error: secretError } = await supabase.rpc('get_secret', {
          secret_name: 'GOOGLE_PLACES_API_KEY'
        });

        if (secretError || !apiKey) {
          console.error('Error fetching API key:', secretError);
          setError('Failed to load address autocomplete service');
          setIsLoading(false);
          return;
        }

        // Check if script is already loaded
        const existingScript = document.getElementById('google-places-script');
        if (existingScript) {
          initAutocomplete();
          setIsLoading(false);
          return;
        }

        // Create and load script
        const script = document.createElement('script');
        script.id = 'google-places-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        
        script.onload = () => {
          initAutocomplete();
          setIsLoading(false);
        };

        script.onerror = () => {
          setError('Failed to load Google Maps service');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error('Error initializing Google Places:', err);
        setError('Failed to initialize address autocomplete');
        setIsLoading(false);
      }
    };

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        }
      });
    };

    if (!window.google?.maps?.places) {
      initializeGooglePlaces();
    } else {
      setIsLoading(false);
      initAutocomplete();
    }
  }, [onChange]);

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
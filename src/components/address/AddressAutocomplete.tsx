import React, { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
}

const AddressAutocomplete = ({ value, onChange }: AddressAutocompleteProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const loadGooglePlaces = async () => {
      try {
        const { data: { secret }, error } = await supabase.rpc('get_secret', {
          name: 'GOOGLE_PLACES_API_KEY'
        });
        
        if (error) throw error;
        
        if (secret) {
          setApiKey(secret);
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${secret}&libraries=places`;
          script.async = true;
          script.onload = initAutocomplete;
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error loading Google Places:', error);
      }
    };

    loadGooglePlaces();
  }, []);

  const initAutocomplete = () => {
    if (inputRef.current && window.google) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        }
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="address">Address</Label>
      <input
        ref={inputRef}
        id="address"
        name="address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[40px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Enter your address"
        required
      />
    </div>
  );
};

export default AddressAutocomplete;
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const scriptLoadedRef = useRef(false);

  const initializeAutocomplete = () => {
    if (!inputRef.current) return;

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["address"], componentRestrictions: { country: "us" } }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        }
      });

      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error initializing autocomplete:", err);
      setError("Failed to initialize address autocomplete");
      setIsLoading(false);
    }
  };

  const loadGoogleMapsScript = async () => {
    try {
      // Fetch the API key using the get_secret function
      const { data, error: secretError } = await supabase.rpc('get_secret', {
        secret_name: 'GOOGLE_PLACES_API_KEY'
      });

      if (secretError) throw new Error(secretError.message);
      if (!data) throw new Error('Google Places API key not found');

      const apiKey = data;
      
      if (typeof window.google === "undefined") {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          scriptLoadedRef.current = true;
          initializeAutocomplete();
        };

        script.onerror = () => {
          setError("Failed to load Google Maps");
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } else {
        initializeAutocomplete();
      }
    } catch (err) {
      console.error("Error loading Google Maps:", err);
      setError("Failed to load address autocomplete");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!scriptLoadedRef.current) {
      loadGoogleMapsScript();
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="address">Service Address</Label>
      <Input
        ref={inputRef}
        id="address"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your address"
        className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
        disabled={isLoading}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default AddressAutocomplete;
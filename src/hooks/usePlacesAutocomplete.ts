import { useEffect, useRef } from "react";

interface UsePlacesAutocompleteProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onPlaceSelect: (address: string) => void;
  isScriptLoaded: boolean;
}

export const usePlacesAutocomplete = ({
  inputRef,
  onPlaceSelect,
  isScriptLoaded,
}: UsePlacesAutocompleteProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!isScriptLoaded || !inputRef.current) {
      console.log("[Places Autocomplete] Not ready:", { 
        isScriptLoaded, 
        hasInputRef: !!inputRef.current 
      });
      return;
    }

    try {
      console.log("[Places Autocomplete] Initializing...");
      const options = {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address", "address_components"]
      };

      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      console.log("[Places Autocomplete] Successfully initialized");

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        console.log("[Places Autocomplete] Place selected:", place);
        if (place?.formatted_address) {
          onPlaceSelect(place.formatted_address);
        } else {
          console.warn("[Places Autocomplete] No formatted address found in place object");
        }
      });

    } catch (err) {
      console.error("[Places Autocomplete] Error initializing:", err);
    }

    return () => {
      if (autocompleteRef.current) {
        console.log("[Places Autocomplete] Cleaning up listeners");
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isScriptLoaded, inputRef, onPlaceSelect]);
};
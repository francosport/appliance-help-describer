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
    if (!isScriptLoaded || !inputRef.current) return;

    try {
      console.log("Initializing autocomplete...");
      const options = {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address", "address_components"]
      };

      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        console.log("Place selected:", place);
        if (place?.formatted_address) {
          onPlaceSelect(place.formatted_address);
        } else {
          console.warn("No formatted address found in place object");
        }
      });

      console.log("Autocomplete initialized successfully");
    } catch (err) {
      console.error("Error initializing autocomplete:", err);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isScriptLoaded, inputRef, onPlaceSelect]);
};
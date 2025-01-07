import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";
import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoading, error, isScriptLoaded } = useGoogleMapsScript();

  usePlacesAutocomplete({
    inputRef,
    onPlaceSelect: onChange,
    isScriptLoaded,
  });

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
      {error && (
        <p className="text-red-500 text-sm">
          Error: {error}
        </p>
      )}
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading address autocomplete...
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
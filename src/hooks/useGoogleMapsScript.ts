import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useGoogleMapsScript = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadScript = async () => {
      try {
        if (typeof window.google !== "undefined") {
          setIsScriptLoaded(true);
          setIsLoading(false);
          return;
        }

        console.log("Fetching API key...");
        const { data: apiKey, error: secretError } = await supabase.rpc('get_secret', {
          secret_name: 'GOOGLE_PLACES_API_KEY'
        });

        if (secretError) {
          console.error("Error fetching API key:", secretError);
          throw new Error(secretError.message);
        }

        if (!apiKey) {
          console.error("No API key found");
          throw new Error('Google Places API key not found');
        }

        console.log("API key retrieved successfully");
        
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log("Google Maps script loaded successfully");
          setIsScriptLoaded(true);
          setIsLoading(false);
        };

        script.onerror = (e) => {
          console.error("Error loading Google Maps script:", e);
          setError("Failed to load Google Maps");
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error("Error in loadScript:", err);
        setError("Failed to load Google Maps script");
        setIsLoading(false);
      }
    };

    loadScript();
  }, []);

  return { isLoading, error, isScriptLoaded };
};
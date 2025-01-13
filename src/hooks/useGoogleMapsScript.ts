import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useGoogleMapsScript = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadScript = async () => {
      try {
        // Check if script is already loaded
        if (typeof window.google !== "undefined") {
          console.log("[Places API] Script already loaded");
          setIsScriptLoaded(true);
          setIsLoading(false);
          return;
        }

        console.log("[Places API] Starting to fetch API key...");
        
        // Add error handling for supabase client initialization
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const { data: apiKeyResponse, error: secretError } = await supabase.rpc('get_secret', {
          secret_name: 'GOOGLE_PLACES_API_KEY'
        });

        if (secretError) {
          console.error("[Places API] Error fetching API key:", secretError);
          throw new Error(`Failed to fetch Google Places API key: ${secretError.message}`);
        }

        if (!apiKeyResponse) {
          console.error("[Places API] API key response is null");
          throw new Error("Google Places API key not found. Please ensure it's set in Supabase secrets.");
        }

        const apiKey = apiKeyResponse;
        console.log("[Places API] Successfully retrieved API key");

        // Create and append script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        const scriptLoadPromise = new Promise((resolve, reject) => {
          script.onload = () => {
            console.log("[Places API] Script loaded successfully");
            resolve(true);
          };

          script.onerror = (e) => {
            console.error("[Places API] Script failed to load:", e);
            reject(new Error("Failed to load Google Maps script"));
          };
        });

        document.head.appendChild(script);
        console.log("[Places API] Script tag added to document head");

        await scriptLoadPromise;
        setIsScriptLoaded(true);
        setIsLoading(false);
        toast.success("Address autocomplete is ready!");

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load Google Maps";
        console.error("[Places API] Error in script loading:", errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        toast.error(`Address autocomplete error: ${errorMessage}`);
      }
    };

    loadScript();

    return () => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        console.log("[Places API] Cleaning up existing script");
        existingScript.remove();
      }
    };
  }, []);

  return { isLoading, error, isScriptLoaded };
};
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PersonalInfoSection from "./form-sections/PersonalInfoSection";
import ContactInfoSection from "./form-sections/ContactInfoSection";
import ApplianceInfoSection from "./form-sections/ApplianceInfoSection";

interface FormData {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  homePhone: string;
  otherPhone: string;
  email: string;
  address: string;
  applianceType: string;
  problem: string;
}

const ServiceRequestForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    mobilePhone: "",
    homePhone: "",
    otherPhone: "",
    email: "",
    address: "",
    applianceType: "",
    problem: "",
  });

  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "address" && value.length > 3) {
      const mockSuggestions = [
        value + " Street, City",
        value + " Avenue, City",
        value + " Road, City",
      ];
      setAddressSuggestions(mockSuggestions);
    }
  };

  const handleAddressSelect = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
    setAddressSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Map form data to Supabase table structure
      const supabaseData = {
        F_Name: formData.firstName,
        L_Name: formData.lastName,
        Mobile: parseFloat(formData.mobilePhone) || null,
        Work: parseFloat(formData.homePhone) || null,
        "Other Phone": parseFloat(formData.otherPhone) || null,
        "Email 1": formData.email,
        Address: formData.address,
        "Appliance Type": formData.applianceType,
        "Appliance Issue": formData.problem,
      };

      const { error } = await supabase
        .from("intake-test-customers")
        .insert([supabaseData]);

      if (error) throw error;

      toast.success("Service request submitted successfully!");
      
      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        mobilePhone: "",
        homePhone: "",
        otherPhone: "",
        email: "",
        address: "",
        applianceType: "",
        problem: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit service request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <PersonalInfoSection
              firstName={formData.firstName}
              lastName={formData.lastName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <ContactInfoSection
              mobilePhone={formData.mobilePhone}
              homePhone={formData.homePhone}
              otherPhone={formData.otherPhone}
              email={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Service Details</h3>
            <ApplianceInfoSection
              address={formData.address}
              addressSuggestions={addressSuggestions}
              applianceType={formData.applianceType}
              problem={formData.problem}
              onAddressChange={handleInputChange}
              onAddressSelect={handleAddressSelect}
              onApplianceTypeChange={(value) =>
                setFormData((prev) => ({ ...prev, applianceType: value }))
              }
              onProblemChange={handleInputChange}
            />
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-form-600 hover:bg-form-700 text-white transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </motion.div>
    </Card>
  );
};

export default ServiceRequestForm;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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

  const [step, setStep] = useState(1);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Simulate address lookup
    if (name === "address" && value.length > 3) {
      // This is where you'd normally call an address lookup API
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log("Form submitted:", formData);
    toast.success("Service request submitted successfully!");
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-1/4 rounded ${
                i <= step ? "bg-form-600" : "bg-form-200"
              } transition-colors duration-300`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="mobilePhone">Mobile Phone</Label>
                <Input
                  id="mobilePhone"
                  name="mobilePhone"
                  value={formData.mobilePhone}
                  onChange={handleInputChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homePhone">Home Phone</Label>
                <Input
                  id="homePhone"
                  name="homePhone"
                  value={formData.homePhone}
                  onChange={handleInputChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherPhone">Other Phone</Label>
                <Input
                  id="otherPhone"
                  name="otherPhone"
                  value={formData.otherPhone}
                  onChange={handleInputChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
                  required
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2 relative">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
                  required
                />
                {addressSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-form-200">
                    {addressSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-form-50 cursor-pointer transition-colors"
                        onClick={() => handleAddressSelect(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="applianceType">Appliance Type</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, applianceType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select appliance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refrigerator">Refrigerator</SelectItem>
                    <SelectItem value="washer">Washer</SelectItem>
                    <SelectItem value="dryer">Dryer</SelectItem>
                    <SelectItem value="dishwasher">Dishwasher</SelectItem>
                    <SelectItem value="oven">Oven</SelectItem>
                    <SelectItem value="microwave">Microwave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Description</Label>
                <textarea
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] p-3 rounded-md border border-form-200 focus:ring-2 focus:ring-form-400 focus:outline-none transition-all duration-200"
                  required
                />
              </div>
            </motion.div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="transition-all duration-200 hover:bg-form-100"
              >
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="ml-auto bg-form-600 hover:bg-form-700 text-white transition-all duration-200"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto bg-form-600 hover:bg-form-700 text-white transition-all duration-200"
              >
                Submit Request
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </Card>
  );
};

export default ServiceRequestForm;
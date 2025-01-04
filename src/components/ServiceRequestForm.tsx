import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import FormContainer from "./form/FormContainer";

const ServiceRequestForm = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <FormContainer />
      </motion.div>
    </Card>
  );
};

export default ServiceRequestForm;
import { motion } from "framer-motion";
import ServiceRequestForm from "@/components/ServiceRequestForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-form-50 to-form-100">
      <div className="container px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-form-800 mb-4">
            Appliance Repair Service
          </h1>
          <p className="text-form-600 max-w-2xl mx-auto">
            Please fill out the form below to request service for your appliance.
            We'll get back to you as soon as possible.
          </p>
        </motion.div>
        <ServiceRequestForm />
      </div>
    </div>
  );
};

export default Index;
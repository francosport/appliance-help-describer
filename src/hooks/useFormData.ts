import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  homePhone: string;
  otherPhone: string;
  email: string;
  address: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  mobilePhone: "",
  homePhone: "",
  otherPhone: "",
  email: "",
  address: "",
};

const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    setFormData,
    resetForm,
  };
};

export default useFormData;
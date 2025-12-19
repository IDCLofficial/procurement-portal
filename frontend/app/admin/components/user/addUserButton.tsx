'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCreateUserMutation } from '../../redux/services/adminApi';
import { UserForm } from './UserForm';
import { ResponseDialog } from './ResponseDialog';

export function AddUserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Desk officer',
    mda: '',
  });
  const [selectedMdaId, setSelectedMdaId] = useState<string | null>(null);

  const isValidNigerianNumber = (num: string) => {
    const regex = /^(?:0\d{10}|\+234\d{10})$/;
    return regex.test(num);
  };

  const isStrongPassword = (password: string) => {
    // At least one uppercase, one lowercase, and one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return regex.test(password);
  };

  const [formErrors, setFormErrors] = useState({
    passwordMatch: false,
    isValidnumber: false,
    passwordStrength: false,
  });

  const [createUser, { isLoading }] = useCreateUserMutation();

  const validateForm = () => {
    const passwordMatch = formData.password === formData.confirmPassword;
    const isValidnumber = isValidNigerianNumber(formData.phone);
    const passwordStrength = isStrongPassword(formData.password);
    setFormErrors({
      passwordMatch,
      isValidnumber,
      passwordStrength,
    });
    return passwordMatch && isValidnumber && passwordStrength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const requiresMda = formData.role === 'Desk officer';
    if (requiresMda && !selectedMdaId) {
      setResponseModal({
        open: true,
        title: "Error",
        message: "Please select an MDA from the list.",
      });
      return;
    }
    
    try {
      await createUser({
        fullName: formData.name,
        email: formData.email,
        phoneNo: formData.phone,
        role: formData.role,
        password: formData.password,
        mda: selectedMdaId ?? undefined,
      }).unwrap();
      
      // Reset form and close modal on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'Desk officer',
        mda: '',
      });
      setSelectedMdaId(null);

      setFormErrors({ passwordMatch: false, isValidnumber: false, passwordStrength: false });
      setIsOpen(false);
      
      // Optional: Show success message
      setResponseModal({
        open: true,
        title: "Success",
        message: "User created successfully!",
      });

    } catch (err) {
      let message = "Failed to create user";

      if (err && typeof err === 'object' && 'status' in err) {
        const fetchError = err as {
          status: number;
          data?: {
            message?: string;
            error?: string;
            statusCode?: number;
          };
        };

        if (fetchError.data?.message) {
          message = fetchError.data.message;
        }
      }

      setResponseModal({
        open: true,
        title: "Error",
        message,
      });
    }
  };

  const [responseModal, setResponseModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedForm = { ...prev, [name]: value };
      const newErrors = { ...formErrors }; // Keep existing errors

      // Validate passwords match
      if (name === 'password' || name === 'confirmPassword') {
        newErrors.passwordMatch = updatedForm.password === updatedForm.confirmPassword;
      }

      // Validate password strength
      if (name === 'password') {
        newErrors.passwordStrength = isStrongPassword(updatedForm.password);
      }
      
      // Validate phone number
      if (name === 'phone') {
        newErrors.isValidnumber = isValidNigerianNumber(updatedForm.phone);
      }

      if (name === 'mda') {
        // User is typing, so clear any previously selected MDA id
        setSelectedMdaId(null);
      }

      setFormErrors(newErrors);
      return updatedForm;
    });
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 custom-green hover:bg-green-800"
      >
        <UserPlus className="h-4 w-4" />
        Add User
      </Button>

      {isOpen && (
        <UserForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
          // isValidNigerianNumber={isValidNigerianNumber}
          onMdaSelect={(id, name) => {
            setSelectedMdaId(id);
            setFormData(prev => ({ ...prev, mda: name }));
          }}
        />
      )}

      <ResponseDialog
        open={responseModal.open}
        title={responseModal.title}
        message={responseModal.message}
        onOpenChange={(open) => setResponseModal(prev => ({ ...prev, open }))}
      />
    </>
  );
}
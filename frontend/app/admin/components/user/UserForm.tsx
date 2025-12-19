import { useState, useMemo, ChangeEvent } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { InputField, SelectField } from './UserFormField';
import { useGetMdasQuery } from '@/app/admin/redux/services/settingsApi';
import { SearchableSelect } from '../SearchableSelect';

interface UserFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: string;
    mda: string;
  };
  formErrors: {
    passwordMatch: boolean;
    isValidnumber: boolean;
    passwordStrength: boolean;
  };
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onMdaSelect?: (id: string, name: string) => void;
}

export function UserForm({
  formData,
  formErrors,
  isLoading,
  onChange,
  onSubmit,
  onClose,
  onMdaSelect,
}: UserFormProps) {
  const roleOptions = [
    { value: 'Desk officer', label: 'Desk Officer' },
    { value: 'Auditor', label: 'Auditor' },
    { value: 'Registrar', label: 'Registrar' },
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: mdasResponse } = useGetMdasQuery({ page: 1, limit: 100 });

  // Transform MDAs to the format expected by SearchableSelect
  const mdaOptions = useMemo(() => {
    return (mdasResponse?.mdas || []).map((mda) => ({
      value: mda._id,
      label: mda.name,
    }));
  }, [mdasResponse]);

  const handleMdaSelect = (mdaId: string) => {
    const selectedMda = mdasResponse?.mdas?.find((mda) => mda._id === mdaId);
    if (selectedMda) {
      // Update the form data
      const syntheticEvent = {
        target: { 
          name: 'mda', 
          value: selectedMda.name,
          type: 'change'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      // Call both the form's onChange and onMdaSelect callbacks
      onChange(syntheticEvent);
      
      if (onMdaSelect) {
        onMdaSelect(selectedMda._id, selectedMda.name);
      }
    }
  };
  
  // Get the current MDA ID from the form data
  const selectedMdaId = mdasResponse?.mdas?.find(mda => mda.name === formData.mda)?._id || '';

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full md:max-w-[50%] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Add New User</h2>

        <form onSubmit={onSubmit} autoComplete="off" className="space-y-4">
          <InputField
            label="Full Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
          />
          <div className='flex flex-col md:flex-row space-x-4'>

            <div className='w-full'>

              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className='w-full'>

              <InputField
                label="Phone"
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={onChange}
                required
                error={formData.phone && !formErrors.isValidnumber ? 'Please enter a valid Nigerian phone number' : undefined}
              />
            </div>
          </div>
        <div className='flex flex-col md:flex-row space-x-4'>


             <div className='w-full'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={onChange}
                  required
                  minLength={6}
                  className={`w-full px-3 py-2 pr-10 border ${formData.password && !formErrors.passwordStrength ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && !formErrors.passwordStrength && (
                <p className="mt-1 text-sm text-red-600">
                  Password must contain at least one uppercase letter, one lowercase letter, and one number
                </p>
              )}
            </div>

             <div className='w-full'>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  required
                  minLength={6}
                  className={`w-full px-3 py-2 pr-10 border ${formData.confirmPassword && !formErrors.passwordMatch ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && !formErrors.passwordMatch && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>
          </div>
          <SelectField
            label="Role"
            id="role"
            name="role"
            value={formData.role}
            onChange={onChange}
            options={roleOptions}
          />
          <div>
            <label htmlFor="mda" className="block text-sm font-medium text-gray-700 mb-1">
              MDA
            </label>
            <SearchableSelect
              options={mdaOptions}
              value={selectedMdaId}
              onValueChange={handleMdaSelect}
              placeholder="Select an MDA"
              searchPlaceholder="Search MDAs..."
              emptyText="No MDAs found"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={
                isLoading ||
                !formErrors.passwordMatch ||
                !formErrors.isValidnumber ||
                !formErrors.passwordStrength
              }
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Creating...
                </>
              ) : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

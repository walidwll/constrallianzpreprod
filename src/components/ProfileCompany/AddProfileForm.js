'use client'
import { submitInviteRequest as submitInviteRequestContractor } from '@/lib/store/features/contractorSlice';
import { submitInviteRequest as submitInviteRequestSubContractor } from '@/lib/store/features/subContractorSlice';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ROLE_PERMISSIONS = {
  'director': ['director', 'manager', 'production', 'supervisor'],
  'manager': ['manager', 'production', 'supervisor'],
  'production': ['production', 'supervisor'],
  'supervisor': [],
  'SubManager':['SubManager', 'SubAdministrator'],
  'SubAdministrator':['SubManager', 'SubAdministrator']
};

const AddProfileForm = ({ currentRole, userId,companyId, isRP }) => {
  const dispatch = useDispatch();
  const inputClassName ="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
  const [error, setError] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    invitedBy:userId,
    companyId:companyId,
    isRP: false, // For directors
    addProject: false, // For production managers
  });
  const allowedRoles = ROLE_PERMISSIONS[currentRole] || [];

  useEffect(() => {
    if (allowedRoles.length === 0) {
      setError('You do not have permission to create profiles.');
    } else {
      setError('');
    }
  }, [allowedRoles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!formData.role) {
        alert('Please select a role to create.');
        return;
      }

    try {
        const submitInviteRequest = (currentRole === 'SubManager' || currentRole === 'SubAdministrator') ? submitInviteRequestSubContractor : submitInviteRequestContractor;
           dispatch(submitInviteRequest(formData)).then((action) => {
                if (submitInviteRequest.fulfilled.match(action)) {
                    setFormData({
                        first_name: '',
                        last_name: '',
                        email: '',
                        role: '',
                        invitedBy:userId,
                        companyId:companyId,
                        isRP: false, // For directors
                        addProject: false,
                    });
                router.push('/user/profile/profilcompany');
                }else {
                    setError(`Error: ${result.payload}`);
                }
            });
            } catch (error) {
                setError(`Error: ${error.message}`);
            } finally {
                setIsSubmitting(false);
            }
    console.log('Profile created:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-4 sm:py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg shadow-md" role="alert">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                    </div>
                )}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Create Profile</h2>
              <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-4">
                   <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1 sm:mb-2">First Name:</label>
                        <input
                          type="text"
                          name="first_name"
                          className={inputClassName} 
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                        />
                   </div>

                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Last Name:</label>
                        <input
                          type="text"
                          name="last_name"
                          className={inputClassName} 
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                        />
                    </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  className={inputClassName}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Role:</label>
                <select
                  name="role"
                  className={inputClassName} 
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled >Select Role</option>
                  {allowedRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Fields Based on Selected Role for Client */}
              {formData.role === 'director' && (
                <div className="flex items-center justify-center gap-4">
                <div className="w-auto">
                  <h3 className="text-lg font-medium text-gray-900">Is RP:</h3>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="isRP"
                    className="mt-2 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 checked:bg-green-600 checked:border-green-500"
                    checked={formData.isRP}
                    onChange={handleChange}
                  />
                </div>
                <div>
                <span className={`text-base font-medium ${formData.isRP ? 'text-blue-600' : 'text-gray-400'}`}>{formData.isRP ? 'Yes' : 'No'}</span>
                </div>
              </div>
              )}
              
              {formData.role === 'production' && (
                <div className="flex items-center justify-center gap-4">
                <div className="w-auto">
                  <h3 className="text-lg font-medium text-gray-900">Can Add Projects ?</h3>
                </div>
                <div>
                    <input
                      type="checkbox"
                      name="addProject"
                      className="mt-2 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 checked:bg-green-600 checked:border-green-500"
                      checked={formData.addProject}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                <span className={`text-base font-medium ${formData.addProject ? 'text-blue-600' : 'text-gray-400'}`}>{formData.addProject ? 'Yes' : 'No'}</span>
                </div>
                </div>
              )}
              {/* End Conditional Fields Based on Selected Role for Client */}
              {/* Conditional Fields Based on Selected Role for SubContractor */}
              {(currentRole === "SubManager" || (currentRole === "SubAdministrator" && formData.role != "SubManager")) && isRP && (
                <div className="flex items-center justify-center gap-4">
                <div className="w-auto">
                  <h3 className="text-lg font-medium text-gray-900">IS RP?</h3>
                </div>
                <div>
                    <input
                      type="checkbox"
                      name="addProject"
                      className="mt-2 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 checked:bg-green-600 checked:border-green-500"
                      checked={formData.addProject}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                <span className={`text-base font-medium ${formData.addProject ? 'text-blue-600' : 'text-gray-400'}`}>{formData.addProject ? 'Yes' : 'No'}</span>
                </div>
                </div>
              )}
              
              {/* End Conditional Fields Based on Selected Role for SubContractor */}
            <button
                type="submit"
                disabled={isSubmitting || allowedRoles.length === 0}
                className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">            
                {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    <span className="text-sm sm:text-base">Creating Profile...</span>
                                </>
                            ) : (
                                <span className="text-sm sm:text-base">Create Profile</span>
                            )}
            </button>
              </div>
            </form>
     </div>
    </div>
  );
};

export default AddProfileForm;

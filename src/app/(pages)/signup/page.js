'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import AuthLayout from '@/components/AuthLayout';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { saveAs } from 'file-saver';
import Link from 'next/link';

import {
    setStep,
    setType,
    updateEmployeeData,
    updateSubContractorData,
    signupUser,
} from '@/lib/store/features/authSlice';
import { fetchAllSubCompanies, fetchAdminDocuments, fetchAllActivities, fetchSubActivities } from '@/lib/store/features/subContractorSlice';
import SearchableDropdown from '@/components/Custom/Dropdown';
import { ChevronDown } from 'lucide-react';
import MultiSelectDropdown from '@/components/Custom/MultiSelect';
import Disponibilite from '@/components/Custom/Disponibility';


const RoleSelection = ({ setType, handleNextStep }) => (
    <div className="space-y-8 flex flex-col h-full">
        <div className="flex items-center">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                <FaArrowLeft className="text-xl" />
            </Link>
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-8">
            <label className="text-gray-800 text-2xl font-bold text-center">Choose Your Role</label>
            <div className="flex flex-col space-y-4 px-4">
                {['Employee', 'Sub-Contractor'].map((type) => (
                    <button
                        key={type}
                        type="button"
                        className="py-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-green-600 focus:outline-none text-lg font-semibold active:scale-95 transition-transform"
                        onClick={() => {
                            setType(type);
                            handleNextStep();
                        }}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <div className="text-center text-base text-gray-700">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
                    Login
                </Link>
            </div>
        </div>
    </div>
);

const Stepper = ({ steps, currentStep }) => (
    <div className="flex justify-between mb-6 px-4 max-w-screen-sm mx-auto">
        {steps.map((step, index) => (
            <div
                key={index}
                className={`flex-1 relative ${index !== steps.length - 1 ? 'after:content-[""] after:h-[2px] after:w-full after:absolute after:top-4 after:left-1/2 after:bg-gray-200' : ''}`}
            >
                <div className="flex flex-col items-center">
                    <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-white
                            ${index <= currentStep ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-300'}`}
                    >
                        {index + 1}
                    </div>
                    <div className={`mt-2 text-xs text-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                        {step}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const Step1 = ({ formData, setFormData, handleNextStep, type, imageFile, setImageFile, handlePrevStep }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const [emailError, setemailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");

    useEffect(() => {
        const { first_name,last_name,phone, email, password,prefix } = formData;
        setIsValid(first_name && last_name && email && phone && password );
    }, [formData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleNext = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{6,16}$/;
        const password = formData.password;
        let isDataValid =true;
       
		if (!/^\d{9}$/.test(formData.phone)) {
            isDataValid = false;
          setPhoneError("Phone number must be exactly 9 digits.");
		}
		
        if(!formData.prefix){
            setFormData({ ...formData, prefix: "+34"});
        }

        if (!emailRegex.test(formData.email)) {
          setemailError("Please enter a valid email address.");
          isDataValid=false;
        }  
        
        if (!passwordRegex.test(password)) {
            setPasswordError(
                "Password must be at least 8 characters long,\n" +
                "\t• include an uppercase letter,\n" +
                "\t• a lowercase letter,\n" +
                "\t• a number, and\n" +
                "\t• a special character."
              );
            isDataValid=false;        
        }

        if (isDataValid){
        setPhoneError("");
        setPasswordError("");
        setemailError("");
        handleNextStep();
        }
        
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                <label htmlFor="image" className="cursor-pointer">
                    <div className="relative w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden">
                        {imagePreview ? (
                            <img
                                src={imagePreview }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Upload
                            </div>
                        )}
                    </div>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </label>
            </div>
            <div className="flex gap-4">
            <div className="flex-1">
                <label htmlFor="first_name" className="text-gray-700">
                    First Name
                </label>
                <input
                    id="first_name"
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
            </div>

            <div className="flex-1">
                <label htmlFor="last_name" className="text-gray-700">
                    Last Name
                </label>
                <input
                    id="last_name"
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={formData.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
            </div>
            </div>

            <div className="flex flex-col gap-2">
            <label htmlFor="phone_number" className="text-gray-700">
                    Phone Number :
                </label>
                <div className="flex gap-4">
			   	<div className="w-1/4">
                <div className="relative">
			   	<select className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base pr-10"
                        name="prefix"  
                        value={formData.prefix || '+34'} 
                        onChange={(e) => setFormData({ ...formData, prefix: e.target.value })} >
			   	    <option value="+34" >🇪🇸 +34 </option>
			   		<option value="+33">🇫🇷 +33</option>
       		   		<option value="+44">🇬🇧 +44</option>
        	   		<option value="+49">🇩🇪 +49</option>
      		   	</select>
                     <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
					<ChevronDown className="w-4 h-4 text-gray-500" />
				</span>
                </div>
			   </div>
			   <div className="flex-1">
			   <input
			   	type="tel"
			   	name="phone"
			   	value={formData.phone || ''}
			   	onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)&& value.length <= 9) { setFormData({ ...formData, phone: e.target.value }); } }}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                 />
                 {phoneError && ( <p className="text-red-600 text-sm mt-1">{phoneError}</p> )}
			   </div>
               </div>
			   </div>
            <div>
                <label htmlFor="email" className="text-gray-700">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {emailError && ( <p className="text-red-600 text-sm mt-1">{emailError}</p> )}
            </div>
            <div>
                <label htmlFor="password" className="text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {passwordError && ( <p className="text-red-600 text-sm mt-1 whitespace-pre-line" > {passwordError} </p> )}
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/2 py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white bg-gray-300 hover:bg-gray-400 flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Previous
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className={`w-1/2 py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    disabled={!isValid}
                >
                    Next
                </button>
            </div>
            <div className="text-center text-sm text-gray-700">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-500">
                    Login
                </a>
            </div>
        </div>
    );
};


const Step2Employee = ({
    formData,
    setFormData,
    handlePrevStep,
    handleSubmit,
    subCompanies,
    cvFile,
    setCvFile,
    loading,
}) => {
    const dispatch = useAppDispatch();
    const [isValid, setIsValid] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const { phone, subCompanyId } = formData;
        setIsValid(phone && cvFile && subCompanyId);
    }, [formData, cvFile]);

    const handleCvChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCvFile(file);
        }
    };

    const handleRefreshSubCompanies = async () => {
        setRefreshing(true);
        await dispatch(fetchAllSubCompanies());
        setRefreshing(false);
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="phone" className="text-gray-700">
                    Phone
                </label>
                <input
                    id="phone"
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>
            <div>
                <label htmlFor="cv" className="text-gray-700">
                    CV
                </label>
                <input
                    id="cv"
                    type="file"
                    accept=".pdf"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    onChange={handleCvChange}
                />
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="subCompanyId" className="text-gray-700">
                        SubCompany
                    </label>
                    <button
                        type="button"
                        onClick={handleRefreshSubCompanies}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                        disabled={refreshing}
                    >
                        <svg
                            className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        {refreshing ? 'Refreshing...' : 'Refresh List'}
                    </button>
                </div>
                <SearchableDropdown
                    options={subCompanies}
                    value={formData.subCompanyId}
                    onChange={(selectedId) => setFormData({ ...formData, subCompanyId: selectedId })}
                    placeholder="Select SubCompany"
                    searchPlaceholder="Search SubCompany"
                />
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/2 py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Previous
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className={`w-1/2 py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!isValid || loading}
                >
                    {loading ? 'Loading...' : 'Create Account'}
                </button>
            </div>
        </div>
    );
};

const Step2SubContractor = ({
    formData,
    setFormData,
    handlePrevStep,
    handleNextStep,
}) => {
    const [isValid, setIsValid] = useState(false);
    const [idError, setIdError] = useState("");

    useEffect(() => {
        const { identity,address } = formData;
        setIsValid( identity?.number && address?.addressligne1 && address?.city && address?.postalCode && address?.country);
    }, [formData]);

    const handleNext = () => {
        let isDataValid = true;
        if (formData.identity?.number) {
            let identityRegex = null
            let identityType =""
            if(formData.identity?.type){
                 identityType = formData.identity?.type;
            }else{
                 identityType ="DNI"
                 setFormData({ ...formData, identity: "DNI"});
            }
      
        if (identityType === "DNI") {
            identityRegex = /^[0-9]{8}[A-Za-z]$/; // DNI format
          } else if (identityType === "NIE") {
            identityRegex = /^[A-Za-z][0-9]{7}[A-Za-z]$/; // NIE format
          } else if (identityType === "Other") {
            identityRegex = /.*/; // Allow any non-empty string for "Other"
        }
      
        if (identityRegex && !identityRegex.test(formData.identity?.number)) {
          isDataValid = false;
          setIdError( "Invalid identity number for the selected identity type.");
          }
         }

        if(isDataValid){
            setIdError("");
            handleNextStep();
        }

    };

    return(
        <div  className="space-y-4">
           <div>
           <label htmlFor="Identity" className="text-gray-700">
                    Identity
                </label>
              <div className="flex gap-4">
                <div className="w-1/4">
                <div className="relative">
		  	    <select 
                   name="identity_type" 
                   className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base pr-10"
                   value={formData.identity?.type || 'DNI'}
                   onChange={(e) => setFormData({ ...formData, identity: { ...formData.identity, type: e.target.value }, })}
                >
		  	        <option value="DNI" >DNI</option>
		  		    <option value="NIE">NIE</option>
                    <option value="Other">Other</option>
                </select>
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
					<ChevronDown className="w-4 h-4 text-gray-500" />
				</span>
                </div>
                </div>
                <div className="flex-1">
		  	 <input
		  		type="text"
		  		name="identity_number"
                required
		  		value={formData.identity?.number || ''}
		  		onChange={(e) => setFormData({ ...formData, identity: { ...formData.identity, number: e.target.value }, })}
		  		placeholder="identity number *"
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                {idError && ( <p className="text-red-600 text-sm mt-1 whitespace-pre-line" > {idError} </p> )}
		  	    </div>
              </div>
            </div>

             <div>
             <label htmlFor="companyPosition" className="text-gray-700">
                Company Position
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
				 <input
					type="text"
					name="companyPosition"
					value={formData.companyPosition || ''}
					onChange={(e) => setFormData({ ...formData, companyPosition: e.target.value })}
					placeholder="Position at company"
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    />
                  </div>
                </div>
              </div>

            <div>
				<h3 className="text-lg font-medium text-gray-900 mb-4">Address Details</h3>
				<div className="space-y-4">
					<input
						type="text"
						name="addressligne1"
                        required
						value={formData.address?.addressligne1 || ''}
						onChange={(e) => setFormData({ ...formData, address: { ...formData.address, addressligne1: e.target.value }, })}
						placeholder="Address Ligne 1 *"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
					<input
						type="text"
						name="addressComplementaire"
						value={formData.address?.addressComplementaire || ''}
						onChange={(e) => setFormData({ ...formData, address: { ...formData.address, addressComplementaire: e.target.value }, })}
						placeholder="Address Complementaire"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
					<div className="flex gap-4">
						<div className="flex-1">
					<input
						type="text"
						name="city"
                        required
						value={formData.address?.city || ''}
						onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value },})}
						placeholder="City *"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        /></div>
					<div className="w-1/3">
					<input
						type="text"
						name="postalCode"
                        required
						value={formData.address?.postalCode || ''}
						onChange={(e) => { const value = e.target.value; if (/^\d{0,5}$/.test(value)) { setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value }, }); } }}
						placeholder="Postal Code *"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
					</div>
					</div>
					<input
						type="text"
						name="country"
                        required
						value={formData.address?.country || ''}
						onChange={(e) => setFormData({ ...formData,  address: { ...formData.address, country: e.target.value }, })}
						placeholder="Country *"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
				</div>
			</div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/2 py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white bg-gray-300 hover:bg-gray-400 flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Previous
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className={`w-1/2 py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    disabled={!isValid}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

const Step3SubContractor = ({
    formData,
    setFormData,
    handlePrevStep,
    handleNextStep,
    loading,
    activities,
    subActivities,
}) => {
    const [isValid, setIsValid] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const { subCompany } = formData;
      
        // Check for base validation
        const isBaseValid =
          subCompany?.name &&
          subCompany?.CIFNumber &&
          subCompany?.speciality &&
          subCompany?.address?.addressligne1 &&
          subCompany?.address?.city &&
          subCompany?.address?.country &&
          subCompany?.address?.postalCode &&
          subCompany?.disponibility;
      
        // Check for additional conditions
        const isSpecialityValid =
          subCompany?.speciality !== "material" ||
          (subCompany?.activity && subCompany?.subActivities.length > 0);
      
        const isDisponibilityValid =
          subCompany?.disponibility !== "regional" ||
          (subCompany?.regions && subCompany?.regions.length > 0);
      
        // Set overall validity
        setIsValid(isBaseValid && isSpecialityValid && isDisponibilityValid);
      }, [formData]);
      

    const handleRefreshActivities = async () => {
        setRefreshing(true);
        await dispatch(fetchAllActivities());
        setRefreshing(false);
    };

    const handleRefreshSubActivities = async (activity) => {
        try {
            setRefreshing(true);

            // Find the activity object using the activity ID
            const selectedActivity = activities.find((act) => act._id === activity);    

            if (!selectedActivity) {
                console.error("Activity not found.");
                setRefreshing(false);
                return;
            }    

            const act_id = selectedActivity.id_Act;
            console.log("This is activity: " + act_id);    

            // Dispatch the action to fetch subactivities
            await dispatch(fetchSubActivities({ id: act_id }));
        } catch (error) {
            console.error("Error refreshing subactivities:", error);
        } finally {
            setRefreshing(false);
        }
    };
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
            <div className="flex-1">
                <label htmlFor="companyName" className="text-gray-700">
                    Company Name
                </label>
                <input
                    id="companyName"
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={formData.subCompany?.name || ''}
                    onChange={(e) => setFormData({ ...formData, subCompany: { ...formData.subCompany, name: e.target.value }, })}
                />
            </div>
            <div className="flex-1">
                <label htmlFor="CIFNumber" className="text-gray-700">
                Company CIF
                </label>
                <input
                    id="CIFNumber"
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={formData.subCompany?.CIFNumber || ''}
                    onChange={(e) => setFormData({ ...formData, subCompany: { ...formData.subCompany, CIFNumber: e.target.value }, })}
                />
            </div>
            </div>

            <div className="flex gap-4 ">
			<div className="w-1/8 flex items-center">
            <label htmlFor="speciality" className="text-gray-700">
                    Speciality 
                </label>
			</div>
			<div className="flex-1 relative">
			<select 
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                name="speciality" 
                onChange={(e) => setFormData({ ...formData, subCompany: { ...formData.subCompany, speciality: e.target.value},})} 
                value={formData.subCompany?.speciality || ""} 
            >
			    <option value="" disabled >Select your company speciality</option>
				<option value="employee">Intérim 👨🏻‍🏭</option>
				<option value="material">Material 🧱</option>
				<option value="machinery">Machinery 🏗️</option>
				</select>
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
				<ChevronDown className="w-4 h-4 text-gray-500" />
				</span>
			</div>
			</div>
           {/* Conditional Rendering for Activity and Sub Activity based on speciality */}
           {formData.subCompany?.speciality === "material" && (
             <>
            <div className="px-4 border rounded-lg shadow-sm">
                <div className="flex justify-between items-center mt-2 mb-2">
                    <label htmlFor="ActivityId" className="text-gray-700">
                    Activity
                    </label>
                    <button
                        type="button"
                        onClick={handleRefreshActivities}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                        disabled={refreshing}
                    >
                        <svg
                            className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        {refreshing ? 'Refreshing...' : 'Refresh List'}
                    </button>
                </div>
                <SearchableDropdown
                    options={activities}
                    value={formData.subCompany?.activity}
                    onChange={(ActivityId) => {setFormData({ ...formData, subCompany: { ...formData.subCompany, activity: ActivityId, subActivities: [], }, });handleRefreshSubActivities(ActivityId);}}
                    placeholder="Select activity"
                    searchPlaceholder="Search activity"
                />
            
            {/* Conditionally render Sub Activity based on selected Activity */}
            
            <div className={`relative ${!formData.subCompany?.activity ? 'pointer-events-none opacity-50' : ''} py-2`}>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="ActivityId" className="text-gray-700">
                    Sub Activity
                    </label>
            </div>
              <MultiSelectDropdown 
                 options={subActivities}
                 formData={formData}
                 setFormData={setFormData}
                 placeholder="Select Sub Activity"
                 searchPlaceholder="Search activity"
                />
            </div>
            </div>
            
            </>
            )}

            <div>
				<h3 className="text-lg font-medium text-gray-900 mb-4">Company Address Details</h3>
				<div className="space-y-4">
					<input
						type="text"
						name="addressligne1"
						value={formData.subCompany?.address?.addressligne1 || ''}
						onChange={(e) => setFormData({ ...formData, subCompany: { ...formData.subCompany, address: { ...formData.subCompany?.address, addressligne1: e.target.value, }, }, })}
						placeholder="Address Ligne 1 *"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
					<input
						type="text"
						name="addressComplementaire"
						value={formData.subCompany?.address?.addressComplementaire || ''}
						onChange={(e) => setFormData({ ...formData, subCompany: { ...formData.subCompany, address: { ...formData.subCompany?.address, addressComplementaire: e.target.value, }, }, })}
						placeholder="Address Complementaire"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
					<div className="flex gap-4">
						<div className="flex-1">
					<input
						type="text"
						name="city"
						value={formData.subCompany?.address?.city || ''}
						onChange={(e) => setFormData({ ...formData, subCompany: { ...formData.subCompany, address: { ...formData.subCompany?.address, city: e.target.value, }, }, })}
						placeholder="City *"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        /></div>
					<div className="w-1/3">
					<input
						type="text"
						name="postalCode"
						value={formData.subCompany?.address?.postalCode || ''}
						onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)) { setFormData({ ...formData, subCompany: { ...formData.subCompany, address: { ...formData.subCompany?.address, postalCode: e.target.value, }, }, }); } }}
						placeholder="Postal Code *"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
					</div>
					</div>
					<input
						type="text"
						name="country"
						value={formData.subCompany?.address?.country || ''}
						onChange={(e) => setFormData({ ...formData, subCompany: { ...formData.subCompany, address: { ...formData.subCompany?.address, country: e.target.value, }, }, })}
						placeholder="Country *"
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
				</div>
			</div>
            <div>
                <Disponibilite
                formData={formData}
                setFormData={setFormData}
                placeholder="Sélectionnez les régions"
                />
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/2 py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white bg-gray-300 hover:bg-gray-400 flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Previous
                </button>
                <button
                    type="button"
                    onClick={handleNextStep}
                    className={`w-1/2 py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    disabled={!isValid || loading}
                >
                    Next
                </button>
            </div>

        </div>
    );
};

const DocumentStep = ({
    formData,
    setFormData,
    handlePrevStep,
    handleSubmit,
    loading,
    documents,
    setDocuments
}) => {
    const adminDocuments = useAppSelector((state) => state.subContractor.adminDocuments);
    const [uploadValid, setUploadValid] = useState(false);

    useEffect(() => {
        // Check if all required documents are uploaded
        const hasRequired = documents.ownershipCertificate &&
            documents.agreement &&
            documents.privacyDocument &&
            documents.platformRegulation;
        setUploadValid(hasRequired);
    }, [documents]);

    const handleDocumentUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setDocuments(prev => ({
                ...prev,
                [type]: file
            }));
            setFormData({
                ...formData,
                documents: {
                    ...formData.documents,
                    [type]: file.name
                }
            });
        }
    };

    const downloadDocument = (url, filename) => {
        if (!url) return;

        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                saveAs(blob, filename);
            })
            .catch(error => console.error('Error downloading document:', error));
    };

    return (
        <div className="space-y-4 max-w-full">
            <h3 className="text-lg font-semibold">Required Documents</h3>

            <div className="space-y-4">
                {/* Document sections with improved mobile responsiveness */}
                <div className="border p-3 md:p-4 rounded-xl shadow-sm">
                    <h4 className="font-medium text-sm md:text-base">Company Ownership Certificate</h4>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
                        <input
                            type="file"
                            accept=".doc,.docx,.pdf"
                            onChange={(e) => handleDocumentUpload(e, 'ownershipCertificate')}
                            className="border p-1 md:p-2 w-full text-sm"
                        />
                    </div>
                </div>

                <div className="border p-3 md:p-4 rounded-xl shadow-sm">
                    <h4 className="font-medium text-sm md:text-base">Agreement Document</h4>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
                        {adminDocuments?.agreement && (
                            <button
                                onClick={() => downloadDocument(
                                    adminDocuments.agreement,
                                    'agreement.doc'
                                )}
                                className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm"
                            >
                                Download Template
                            </button>
                        )}
                        <input
                            type="file"
                            accept=".doc,.docx,.pdf"
                            onChange={(e) => handleDocumentUpload(e, 'agreement')}
                            className="border p-1 md:p-2 w-full text-sm"
                        />
                    </div>
                </div>

                <div className="border p-3 md:p-4 rounded-xl shadow-sm">
                    <h4 className="font-medium text-sm md:text-base">Privacy Document</h4>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
                        {adminDocuments?.privacyDocument && (
                            <button
                                onClick={() => downloadDocument(
                                    adminDocuments.privacyDocument,
                                    'privacy_document.doc'
                                )}
                                className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm"
                            >
                                Download Template
                            </button>
                        )}
                        <input
                            type="file"
                            accept=".doc,.docx,.pdf"
                            onChange={(e) => handleDocumentUpload(e, 'privacyDocument')}
                            className="border p-1 md:p-2 w-full text-sm"
                        />
                    </div>
                </div>

                <div className="border p-3 md:p-4 rounded-xl shadow-sm">
                    <h4 className="font-medium text-sm md:text-base">Platform Regulation</h4>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
                        {adminDocuments?.platformRegulation && (
                            <button
                                onClick={() => downloadDocument(
                                    adminDocuments.platformRegulation,
                                    'platform_regulation.doc'
                                )}
                                className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm"
                            >
                                Download Template
                            </button>
                        )}
                        <input
                            type="file"
                            accept=".doc,.docx,.pdf"
                            onChange={(e) => handleDocumentUpload(e, 'platformRegulation')}
                            className="border p-1 md:p-2 w-full text-sm"
                        />
                    </div>
                </div>

                <div className="border p-3 md:p-4 rounded-xl shadow-sm">
                    <h4 className="font-medium text-sm md:text-base">Obralia Registration (Optional)</h4>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
                        <input
                            type="file"
                            accept=".doc,.docx,.pdf"
                            onChange={(e) => handleDocumentUpload(e, 'obraliaRegistration')}
                            className="border p-1 md:p-2 w-full text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Previous
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className={`py-4 px-6 rounded-xl text-base font-semibold border border-transparent shadow-sm text-white ${uploadValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}    
                    disabled={!uploadValid}
                >
                    {loading ? 'Loading...' : 'Create Account'}
                </button>
            </div>
        </div>
    );
};

export default function Signup() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {
        step,
        type,
        users: { employees: employeeData, subcontractors: subContractorData },
        loading,
        error,
    } = useAppSelector((state) => state.auth);

    const subCompanies = useAppSelector(
        (state) => state.subContractor.subCompanies
    );

    const activities = useAppSelector(
        (state) => state.subContractor.activities
    );

    const subActivities = useAppSelector(
        (state) => state.subContractor.subActivities
    );

    const [imageFile, setImageFile] = useState(null);
    const [cvFile, setCvFile] = useState(null);
    const [documents, setDocuments] = useState({
        ownershipCertificate: null,
        obraliaRegistration: null,
        privacyDocument: null,
        platformRegulation: null,
    });

    useEffect(() => {
        if (type === 'Employee' && step === 2) {
            dispatch(fetchAllSubCompanies());
        }
        if (type === 'Sub-Contractor' && step === 3) {
            dispatch(fetchAllActivities());
        }
        if (type === 'Sub-Contractor' && step === 4) {
            dispatch(fetchAdminDocuments());
        }
    }, [dispatch, type, step]);

    const handleNextStep = () => {
        dispatch(setStep(step + 1));
    };

    const handlePrevStep = () => {
        if (step > 0) {
            dispatch(setStep(step - 1));
        }
    };

    const setFormData = (data) => {
        if (type === 'Employee') {
            dispatch(updateEmployeeData(data));
        } else if (type === 'Sub-Contractor') {
            dispatch(updateSubContractorData(data));
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        const data = type === 'Employee' ? employeeData : subContractorData;
        
        // Add basic form data
       // Object.entries(data).forEach(([key, value]) => {
       //     if (value && key !== 'documents') {
       //         if (typeof value === 'object' && !(value instanceof File)) {
       //             // If the value is an object (but not a File), encode it as JSON
       //             //formData.append(key, JSON.stringify(value));
       //             Object.entries(value).forEach(([nestedKey, nestedValue]) => {
       //                 if (typeof nestedValue === 'object' && !(nestedValue instanceof File)){
       //                     Object.entries(nestedValue).forEach(([innerKey, innerValue]) => {
       //                         // Append each inner field to formData with the key as "key.nestedKey.innerKey"
       //                         formData.append(`${key}.${nestedKey}.${innerKey}`, innerValue);
       //                     });
       //                 }else{
       //                 // Append each nested field to formData with the key as "key.nestedKey"
       //                 formData.append(`${key}.${nestedKey}`, nestedValue);
       //                 }
       //             });
       //         } else {
       //             if (key === 'phone') {
       //                 const phonePrefix = data.prefix || ''; 
       //                 formData.append(key, `${phonePrefix}${value}`);
       //             }else{
       //                  // For other types, append directly
       //                 formData.append(key, value);
       //             }
       //             
       //         }
       //     }
       // });

       function appendFormData(formData, data, prefix = '') {
        Object.entries(data).forEach(([key, value]) => {
            // Skip the 'documents' key
            if (key === 'documents') return;
    
            // Define the full key (prefix + key)
            const fullKey = prefix ? `${prefix}.${key}` : key;
    
            if (value && typeof value === 'object' && !(value instanceof File)) {
                // If it's an object (but not a File), recurse into its properties
                appendFormData(formData, value, fullKey); // Recursively handle nested objects
            } else {
                // Handle phone number with a prefix
                if (key === 'phone') {
                    const phonePrefix = data.prefix || ''; 
                    formData.append(fullKey, `${phonePrefix}${value}`);
                } else {
                    // For other types, append directly
                    formData.append(fullKey, value);
                }
            }
        });
    }
    
     // Call the optimized function
     appendFormData(formData, data);
    

        // Add files from the DocumentStep component
        if (type === 'Sub-Contractor' && documents) {
            Object.entries(documents).forEach(([key, file]) => {
                if (file) {
                    formData.append(`documents.${key}`, file);
                }
            });
            formData.append('role', "SubManager");
            formData.append('isRP', true);
        }
    
        formData.append('type', type);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        if (cvFile) {
            formData.append('cv', cvFile);
        }
        const result = await dispatch(signupUser({ formData }));
        if (!result.error) {
            router.push('/login');
        }
    };

    const steps = type === 'Sub-Contractor'
        ? ['Account Infos','Personal Infos','Company Infos', 'Documents']
        : ['Account Info', 'Details'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="h-full max-w-screen-sm mx-auto p-4">
                {step === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <RoleSelection
                            setType={(selectedRole) => dispatch(setType(selectedRole))}
                            handleNextStep={handleNextStep}
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="space-y-4">
                            <div className="flex items-center mb-4">
                                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                                    <FaArrowLeft className="text-xl" />
                                </Link>
                                <h1 className="text-xl font-bold ml-2">Sign Up</h1>
                            </div>
                            <Stepper steps={steps} currentStep={step - 1} />
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                encType="multipart/form-data"
                                className="space-y-6"
                            >
                                {error && (
                                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}
                                {step === 1 && (
                                    <Step1
                                        formData={type === 'Employee' ? employeeData : subContractorData}
                                        setFormData={setFormData}
                                        handleNextStep={handleNextStep}
                                        type={type}
                                        imageFile={imageFile}
                                        setImageFile={setImageFile}
                                        handlePrevStep={handlePrevStep}
                                    />
                                )}
                                {step === 2 && type === 'Employee' && (
                                    <Step2Employee
                                        formData={employeeData}
                                        setFormData={setFormData}
                                        handlePrevStep={handlePrevStep}
                                        handleSubmit={handleSubmit}
                                        subCompanies={subCompanies}
                                        cvFile={cvFile}
                                        setCvFile={setCvFile}
                                        loading={loading}
                                    />
                                )}
                                {step === 2 && type === 'Sub-Contractor' && (
                                    <Step2SubContractor
                                    formData={subContractorData}
                                    setFormData={setFormData}
                                    handlePrevStep={handlePrevStep}
                                    handleNextStep={handleNextStep}
                                    loading={loading}
                                />
                                )}
                                {step === 3 && type === 'Sub-Contractor' && (
                                    <Step3SubContractor
                                        formData={subContractorData}
                                        setFormData={setFormData}
                                        handlePrevStep={handlePrevStep}
                                        handleNextStep={handleNextStep}
                                        activities={activities}
                                        subActivities={subActivities}
                                        loading={loading}
                                    />
                                )}
                                {step === 4 && type === 'Sub-Contractor' && (
                                    <DocumentStep
                                    formData={subContractorData}
                                    setFormData={setFormData}
                                    handlePrevStep={handlePrevStep}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    documents={documents}
                                    setDocuments={setDocuments}
                                />
                                )}
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
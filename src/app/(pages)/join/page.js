'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { submitJoinRequest } from '@/lib/store/features/contractorSlice';

const steps = ['Company Informations', 'Director Informations'];

export default function JoinCompanyPage() {
	const router = useRouter();
	const dispatch = useDispatch();
	const { loading } = useSelector((state) => state.contractor);
	const [error, setError] = useState("");
	const [errors, setErrors] = useState({});
	const [passwordValid, setPasswordValid] = useState(true);
	const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{6,16}$/;
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState({
		companyName: '',
		companyCIF: '',
		company_addressligne1: '', company_addressComplementaire: '', company_zipcode: '', company_city: '', company_country: '',
		disponibility:'',
		director: { first_name: '',last_name: '', email: '',prefix:'+34', phone_number: '', password: '',confirmPassword:'',identity_number:'',identity_type:'DNI',position:'',
			profile_addressligne1: '', profile_addressComplementaire: '', profile_zipcode: '', profile_city: '', profile_country: '' }
	});
	const [emailError, setEmailError] = useState('');
	const passwordMatch = formData.director.password === formData.director.confirmPassword;

	//const handleChange = (e, role) => {
	//	const { name, value } = e.target;
	//	setFormData((prevData) => ({
	//		...prevData,
	//		[role]: { ...prevData[role], [name]: value },
	//	}));
	//};

	const handleChange = (e, role, nestedField) => {
		const { name, value } = e.target;
	
		setFormData((prevData) => {
			if (nestedField) {
				return {
					...prevData,
					[role]: {
						...prevData[role],
						[nestedField]: {...prevData[role][nestedField],[name]: value,},
					},
				};
			} else {
				return {
					...prevData,[role]: {...prevData[role],[name]: value,},
				};
			}
		});

		    // Password validation check
			if (name === "password") {
				// Check password validity
				if (!passwordRegex.test(value)) {
				  setPasswordValid(false);
				} else {
				  setPasswordValid(true);
				}
			  }
	};
	

	const handleNext = (e, targetId) => {
		// Prevent form submission on next button click
		e.preventDefault();

		// Required fields for the current step
		const nextRequiredFields = [
			"companyName",
			"companyCIF",
			"company_addressligne1",
			"company_zipcode",
			"company_city",
			"company_country",
			"disponibility"
		  ]; 

		let isValid = true;
  		const errors = {};

	    nextRequiredFields.forEach((field) => {
	      const [key, subKey] = field.split(".");
	      const value = subKey ? formData[key]?.[subKey] : formData[key];
	       
	       if (!value || value.trim() === "") {
	         isValid = false;
	         errors[field] = `${field.replace(".", " ")} is required`;
	       }
		   // Additional validation for company_zipcode
    	   if (field === "company_zipcode" && value && !/^\d{5}$/.test(value)) {
				isValid = false;
				errors[field] = "Postal code must be exactly 5 digits.";
	  		}
	    });

	    if (!isValid) {
			setErrors(errors);
    		setError("Please fill out all required fields and fix errors.");
			//alert("Please correct the highlighted errors before proceeding.");
    		return;
		}
		const topElement = document.getElementById('top');
		topElement.scrollIntoView({
			behavior: 'smooth',  // Smooth scrolling effect
			block: 'start'       // Aligns the element at the top of the page
			});
		setErrors({});
		setEmailError('');
		setError('');
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = (e) => {
		// Prevent form submission on back button click
		e.preventDefault();
	  const topElement = document.getElementById('top');
      topElement.scrollIntoView({
      		behavior: 'smooth',  // Smooth scrolling effect
      		block: 'start'       // Aligns the element at the top of the page
      	});
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
	  
		// Required fields for validation
		const requiredFields = [
		  "director.first_name",
		  "director.last_name",
		  "director.email",
		  "director.phone_number",
		  "director.password",
		  "director.confirmPassword",
		  "director.identity_number",
		  "director.identity_type",
		  "director.position",
		  "director.profile_addressligne1",
		  "director.profile_zipcode",
		  "director.profile_city",
		  "director.profile_country",
		];
	  
		let isValid = true;
		const errors = {};

		// Concatenate prefix and phone number into formData.director.phone_number
		const prefix = formData.director?.prefix || "";
		const phoneNumber = formData.director?.phone_number || "";
		const fullPhoneNumber = `${prefix}${phoneNumber}`.trim();
		
	  
		// Check if all required fields are filled
		requiredFields.forEach((field) => {
		  const [key, subKey] = field.split(".");
		  const value = subKey ? formData[key]?.[subKey] : formData[key];
	  
		  if (!value || value.trim() === "") {
			isValid = false;
			errors[field] = `${field.replace(".", " ")} is required`;
		  }

		   // Additional validation for email
		   if (field === "director.email") {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (value && !emailRegex.test(value)) {
			  isValid = false;
			  errors[field] = "Invalid email address.";
			}
		  }

		  if (field === "director.phone_number") {
			if (value && (!/^\d{9}$/.test(value))) {
			  isValid = false;
			  errors[field] = "Phone number must be exactly 9 digits.";
			}
		  }

		     // Validate identity number based on identity type
			if (field === "director.identity_number") {
				const identityType = formData.director.identity_type;
				let identityRegex = null;
		  
			if (identityType === "DNI") {
			    identityRegex = /^[0-9]{8}[A-Za-z]$/; // DNI format
			  } else if (identityType === "NIE") {
			    identityRegex = /^[A-Za-z][0-9]{7}[A-Za-z]$/; // NIE format
			  } else if (identityType === "Other") {
			    identityRegex = /.*/; // Allow any non-empty string for "Other"
			}
		  
			if (identityRegex && !identityRegex.test(value)) {
			  isValid = false;
			  errors[field] = `Invalid identity number for the selected identity type.`;
			  }
			 }

		  // Additional validation for ZIP codes
		  if (field === "company_zipcode" || field === "director.profile_zipcode") {
			if (value && !/^\d{5}$/.test(value)) {
			  isValid = false;
			  errors[field] = "Postal code must be exactly 5 digits.";
			}
		  }

		});
	  
		// Check password and confirm password match
		if (formData.director.password !== formData.director.confirmPassword) {
		  isValid = false;
		  errors["director.password"] = "Passwords do not match";
		  errors["director.confirmPassword"] = "Passwords do not match";
		}
	  
		// Check password requirements
		if (!passwordRegex.test(formData.director.password)) {
		  isValid = false;
		  errors["director.password"] = "Password does not meet requirements";
		}
	  
		// Handle form validation errors
		if (!isValid) {
		  console.log("Form errors:", errors);
		  setErrors(errors);
		  setError('Please fill out all required fields and fix errors.');
		  return;
		}
	  
		// Submit form data
		setErrors({});
		setEmailError('');
     	setError('');
		formData.director.phone_number = fullPhoneNumber;
        dispatch(submitJoinRequest(formData)).then((action) => {
     	 	if (submitJoinRequest.fulfilled.match(action)) {
     		router.push('/login');
     		}
		});
		console.log("Form submitted successfully:", formData);
		alert("Form submitted successfully!");
	  };
	  

//	const handleSubmit = async (e) => {
//		e.preventDefault();
//		
//		// Validate all required fields before submission
//		const validateFields = () => {
//			if (!formData.companyName) return false;
//			
//			const roles = ['director', 'production', 'supervisor'];
//			for (const role of roles) {
//				if (!formData[role].name || 
//					!formData[role].email || 
//					!formData[role].phone || 
//					!formData[role].password) {
//					return false;
//				}
//			}
//			return true;
//		};//

//		if (!validateFields()) {
//			setError('Please fill in all required fields');
//			return;
//		}//

//		const emails = [formData.director.email, formData.production.email, formData.supervisor.email];
//		const uniqueEmails = new Set(emails);//

//		if (uniqueEmails.size !== emails.length) {
//			setEmailError('Emails must be unique for each role.');
//			return;
//		}//

//		setEmailError('');
//		setError('');
//		dispatch(submitJoinRequest(formData)).then((action) => {
//			if (submitJoinRequest.fulfilled.match(action)) {
//				router.push('/');
//			}
//		});
//	};

	const getStepContent = (step) => {
		const inputClassName = "w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base transition-all appearance-none";

		switch (step) {
			case 0:
				return (
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
							<input
								type="text"
								name="companyName"
								value={formData.companyName}
								onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
								placeholder="Company Name *"
								className={`${inputClassName}  ${ errors["companyName"] ? "border-red-500" : formData.companyName  === "" ? "border-gray-300" : "border-green-500" }`}
							/>
						</div>
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-4">Company CIF</h3>
							<input
								type="text"
								name="companyCIF"
								value={formData.companyCIF}
								onChange={(e) => setFormData({ ...formData, companyCIF: e.target.value })}
								placeholder="CIF Number *"
								className={`${inputClassName}  ${ errors["companyCIF"] ? "border-red-500" : formData.companyCIF  === "" ? "border-gray-300" : "border-green-500" }`}
								required
							/>
						</div>
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-4">Address Details</h3>
							<div className="space-y-4">
								<div>
								<input
									type="text"
									name="company_addressligne1"
									value={formData.company_addressligne1}
									onChange={(e) => setFormData({ ...formData, company_addressligne1: e.target.value })}
									placeholder="Address Ligne 1 *"
									className={`${inputClassName}  ${errors["company_addressligne1"] ? "border-red-500" : formData.company_addressligne1 === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								</div>
								<input
									type="text"
									name="company_addressComplementaire"
									value={formData.company_addressComplementaire}
									onChange={(e) => setFormData({ ...formData, company_addressComplementaire: e.target.value })}
									placeholder="Address Complementaire"
									className={`${inputClassName}  ${ formData.company_addressComplementaire  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								<div className="flex gap-4">
									<div className="flex-1">
								<input
									type="text"
									name="company_city"
									value={formData.company_city}
									onChange={(e) => setFormData({ ...formData, company_city: e.target.value })}
									placeholder="City *"
									className={`${inputClassName}  ${ errors["company_city"] ? "border-red-500" : formData.company_city  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								</div>
								<div className="w-1/3">
								<input
									type="text"
									name="company_zipcode"
									value={formData.company_zipcode}
									onChange={(e) => { const value = e.target.value;  if (/^\d*$/.test(value)) { setFormData({ ...formData, company_zipcode: value }); } }}
									placeholder="Postal Code *"
									className={`${inputClassName}  ${ errors["company_zipcode"] ? "border-red-500" : formData.company_zipcode  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								{errors["company_zipcode"] && formData.company_zipcode !== '' && <p className="text-red-500 text-sm"> • Postal code must be exactly 5 digits.</p>}

								</div>
								</div>
								<div>
								<input
									type="text"
									name="company_country"
									value={formData.company_country}
									onChange={(e) => setFormData({ ...formData, company_country: e.target.value })}
									placeholder="Country *"
									className={`${inputClassName}  ${ errors["company_country"] ? "border-red-500" : formData.company_country  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
							</div></div>
						</div>
						<div className="flex gap-4 ">
						<div className="w-1/8 flex items-center">
						<h3 className="block text-lg font-medium text-gray-900 mb-1">Disponibility :</h3>
						</div>
						<div className="flex-1 relative">
						<select className={`${inputClassName} ${  errors["disponibility"] ? "border-red-500" : formData.disponibility === ""  ? "text-gray-400" : "border-green-500" }`} name="disponibility" onChange={(e) => setFormData({ ...formData, disponibility: e.target.value })} value={formData.disponibility} >
						    <option value="" disabled >Select your availability</option>
							<option value="international">International 🌍</option>
							<option value="national">National </option>
							<option value="regional">Régional</option>
							</select>
							<span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
  							<path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
							</svg>
							</span>
						</div>
						</div>
					</div>
				);
			case 1:
				return (
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-4">Director Details</h3>
							<div className="space-y-4">
								<div className="flex gap-4">
									<div className="flex-1">
								<input
									type="text"
									name="first_name"
									value={formData.director.first_name}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="First Name *"
									className={`${inputClassName}  ${ errors["director.first_name"] ? "border-red-500" : formData.director.first_name  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								</div>
								<div className="flex-1">
								<input
									type="text"
									name="last_name"
									value={formData.director.last_name}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="Last Name *"
									className={`${inputClassName}  ${ errors["director.last_name"] ? "border-red-500" : formData.director.last_name  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								</div>
								</div>
								<div>
								<input
									type="email"
									name="email"
									value={formData.director.email}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="Email *"
									className={`${inputClassName}  ${ errors["director.email"] ? "border-red-500" : formData.director.email  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								{errors["director.email"] && formData.director.email !== '' && <p className="text-red-500 text-sm"> • Invalid email address !!</p>}
								</div>
								<div className="flex gap-4">
									<div className="w-1/8">
									<select className={inputClassName} name="prefix"  value={formData.director.prefix} onChange={(e) => handleChange(e, 'director')} >
									    <option value="+34" >🇪🇸 +34 </option>
										<option value="+33">🇫🇷 +33</option>
       									<option value="+44">🇬🇧 +44</option>
        								<option value="+49">🇩🇪 +49</option>
      								</select>
								</div>
								<div className="flex-1">
								<input
									type="tel"
									name="phone_number"
									value={formData.director.phone_number}
									onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)&& value.length <= 9) { handleChange({ target: { name: "phone_number", value } }, "director"); } }}
									placeholder="Phone *"
									className={`${inputClassName}  ${ errors["director.phone_number"] ? "border-red-500" : formData.director.phone_number  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								{errors["director.phone_number"] && formData.director.phone_number !== '' && <p className="text-red-500 text-sm"> • Invalid phone number !!</p>}

								</div>
								</div>
								<div className="flex gap-4">
									<div className="flex-1">
									<input
									type="password"
									name="password"
									value={formData.director.password}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="Password *"
									className={`${inputClassName}  ${ errors["director.password"] ? "border-red-500" : formData.director.password === "" ? "border-gray-300" : passwordValid ? "border-green-500" : "border-red-500"  }`}
									/>
									{!passwordValid && formData.director.password !== "" && <p className="text-red-500 text-sm"> • Passwords not valid <br></br>• Passwords must contain spécial characters </p>}
									</div>
									<div className="flex-1">
									<input
									type="password"
									name="confirmPassword"
									value={formData.director.confirmPassword}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="Confirm Password *"
									className={`${inputClassName}  ${ errors["director.confirmPassword"] ? "border-red-500" : formData.director.confirmPassword  && passwordMatch ? "border-green-500" : "border-gray-300" }`}
									/>
									{!passwordMatch && formData.director.confirmPassword !== '' && <p className="text-red-500 text-sm"> • Passwords do not match</p>}
									</div>
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-6">
                             <div>
                               <h3 className="text-lg font-medium text-gray-900 mb-4">Identity</h3>
                               <div className="flex gap-4">
                                 <div className="w-1/4 relative">
								 <select className={inputClassName} name="identity_type" onChange={(e) => handleChange(e, 'director')} value={formData.director.identity_type}>
								    <option value="DNI">DNI</option>
									<option value="NIE">NIE</option>
                                    <option value="Other">Other</option>
                                   </select>
                                   <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                       <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z" clipRule="evenodd"></path>
                                     </svg>
                                   </span>
                                 </div>
                                 <div className="flex-1">
								 <input
									type="text"
									name="identity_number"
									value={formData.director.identity_number}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="identity number *"
									className={`${inputClassName}  ${ errors["director.identity_number"] ? "border-red-500" : formData.director.identity_number  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								{errors["director.identity_number"] && formData.director.identity_number !== '' && <p className="text-red-500 text-sm"> • Invalid identity number !!</p>}

								</div>
                               </div>
                             </div>

                          
                             <div>
                               <h3 className="text-lg font-medium text-gray-900 mb-4">Company Position</h3>
                               <div className="flex gap-4">
                                 <div className="flex-1">
								 <input
									type="text"
									name="position"
									value={formData.director.position}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="Position *"
									className={`${inputClassName}  ${errors["director.position"] ? "border-red-500" : formData.director.position  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
                                 </div>
                               </div>
                             </div>
                        </div>
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-4">Address Details</h3>
							<div className="space-y-4">
								<input
									type="text"
									name="profile_addressligne1"
									value={formData.director.profile_addressligne1}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="Address Ligne 1 *"
									className={`${inputClassName}  ${errors["director.profile_addressligne1"] ? "border-red-500" : formData.director.profile_addressligne1  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								<input
									type="text"
									name="profile_addressComplementaire"
									value={formData.director.profile_addressComplementaire}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="Address Complementaire"
									className={inputClassName}
								/>
								<div className="flex gap-4">
									<div className="flex-1">
								<input
									type="text"
									name="profile_city"
									value={formData.director.profile_city}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="City *"
									className={`${inputClassName}  ${errors["director.profile_city"] ? "border-red-500" : formData.director.profile_city  === "" ? "border-gray-300" : "border-green-500" }`}
								/></div>
								<div className="w-1/3">
								<input
									type="text"
									name="profile_zipcode"
									value={formData.director.profile_zipcode}
									onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)) { handleChange({ target: { name: "profile_zipcode", value } }, "director"); } }}
									placeholder="Postal Code *"
									className={`${inputClassName}  ${errors["director.profile_zipcode"] ? "border-red-500" : formData.director.profile_zipcode  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								{errors["director.profile_zipcode"] && formData.director.profile_zipcode !== '' && <p className="text-red-500 text-sm"> • Postal code must be exactly 5 digits.</p>}

								</div>
								</div>
								<input
									type="text"
									name="profile_country"
									value={formData.director.profile_country}
									onChange={(e) => handleChange(e, 'director')}
									placeholder="Country *"
									className={`${inputClassName}  ${errors["director.profile_country"] ? "border-red-500" : formData.director.profile_country  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
							</div>
						</div>
					</div>
				);
			default:
				return 'Unknown step';
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* App-like header */}
			<div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
				<div className="h-14 flex items-center px-2 mx-auto ">
					<button 
						onClick={() => router.push('/')}
						className="p-4 -ml-2 rounded-full hover:bg-gray-100 flex items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#6b7280">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						<p className="text-lg font-semibold text-gray-500 hover:bg-gray-100">Return</p>
					</button>
				</div>

				{/* Stepper */}
				<div className="px-4 pb-3 max-w-7xl mx-auto">
					<div className="flex justify-center items-center space-x-8 md:space-x-16">
						{steps.map((label, index) => (
							<div key={label} className={`flex items-center ${activeStep === index ? 'text-blue-600' : 'text-gray-400'}`}>
								<div className={`w-8 h-8 rounded-full ${activeStep >= index ? 'bg-blue-600' : 'bg-gray-300'
									} flex items-center justify-center text-white text-sm`}>
									{index + 1}
								</div>
								<span className="ml-2 font-medium text-sm md:text-base">{label}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Main content */}
			<div id="top"></div>
			<div className="pt-32 px-4 pb-6">
				<div className="max-w-4xl mx-auto">
					{error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
					{emailError && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{emailError}</div>}
				
					{/* Move form tag to only wrap the submit button */}
					<div className="space-y-4">
						<div className="bg-white rounded-lg shadow-sm p-6">
							{getStepContent(activeStep)}
						</div>

						<div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t p-4 md:relative md:border-none md:p-0 md:mt-6">
							<div className="max-w-4xl mx-auto flex justify-end gap-x-4">
								{activeStep !== 0 && (
									<button
										type="button"
										onClick={handleBack}
										className="flex-1 md:flex-none md:w-32 py-3.5 bg-gray-100 text-gray-700 rounded-lg font-medium"
									>
										Back
									</button>
								)}
								{activeStep === steps.length - 1 ? (
									<form onSubmit={handleSubmit} className="flex-1 md:w-32">
										<button
											type="submit"
											className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center"
											disabled={loading}
										>
											{loading ? (
												<div className="flex items-center space-x-2">
													<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
													<span>Processing...</span>
												</div>
											) : (
												'Submit'
											)}
										</button>
									</form>
								) : (
									<button
										type="button"
										onClick={handleNext}
										className="flex-1 md:flex-none md:w-32 py-3.5 bg-blue-600 text-white rounded-lg font-medium"
									>
										Next
									</button>
								)}
							</div>
						</div>
						<div className="h-20 md:h-0"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
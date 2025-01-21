'use client';
import { verifyToken, verifyTokenInite } from "@/lib/jwt";
import { completeInviteRequest, resetInvite, validateInviteToken } from "@/lib/store/features/inviteSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";



export default function Signup() {
    const router = useRouter();
	//const path= useSearchParams();
    //const token = path.get('token');
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.contractor);
    const [error, setError] = useState("");
	const [errors, setErrors] = useState({});
	const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{6,16}$/;
    const [passwordValid, setPasswordValid] = useState(true);
    const InviteRequest= useSelector((state) => state.invite?.invite);
    const [formData, setFormData] = useState({
            first_name: '',
            last_name: '', 
            email: '',
            prefix:'+34',
            phone_number: '',
            password: '',
            confirmPassword:'',
            identity_number:'',
            identity_type:'DNI',
            position:'',
            profile_addressligne1: '',
            profile_addressComplementaire: '',
            profile_zipcode: '',
            profile_city: '',
            profile_country: '',
			inviteId:'',
			invitedBy: '',
			role: '',
    		isRP: false,
    		addProject: false,
        });
    const passwordMatch = formData.password === formData.confirmPassword;
    const inputClassName = "w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base transition-all appearance-none";
    let decoded=null;
    //useEffect(() => {
    //    if (token) {
    //      dispatch(validateInviteToken(token));
    //    }
	//	return () => {
	//		dispatch(resetInvite());
	//	  };
    //  }, [dispatch, token]);

     useEffect(() => {
		if (InviteRequest) {
		  setFormData((prev) => ({
			...prev,
			first_name: InviteRequest.first_name,
			last_name: InviteRequest.last_name,
			email: InviteRequest.email,
			invitedBy: InviteRequest.invitedBy,
			role: InviteRequest.role,
    		isRP: InviteRequest.isRP,
    		addProject: InviteRequest.addProject,
			inviteId:InviteRequest._id,
		  }));
		}
	  }, [InviteRequest]);
	  console.log('this is invite :'+InviteRequest);

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
          e.preventDefault();

		// Required fields for validation
		const requiredFields = [
			"first_name",
			"last_name",
			"email",
			"phone_number",
			"password",
			"confirmPassword",
			"identity_number",
			"identity_type",
			"position",
			"profile_addressligne1",
			"profile_zipcode",
			"profile_city",
			"profile_country",
		  ];
		let isValid = true;
		const errors = {};
		const prefix = formData?.prefix || "";
		const phoneNumber = formData?.phone_number || "";
		const fullPhoneNumber = `${prefix}${phoneNumber}`.trim();

		// Check if all required fields are filled
		requiredFields.forEach((field) => {
			const [key, subKey] = field.split(".");
			const value = subKey ? formData[key]?.[subKey] : formData[key];
		
			if (!value || value.trim() === "") {
			  isValid = false;
			  errors[field] = `${field.replace("_", " ")} is required`;
			}
  
			 // Additional validation for email
			 if (field === "email") {
			  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			  if (value && !emailRegex.test(value)) {
				isValid = false;
				errors[field] = "Invalid email address.";
			  }
			}
  
			if (field === "phone_number") {
			  if (value && (!/^\d{9}$/.test(value))) {
				isValid = false;
				errors[field] = "Phone number must be exactly 9 digits.";
			  }
			}
  
			   // Validate identity number based on identity type
			  if (field === "identity_number") {
				  const identityType = formData.identity_type;
				  let identityRegex = null;
			
			  if (identityType === "DNI") {
				  identityRegex = /^[0-9]{8}[A-Za-z]$/; // DNI format
				} else if (identityType === "NIE") {
				  identityRegex = /^[XYZ][0-9]{7}[A-Za-z]$/; // NIE format
				} else if (identityType === "Other") {
				  identityRegex = /.*/; // Allow any non-empty string for "Other"
			  }
			
			  if (identityRegex && !identityRegex.test(value)) {
				isValid = false;
				errors[field] = `Invalid identity number for the selected identity type.`;
				}
			   }
  
			// Additional validation for ZIP codes
			if (field === "company_zipcode" || field === "profile_zipcode") {
			  if (value && !/^\d{5}$/.test(value)) {
				isValid = false;
				errors[field] = "Postal code must be exactly 5 digits.";
			  }
			}
  
		  });

		 // Check password requirements
		 if (!passwordRegex.test(formData.password)) {
			isValid = false;
			errors["password"] = "Password does not meet requirements";
		 }

		  // Check password and confirm password match
		if (formData.password !== formData.confirmPassword) {
			isValid = false;
			errors["password"] = "Passwords do not match";
			errors["confirmPassword"] = "Passwords do not match";
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
     	setError('');
		formData.phone_number = fullPhoneNumber;
		dispatch(completeInviteRequest(formData)).then((action) => {
					if (completeInviteRequest.fulfilled.match(action)) {
					router.push('/login');
					}
		});
		console.log("Form submitted successfully:", formData);
		alert("Form submitted successfully!");

    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="space-y-4">
                    <div className="space-y-6">
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-4">Profile Details</h3>
							<div className="space-y-4">
								<div className="flex gap-4">
									<div className="flex-1">
								<input
									type="text"
									name="first_name"
									disabled
									value={formData.first_name}
									placeholder="First Name *"
									className={`${inputClassName}  ${ errors["first_name"] ? "border-red-500" : formData.first_name  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								</div>
								<div className="flex-1">
								<input
									type="text"
									name="last_name"
									disabled
									value={formData.last_name}
									placeholder="Last Name *"
									className={`${inputClassName}  ${ errors["last_name"] ? "border-red-500" : formData.last_name  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								</div>
								</div>
								<div>
								<input
									type="email"
									name="email"
									disabled
									value={formData.email}
									placeholder="Email *"
									className={`${inputClassName}  ${ errors["email"] ? "border-red-500" : formData.email  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								{errors["email"] && formData.email !== '' && <p className="text-red-500 text-sm"> • Invalid email address !!</p>}
								</div>
								<div className="flex gap-4">
									<div className="w-1/8">
									<select className={inputClassName} name="prefix"  value={formData.prefix} onChange={handleChange} >
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
									value={formData.phone_number}
									onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)&& value.length <= 9) { handleChange({ target: { name: "phone_number", value } }, "director"); } }}
									placeholder="Phone *"
									className={`${inputClassName}  ${ errors["phone_number"] ? "border-red-500" : formData.phone_number  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								{errors["phone_number"] && formData.phone_number !== '' && <p className="text-red-500 text-sm"> • Invalid phone number !!</p>}

								</div>
								</div>
								<div className="flex gap-4">
									<div className="flex-1">
									<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Password *"
									className={`${inputClassName}  ${ errors["password"] ? "border-red-500" : formData.password === "" ? "border-gray-300" : passwordValid ? "border-green-500" : "border-red-500"  }`}
									/>
									{!passwordValid && formData.password !== "" && <p className="text-red-500 text-sm"> • Passwords not valid <br></br>• Passwords must contain spécial characters </p>}
									</div>
									<div className="flex-1">
									<input
									type="password"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder="Confirm Password *"
									className={`${inputClassName}  ${ errors["confirmPassword"] ? "border-red-500" : formData.confirmPassword  && passwordMatch ? "border-green-500" : "border-gray-300" }`}
									/>
									{!passwordMatch && formData.confirmPassword !== '' && <p className="text-red-500 text-sm"> • Passwords do not match</p>}
									</div>
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-6">
                             <div>
                               <h3 className="text-lg font-medium text-gray-900 mb-4">Identity</h3>
                               <div className="flex gap-4">
                                 <div className="w-1/4 relative">
								 <select 
                                    name="identity_type" 
                                    className={inputClassName}  
                                    onChange={handleChange} 
                                    value={formData.identity_type}>
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
									value={formData.identity_number}
									onChange={handleChange}
									placeholder="identity number *"
									className={`${inputClassName}  ${ errors["identity_number"] ? "border-red-500" : formData.identity_number  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								{errors["identity_number"] && formData.identity_number !== '' && <p className="text-red-500 text-sm"> • Invalid identity number !!</p>}

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
									value={formData.position}
									onChange={handleChange}
									placeholder="Position *"
									className={`${inputClassName}  ${errors["position"] ? "border-red-500" : formData.position  === "" ? "border-gray-300" : "border-green-500" }`}
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
									value={formData.profile_addressligne1}
									onChange={handleChange}
									placeholder="Address Ligne 1 *"
									className={`${inputClassName}  ${errors["profile_addressligne1"] ? "border-red-500" : formData.profile_addressligne1  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								<input
									type="text"
									name="profile_addressComplementaire"
									value={formData.profile_addressComplementaire}
									onChange={handleChange}
									placeholder="Address Complementaire"
									className={inputClassName}
								/>
								<div className="flex gap-4">
									<div className="flex-1">
								<input
									type="text"
									name="profile_city"
									value={formData.profile_city}
									onChange={handleChange}
									placeholder="City *"
									className={`${inputClassName}  ${errors["profile_city"] ? "border-red-500" : formData.profile_city  === "" ? "border-gray-300" : "border-green-500" }`}
								/></div>
								<div className="w-1/3">
								<input
									type="text"
									name="profile_zipcode"
									value={formData.profile_zipcode}
									onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)) { handleChange({ target: { name: "profile_zipcode", value } }, "director"); } }}
									placeholder="Postal Code *"
									className={`${inputClassName}  ${errors["profile_zipcode"] ? "border-red-500" : formData.profile_zipcode  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
								{errors["profile_zipcode"] && formData.profile_zipcode !== '' && <p className="text-red-500 text-sm"> • Postal code must be exactly 5 digits.</p>}

								</div>
								</div>
								<input
									type="text"
									name="profile_country"
									value={formData.profile_country}
									onChange={handleChange}
									placeholder="Country *"
									className={`${inputClassName}  ${errors["profile_country"] ? "border-red-500" : formData.profile_country  === "" ? "border-gray-300" : "border-green-500" }`}
								/>
							</div>
						</div>
					</div>
                    </div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t p-4 md:relative md:border-none md:p-0 md:mt-6 shadow-lg">
                    <div className="max-w-4xl mx-auto flex justify-end gap-x-4">
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
                    </div>
                </div>
            </div>
        </div>


    );



}
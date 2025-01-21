import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import employeeReducer from './features/employeeSlice';
import subContractorReducer from './features/subContractorSlice';
import contractorReducer from './features/contractorSlice';
import companyReducer from './features/companySlice';
import inviteReducer from './features/inviteSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  employee: employeeReducer,
  subContractor: subContractorReducer,
  contractor: contractorReducer,
  companies: companyReducer,
  invite: inviteReducer,
});

export default rootReducer;
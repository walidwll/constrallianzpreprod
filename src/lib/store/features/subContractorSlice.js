import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  subCompany: null,
  subCompanies: [],
  activities:[],
  subActivities:[],
  subCompaniesDocs: [],
  subContractors: [],
  employees: [],
  applications: [],
  companyDetails: null,
  projects: [],
  loading: false,
  error: null,
  machinery: [],
  totalMachinery: 0,
  allMachinery: [],
  totalEmployees: 0,
  currentPage: 1,
  totalPages: 0,
  allMachinery: [],
  machineryLoading: false,
  machineryError: null,
  employeeRequests: [],
  machineryRequests: [],
  machineryRequestFilters: {
    machineryName: '',
    status: 'pending'
  },
  selectedMachinery: null,
  machineryDetailsLoading: false,
  machineryDetailsError: null,
  requests: [],
  requestsLoading: false,
  requestsError: null,
  requestsTotalPages: 0,
  requestsCurrentPage: 1,
  adminDocuments: null,
  adminDocumentsLoading: false,
  adminDocumentsError: null,
  resources: {
    employees: [],
    machinery: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0
    }
  },
  subcompanyReports: [],
  reportsLoading: false,
  reportsError: null,
  reportsPagination: null
};

export const fetchSubCompany = createAsyncThunk(
  'subCompanies/fetchone',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-companies/subcompany?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch sub-company');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubCompanies = createAsyncThunk(
  'subCompanies/fetch',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-companies?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch sub-companies');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubActivities = createAsyncThunk(
  'subCompanies/fetchSubActivities',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-companies/activities/subactivities?id_Act=${id}`);
      if (!response.ok) throw new Error('Failed to fetch sub-companies');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllSubCompanies = createAsyncThunk(
  'subCompanies/fetchAll',
  async (_, { rejectWithValue }) => {
    try {

      const response = await fetch(`/api/sub-companies/all`);
      if (!response.ok) throw new Error('Failed to fetch sub-companies');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllActivities = createAsyncThunk(
  'subCompanies/fetchAllActivities',
  async (_, { rejectWithValue }) => {
    try {

      const response = await fetch(`/api/sub-companies/activities`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchAllSubCompaniesDocs = createAsyncThunk(
  'subCompanies/fetchAllDocs',
  async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/doc/sub-contractors?page=${page}&limit=${limit}&search=${search}`);
      if (!response.ok) throw new Error('Failed to fetch sub-companies');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllMachinery = createAsyncThunk(
  'subContractor/fetchAllMachinery',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/sub-contractor/machinery/all?${query}`);
      if (!response.ok) throw new Error('Failed to fetch machinery');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEmployees = createAsyncThunk(
  'employees/fetch',
  async ({ filters = {}, subContractorId, userRole, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        userRole,
        ...(subContractorId && { subContractorId }),
        ...(filters.name && { name: filters.name }),
        ...(filters.isActive !== '' && { isActive: filters.isActive }),
        ...(filters.minWorkedHours && { minWorkedHours: filters.minWorkedHours }),
        ...(filters.quality && { quality: filters.quality }),
        ...(filters.technical && { technical: filters.technical }),
        ...(filters.punctuality && { punctuality: filters.punctuality }),
        ...(filters.safety && { safety: filters.safety }),
      });

      const response = await fetch(`/api/sub-contractor/employee?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchCompanyDetails = createAsyncThunk(
  'subCompanies/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-companies/details?id=${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchApplications = createAsyncThunk(
  'applications/fetch',
  async ({ subContractorId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/sub-contractor/employee/requests?subContractorId=${subContractorId}`
      );
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();

      return Array.isArray(data.applications) ? data.applications : [];
    } catch (error) {
      console.error('Fetch error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubContractor = createAsyncThunk(
  'subContractor/update',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/sub-contractor/update', {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ applicationId, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('/api/sub-contractor/employee/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update application status');
      }

      if (status === 'approved') {
        await dispatch(addEmployeeToCompany({
          employeeId: data.application.employeeId._id,
          subContractorId: data.application.subContractorId
        }));
      }

      return data.application;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addEmployeeToProject = createAsyncThunk(
  'projects/addEmployee',
  async ({ employeeId, projectId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-contractor/project/${projectId}/employee/${employeeId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add employee to project');
      }
      return data.project;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addEmployeeToCompany = createAsyncThunk(
  'subContractor/addEmployee',
  async ({ employeeId, subContractorId }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/sub-contractor/employee/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, subContractorId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMachinery = createAsyncThunk(
  'machinery/fetch',
  async ({ page = 1, limit = 10, search = '', subcontractorId }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        subcontractorId: subcontractorId,
        page: page.toString(),
        limit: limit.toString(),
        search,
      }).toString();

      const response = await fetch(`/api/sub-contractor/machinery?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch machinery');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMachinery = createAsyncThunk(
  'machinery/add',
  async (machineryData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/sub-contractor/machinery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machineryData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add machinery');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMachinery = createAsyncThunk(
  'machinery/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/sub-contractor/machinery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, updates }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update machinery');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMachinery = createAsyncThunk(
  'machinery/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/sub-contractor/machinery', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete machinery');
      }
      const data = await response.json();
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'projects/fetch',
  async ({ subcontractorId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-contractor/projects?subcontractorId=${subcontractorId}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEmployeeRequests = createAsyncThunk(
  'employeeRequests/fetch',
  async ({ subContractorId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-contractor/employee/${subContractorId}`);
      if (!response.ok) throw new Error('Failed to fetch employee requests');
      const data = await response.json();
      return data.requests;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmployeeRequestStatus = createAsyncThunk(
  'employeeRequests/updateStatus',
  async ({ requestId, status, subContractorId, projectId, hourlyRate }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-contractor/employee/${subContractorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status, projectId, hourlyRate }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update request status');
      return data.request;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMachineryRequest = createAsyncThunk(
  'subContractor/createMachineryRequest',
  async ({ machineryId, projectId }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/sub-contractor/machinery/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machineryId, projectId }),
      });
      if (!response.ok) throw new Error('Failed to create machinery request');
      const data = await response.json();
      return data.request;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMachineryRequests = createAsyncThunk(
  'subContractor/getMachineryRequests',
  async ({ subContractorId, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        subContractorId,
        ...(filters.machineryName && { machineryName: filters.machineryName }),
        ...(filters.status && { status: filters.status })
      }).toString();

      const response = await fetch(`/api/sub-contractor/machinery/requests?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch machinery requests');
      const data = await response.json();
      return data.requests;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const updateMachineryRequestStatus = createAsyncThunk(
  'subContractor/updateMachineryRequestStatus',
  async ({ requestId, status, projectId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-contractor/machinery/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status, projectId }),
      });
      if (!response.ok) throw new Error('Failed to update machinery request status');
      const data = await response.json();
      return data.request;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const fetchMachineryDetails = createAsyncThunk(
  'machinery/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-contractor/machinery/${id}`);
      if (!response.ok) throw new Error('Failed to fetch machinery details');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMachineryReview = createAsyncThunk(
  'machinery/updateReview',
  async ({ id, rating }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-contractor/machinery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (!response.ok) throw new Error('Failed to update machinery review');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMachineryHours = createAsyncThunk(
  'machinery/addHours',
  async ({ id, projectId, hours }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-contractor/machinery/${id}/hours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, hours }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add hours');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubContractorRequests = createAsyncThunk(
  'subContractor/fetchRequests',
  async ({ page = 1, limit = 10, status }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({ page, limit, ...(status && { status }) });
      const response = await fetch(`/api/sub-contractor/requests?${query}`);
      if (!response.ok) throw new Error('Failed to fetch requests');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubContractorRequestStatus = createAsyncThunk(
  'subContractor/updateRequestStatus',
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/sub-contractor/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status }),
      });
      if (!response.ok) throw new Error('Failed to update request');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAdminDocuments = createAsyncThunk(
  'subContractor/fetchAdminDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/doc');
      if (!response.ok) throw new Error('Failed to fetch documents');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAdminDocuments = createAsyncThunk(
  'subContractor/updateAdminDocuments',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update documents');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResources = createAsyncThunk(
  'subContractor/fetchResources',
  async ({ subContractorId, type, page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sub-companies/resources?subContractorId=${subContractorId}&type=${type}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubCompanyReports = createAsyncThunk(
  'subContractor/fetchReports',
  async ({ subContractorId, month, year, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        subContractorId,
        ...(month && { month }),
        ...(year && { year }),
        page: page.toString(),
        limit: limit.toString()
      }).toString();

      const response = await fetch(`/api/sub-companies/reports?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      return {
        reports: data.reports,
        pagination: data.pagination
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const subContractorSlice = createSlice({
  name: 'subContractor',
  initialState,
  reducers: {
    updateMachineryRequestFilters: (state, action) => {
      state.machineryRequestFilters = {
        ...state.machineryRequestFilters,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.subCompany = action.payload;
      })
      .addCase(fetchSubCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.subCompanies = action.payload;
      })
      .addCase(fetchSubCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.subActivities = action.payload;
      })
      .addCase(fetchSubActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllSubCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSubCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.subCompanies = action.payload;
      })
      .addCase(fetchAllSubCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchAllActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.employees = [];
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.totalEmployees = action.payload.totalEmployees;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(updateSubContractor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubContractor.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSubContractor = action.payload;
        const index = state.subCompanies.findIndex(
          (subCompany) => subCompany.email === updatedSubContractor.email
        );
        if (index !== -1) {
          state.subCompanies[index] = updatedSubContractor;
        }
      })
      .addCase(updateSubContractor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedApplication = action.payload;

        if (Array.isArray(state.applications)) {
          const index = state.applications.findIndex(
            (app) => app._id === updatedApplication._id
          );
          if (index !== -1) {
            state.applications[index] = updatedApplication;
          } else {
            state.applications.push(updatedApplication);
          }
        } else {
          state.applications = [updatedApplication];
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(fetchCompanyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEmployeeToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployeeToProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(
          (project) => project._id === updatedProject._id
        );
        if (index !== -1) {
          state.projects[index] = updatedProject;
        } else {
          state.projects.push(updatedProject);
        }
      })
      .addCase(addEmployeeToProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEmployeeToCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployeeToCompany.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.employee) {
          state.employees.push(action.payload.employee);
        }
      })
      .addCase(addEmployeeToCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMachinery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachinery.fulfilled, (state, action) => {
        state.loading = false;
        state.machinery = action.payload.machinery;
        state.totalMachinery = action.payload.total;
      })
      .addCase(fetchMachinery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMachinery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMachinery.fulfilled, (state, action) => {
        state.loading = false;
        state.machinery.push(action.payload);
      })
      .addCase(addMachinery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMachinery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMachinery.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.machinery.findIndex(m => m._id === action.payload._id);
        if (index !== -1) {
          state.machinery[index] = action.payload;
        }
      })
      .addCase(updateMachinery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMachinery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMachinery.fulfilled, (state, action) => {
        state.loading = false;
        state.machinery = state.machinery.filter(m => m._id !== action.payload);
      })
      .addCase(deleteMachinery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllMachinery.pending, (state) => {
        state.machineryLoading = true;
        state.machineryError = null;
      })
      .addCase(fetchAllMachinery.fulfilled, (state, action) => {
        state.machineryLoading = false;
        state.allMachinery = action.payload.machinery;
        state.totalMachinery = action.payload.totalMachinery;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllMachinery.rejected, (state, action) => {
        state.machineryLoading = false;
        state.machineryError = action.payload;
      })
      .addCase(fetchEmployeeRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeRequests = action.payload;
      })
      .addCase(fetchEmployeeRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployeeRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRequest = action.payload;
        const index = state.employeeRequests.findIndex(
          (req) => req._id === updatedRequest?._id
        );
        if (index !== -1) {
          state.employeeRequests[index] = updatedRequest;
        }
      })
      .addCase(updateEmployeeRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMachineryRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMachineryRequest.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createMachineryRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMachineryRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMachineryRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.machineryRequests = action.payload;
      })
      .addCase(getMachineryRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMachineryRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMachineryRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRequest = action.payload;
        const index = state.machineryRequests.findIndex(
          (req) => req._id === updatedRequest?._id
        );
        if (index !== -1) {
          state.machineryRequests[index] = updatedRequest;
        }
      })
      .addCase(updateMachineryRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMachineryDetails.pending, (state) => {
        state.machineryDetailsLoading = true;
        state.machineryDetailsError = null;
      })
      .addCase(fetchMachineryDetails.fulfilled, (state, action) => {
        state.machineryDetailsLoading = false;
        state.selectedMachinery = action.payload;
      })
      .addCase(fetchMachineryDetails.rejected, (state, action) => {
        state.machineryDetailsLoading = false;
        state.machineryDetailsError = action.payload;
      })
      .addCase(updateMachineryReview.pending, (state) => {
        state.machineryDetailsLoading = true;
        state.machineryDetailsError = null;
      })
      .addCase(updateMachineryReview.fulfilled, (state, action) => {
        state.machineryDetailsLoading = false;
        state.selectedMachinery = action.payload;
      })
      .addCase(updateMachineryReview.rejected, (state, action) => {
        state.machineryDetailsLoading = false;
        state.machineryDetailsError = action.payload;
      })
      .addCase(addMachineryHours.pending, (state) => {
        state.machineryDetailsLoading = true;
        state.machineryDetailsError = null;
      })
      .addCase(addMachineryHours.fulfilled, (state, action) => {
        state.machineryDetailsLoading = false;
        state.selectedMachinery = action.payload.machinery;
      })
      .addCase(addMachineryHours.rejected, (state, action) => {
        state.machineryDetailsLoading = false;
        state.machineryDetailsError = action.payload;
      })
      .addCase(fetchSubContractorRequests.pending, (state) => {
        state.requestsLoading = true;
      })
      .addCase(fetchSubContractorRequests.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.requests = action.payload.requests;
        state.requestsTotalPages = action.payload.totalPages;
        state.requestsCurrentPage = action.payload.currentPage;
      })
      .addCase(fetchSubContractorRequests.rejected, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = action.payload;
      })
      .addCase(updateSubContractorRequestStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r._id === action.payload.request._id);
        if (index !== -1) {
          state.requests[index] = action.payload.request;
        }
      })
      .addCase(fetchAdminDocuments.pending, (state) => {
        state.adminDocumentsLoading = true;
        state.adminDocumentsError = null;
      })
      .addCase(fetchAdminDocuments.fulfilled, (state, action) => {
        state.adminDocumentsLoading = false;
        state.adminDocuments = action.payload;
      })
      .addCase(fetchAdminDocuments.rejected, (state, action) => {
        state.adminDocumentsLoading = false;
        state.adminDocumentsError = action.payload;
      })
      .addCase(updateAdminDocuments.pending, (state) => {
        state.adminDocumentsLoading = true;
        state.adminDocumentsError = null;
      })
      .addCase(updateAdminDocuments.fulfilled, (state, action) => {
        state.adminDocumentsLoading = false;
        state.adminDocuments = action.payload;
      })
      .addCase(updateAdminDocuments.rejected, (state, action) => {
        state.adminDocumentsLoading = false;
        state.adminDocumentsError = action.payload;
      })
      .addCase(fetchAllSubCompaniesDocs.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(fetchAllSubCompaniesDocs.fulfilled, (state, action) => {
        state.loading = false;
        state.subCompaniesDocs = action.payload;
      })
      .addCase(fetchAllSubCompaniesDocs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchResources.pending, (state) => {
        state.resources.loading = true;
        state.resources.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.resources.loading = false;
        if (action.meta.arg.type === 'employees') {
          state.resources.employees = action.payload.data;
        } else {
          state.resources.machinery = action.payload.data;
        }
        state.resources.pagination = action.payload.pagination;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.resources.loading = false;
        state.resources.error = action.payload;
      })
      .addCase(fetchSubCompanyReports.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(fetchSubCompanyReports.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.subcompanyReports = action.payload.reports;
        state.reportsPagination = action.payload.pagination;
      })
      .addCase(fetchSubCompanyReports.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload;
      });

  },
});

export const { updateMachineryRequestFilters } = subContractorSlice.actions;

export default subContractorSlice.reducer;
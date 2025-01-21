import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mongoose from 'mongoose';

const initialState = {
    contractor: null,
    contractors: null,
    project: null,
    company: null,
    companyProfiles: [],
    projects: [],
    oldProjects: [],
    currentProjects: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    projectsPerPage: 6,
    isCompleted: false,
    projectsPage: 1,
    currentProjectsPage: 1,
    oldProjectsPage: 1,
    subcontractors: [],
    statistics: null,
    projectCount: 0,
    projectsTotalPages: 1,
    currentProjectsTotalPages: 1,
    oldProjectsTotalPages: 1,
    reports: { data: [] },
    dashboardStats: null,
    employees: {
        data: [],
        stats: {},
        pagination: {}
    },
    machinery: {
        data: [],
        stats: {},
        pagination: {}
    },
    employeeStatistics: {
        data: [],
        pagination: {},
        loading: false,
        error: null,
        lastFetched: null
    },
    machineryStatistics: {
        data: [],
        pagination: {},
        loading: false,
        error: null,
        lastFetched: null
    },
    requestStatus: null,
    joinRequests: {
        data: [],
        loading: false,
        error: null,
        pagination: {
            totalRequests: 0,
            totalPages: 1,
            currentPage: 1,
            pageSize: 10,
        },
    },
    inviteRequests: {
        data: [],
        loading: false,
        error: null,
        pagination: {
            totalRequests: 0,
            totalPages: 1,
            currentPage: 1,
            pageSize: 10,
        },
    },
    adminReports: {
        data: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalReports: 0,
            limit: 5
        },
        loading: false,
        error: null
    },
    subContractorDocuments: {
        data: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalDocuments: 0
        },
        loading: false,
        error: null
    }
};

export const updateContractor = createAsyncThunk(
    'contractor/update',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/contractor/update', {
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

export const addProject = createAsyncThunk(
    'contractor/addProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/contractor/project/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
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

export const fetchContractors = createAsyncThunk(
    'admin/fetchContractors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/companies');
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

export const fetchCompanyByContractor = createAsyncThunk(
    'contractor/fetchCompanyByContractor',
    async ( userId , { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/contractor/company?userId=${userId}`);
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

export const fetchAllComapnyProfiles = createAsyncThunk(
    'subCompanies/fetchAllComapnyProfiles',
    async ( id , { rejectWithValue }) => {
      try {
        const response = await fetch(`/api/contractor/profiles?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch company profiles');
        const data = await response.json();
        return data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const fetchProject = createAsyncThunk(
    'contractor/fetchProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/contractor/project/${projectId}`);
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

export const updateProject = createAsyncThunk(
    'contractor/updateProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/contractor/project/${projectId}`
                , {
                    method: 'PUT',
                }
            );
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

export const fetchAllProjects = createAsyncThunk(
    'contractor/fetchAllProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/contractor/project');
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

export const fetchProjects = createAsyncThunk(
    'contractor/fetchProjects',
    async ({ isCompleted, page, pageSize }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/contractor/projectsByCompletion?isCompleted=${isCompleted}&page=${page}&pageSize=${pageSize}`
            );
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            const data = await response.json();
            return {
                projects: data.projects,
                totalPages: data.totalPages,
                isCompleted,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProjectsByUserId = createAsyncThunk(
    'contractor/fetchProjectsByUserId',
    async ({ userId, isCompleted, page, pageSize }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/contractor/project/contractor/${userId}?isCompleted=${isCompleted}&page=${page}&pageSize=${pageSize}`
            );
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            const data = await response.json();
            return { data: data.projects, totalPages: data.totalPages, isCompleted };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchContractorStatistics = createAsyncThunk(
    'contractor/fetchContractorStatistics',
    async ({ contractorId, page, pageSize }, { rejectWithValue }) => {
        if (!mongoose.Types.ObjectId.isValid(contractorId)) {
            return rejectWithValue('Invalid Contractor ID format');
        }
        try {
            const response = await fetch(
                `/api/statistics/contractor?contractorId=${contractorId}&page=${page}&pageSize=${pageSize}`
            );
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

export const fetchReports = createAsyncThunk(
    'contractor/fetchReports',
    async ({ contractorId, month, year, search }) => {
        try {
            const queryParams = new URLSearchParams({
                contractorId,
                ...(month && { month }),
                ...(year && { year }),
                ...(search && { search })
            }).toString();

            const response = await fetch(
                `/api/statistics/reports?${queryParams}`
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            const { data: reports, timestamp } = data;
            return { data: reports, timestamp };
        } catch (error) {
            throw error;
        }
    }
);

export const fetchDashboardStats = createAsyncThunk(
    'contractor/fetchDashboardStats',
    async (contractorId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/statistics/contractor/dashboard-stats?contractorId=${contractorId}`);
            if (!response.ok) throw new Error('Failed to fetch dashboard stats');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEmployees = createAsyncThunk(
    'contractor/fetchEmployees',
    async ({ contractorId, page, pageSize }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/statistics/contractor/employees?contractorId=${contractorId}&page=${page}&pageSize=${pageSize}`
            );
            if (!response.ok) throw new Error('Failed to fetch employees');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMachinery = createAsyncThunk(
    'contractor/fetchMachinery',
    async ({ contractorId, page, pageSize }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/statistics/contractor/machinery?contractorId=${contractorId}&page=${page}&pageSize=${pageSize}`
            );
            if (!response.ok) throw new Error('Failed to fetch machinery');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEmployeeStatistics = createAsyncThunk(
    'contractor/fetchEmployeeStatistics',
    async ({ contractorId, page, pageSize }, { getState, rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/statistics/contractor/employees?contractorId=${contractorId}&page=${page}&pageSize=${pageSize}`
            );
            if (!response.ok) throw new Error('Failed to fetch employee statistics');
            const data = await response.json();
            return {
                ...data,
                lastFetched: Date.now()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMachineryStatistics = createAsyncThunk(
    'contractor/fetchMachineryStatistics',
    async ({ contractorId, page, pageSize }, { getState, rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/statistics/contractor/machinery?contractorId=${contractorId}&page=${page}&pageSize=${pageSize}`
            );
            if (!response.ok) throw new Error('Failed to fetch machinery statistics');
            const data = await response.json();
            return {
                ...data,
                lastFetched: Date.now()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const submitInviteRequest = createAsyncThunk(
    'contractor/submitInviteRequest',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/contractor/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const submitJoinRequest = createAsyncThunk(
    'contractor/submitJoinRequest',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/contractor/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchJoinRequests = createAsyncThunk(
    'admin/fetchJoinRequests',
    async ({ page, pageSize }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/admin/join-requests?page=${page}&pageSize=${pageSize}`);
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

export const handleJoinRequest = createAsyncThunk(
    'admin/handleJoinRequest',
    async ({ id, actionType }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/admin/join-requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: actionType }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return { id, action: actionType };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAdminReports = createAsyncThunk(
    'admin/fetchReports',
    async ({ page = 1, limit = 5, month, year, search }, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(month && { month }),
                ...(year && { year }),
                ...(search && { search })
            }).toString();

            const response = await fetch(`/api/admin/reports?${query}`);
            if (!response.ok) throw new Error('Failed to fetch admin reports');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSubContractorDocuments = createAsyncThunk(
    'contractor/fetchDocuments',
    async ({ contractorId, page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/contractor/documents?contractorId=${contractorId}&page=${page}&limit=${limit}&search=${search}`
            );
            if (!response.ok) throw new Error('Failed to fetch documents');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const contractorSlice = createSlice({
    name: 'contractor',
    initialState,
    reducers: {
        setProjectsPage: (state, action) => {
            state.projectsPage = action.payload;
        },
        setCurrentProjectsPage: (state, action) => {
            state.currentProjectsPage = action.payload;
        },
        setOldProjectsPage: (state, action) => {
            state.oldProjectsPage = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setIsCompleted: (state, action) => {
            state.isCompleted = action.payload;
        },
        setJoinRequestsPage: (state, action) => {
            state.joinRequests.pagination.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateContractor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateContractor.fulfilled, (state, action) => {
                state.loading = false;
                state.contractor = action.payload;
            })
            .addCase(updateContractor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.push(action.payload);
            })
            .addCase(addProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchContractors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContractors.fulfilled, (state, action) => {
                state.loading = false;
                state.contractors = action.payload;
            })
            .addCase(fetchContractors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCompanyByContractor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyByContractor.fulfilled, (state, action) => {
                state.loading = false;
                state.company = action.payload;
            })
            .addCase(fetchCompanyByContractor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllComapnyProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllComapnyProfiles.fulfilled, (state, action) => {
                state.loading = false;
                state.companyProfiles = action.payload;
            })
            .addCase(fetchAllComapnyProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload;
            })
            .addCase(fetchProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchAllProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.projects;
                state.totalPages = action.payload.totalPages;
                state.isCompleted = action.payload.isCompleted;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProjectsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                const { data, totalPages, isCompleted } = action.payload;
                if (isCompleted === 'false') {
                    state.currentProjects = data;
                    state.currentProjectsTotalPages = totalPages;
                } else {
                    state.oldProjects = data;
                    state.oldProjectsTotalPages = totalPages;
                }
            })
            .addCase(fetchProjectsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchContractorStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContractorStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload;
                state.projectCount = action.payload.projectCount;
            })
            .addCase(fetchContractorStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload;
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.reports = { data: [] };
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.dashboardStats = action.payload;
                state.loading = false;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.employees = action.payload;
                state.loading = false;
            })
            .addCase(fetchMachinery.fulfilled, (state, action) => {
                state.machinery = action.payload;
                state.loading = false;
            })
            .addCase(fetchEmployeeStatistics.pending, (state) => {
                state.employeeStatistics.loading = true;
                state.employeeStatistics.error = null;
            })
            .addCase(fetchEmployeeStatistics.fulfilled, (state, action) => {
                state.employeeStatistics.loading = false;
                state.employeeStatistics.data = action.payload.data;
                state.employeeStatistics.pagination = action.payload.pagination;
                state.employeeStatistics.lastFetched = action.payload.lastFetched;
            })
            .addCase(fetchEmployeeStatistics.rejected, (state, action) => {
                state.employeeStatistics.loading = false;
                state.employeeStatistics.error = action.payload;
            })
            .addCase(fetchMachineryStatistics.pending, (state) => {
                state.machineryStatistics.loading = true;
                state.machineryStatistics.error = null;
            })
            .addCase(fetchMachineryStatistics.fulfilled, (state, action) => {
                state.machineryStatistics.loading = false;
                state.machineryStatistics.data = action.payload.data;
                state.machineryStatistics.pagination = action.payload.pagination;
                state.machineryStatistics.lastFetched = action.payload.lastFetched;
            })
            .addCase(fetchMachineryStatistics.rejected, (state, action) => {
                state.machineryStatistics.loading = false;
                state.machineryStatistics.error = action.payload;
            })
            .addCase(submitInviteRequest.pending,(state)=> {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitInviteRequest.fulfilled,(state, action)=> {
                state.loading = false;
                state.requestStatus = 'success';
            })
            .addCase(submitInviteRequest.rejected,(state, action)=> {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitJoinRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitJoinRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.requestStatus = 'success';
            })
            .addCase(submitJoinRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchJoinRequests.pending, (state) => {
                state.joinRequests.loading = true;
                state.joinRequests.error = null;
            })
            .addCase(fetchJoinRequests.fulfilled, (state, action) => {
                state.joinRequests.loading = false;
                state.joinRequests.data = action.payload.data;
                state.joinRequests.pagination = action.payload.pagination;
            })
            .addCase(fetchJoinRequests.rejected, (state, action) => {
                state.joinRequests.loading = false;
                state.joinRequests.error = action.payload;
            })
            .addCase(handleJoinRequest.fulfilled, (state, action) => {
                state.joinRequests.data = state.joinRequests.data.filter(
                    (request) => request._id !== action.payload.id
                );
            })
            .addCase(fetchAdminReports.pending, (state) => {
                state.adminReports.loading = true;
                state.adminReports.error = null;
            })
            .addCase(fetchAdminReports.fulfilled, (state, action) => {
                state.adminReports.loading = false;
                state.adminReports.data = action.payload.data;
                state.adminReports.pagination = action.payload.pagination;
            })
            .addCase(fetchAdminReports.rejected, (state, action) => {
                state.adminReports.loading = false;
                state.adminReports.error = action.payload;
            })
            .addCase(fetchSubContractorDocuments.pending, (state) => {
                state.subContractorDocuments.loading = true;
                state.subContractorDocuments.error = null;
            })
            .addCase(fetchSubContractorDocuments.fulfilled, (state, action) => {
                state.subContractorDocuments.loading = false;
                state.subContractorDocuments.data = action.payload.documents;
                state.subContractorDocuments.pagination = action.payload.pagination;
            })
            .addCase(fetchSubContractorDocuments.rejected, (state, action) => {
                state.subContractorDocuments.loading = false;
                state.subContractorDocuments.error = action.payload;
            });
    },
});

export const { setProjectsPage, setCurrentProjectsPage, setOldProjectsPage, setCurrentPage, setIsCompleted, setJoinRequestsPage } = contractorSlice.actions;

export default contractorSlice.reducer;
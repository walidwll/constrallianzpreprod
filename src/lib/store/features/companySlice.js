import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addCompany = createAsyncThunk(
    'companies/addCompany',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/companies/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.message);
            }
            return data.company;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCompanies = createAsyncThunk(
    'companies/fetchCompanies',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/companies?page=${page}&limit=${limit}`);
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.message);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchStatistics = createAsyncThunk(
    'companies/fetchStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/statistics`);
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.message);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPaginatedEmployees = createAsyncThunk(
    'companies/fetchPaginatedEmployees',
    async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/employees?page=${page}&limit=${limit}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchPaginatedSubContractors = createAsyncThunk(
    'companies/fetchPaginatedSubContractors',
    async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/sub-contractor?page=${page}&limit=${limit}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPaginatedMachinery = createAsyncThunk(
    'companies/fetchPaginatedMachinery',
    async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/machinery?page=${page}&limit=${limit}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add this with other actions
export const fetchAllSubContractors = createAsyncThunk(
    'companies/fetchAllSubContractors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/sub-contractor/all`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const companySlice = createSlice({
    name: 'companies',
    initialState: {
        companies: [],
        loading: false,
        error: null,
        totalPages: 0,
        currentPage: 1,
        totalItems: 0,
        statistics: {
            employeeCount: 0,
            subcontractorCount: 0,
            contractorCount: 0,
            machineryCount: 0,
            employeeRatings: [],
            loading: false,
            error: null
        },
        paginatedData: {
            employees: { data: [], totalPages: 0, currentPage: 1, totalItems: 0 },
            machinery: { data: [], totalPages: 0, currentPage: 1, totalItems: 0 },
            subcontractors: { data: [], totalPages: 0, currentPage: 1, totalItems: 0 }
        },
        allSubContractors: [], // Add this line
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.companies.push(action.payload);
            })
            .addCase(addCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCompanies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.companies = action.payload.companies;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalItems = action.payload.totalItems;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchStatistics.pending, (state) => {
                state.statistics.loading = true;
            })
            .addCase(fetchStatistics.fulfilled, (state, action) => {
                state.statistics.loading = false;
                state.statistics = { ...state.statistics, ...action.payload };
            })
            .addCase(fetchStatistics.rejected, (state, action) => {
                state.statistics.loading = false;
                state.statistics.error = action.payload;
            })
            .addCase(fetchPaginatedEmployees.fulfilled, (state, action) => {
                state.paginatedData.employees = action.payload;
            })
            .addCase(fetchPaginatedMachinery.fulfilled, (state, action) => {
                state.paginatedData.machinery = action.payload;
            })
            .addCase(fetchPaginatedSubContractors.fulfilled, (state, action) => {
                state.paginatedData.subcontractors = action.payload;
            })
            .addCase(fetchAllSubContractors.fulfilled, (state, action) => {
                state.allSubContractors = action.payload;
            });
    },
});

export default companySlice.reducer;
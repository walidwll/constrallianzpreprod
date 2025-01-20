import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    projects: [],
    employee: null,
    employees: [],
    allEmployees: [],
    applications: [],
    loading: false,
    error: null,
    applicationSuccess: false,
    isCheckedIn: false,
    checkInTime: null,
    checkInDuration: null,
};

export const fetchEmployeeApplications = createAsyncThunk(
    'employee/fetchApplications',
    async (employeeId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/employee/applications?employeeId=${employeeId}`);
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

export const fetchEmployees = createAsyncThunk(
    'employee/fetchEmployees',
    async ({ companyId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/company/${companyId}/employees`);
            if (!response.ok) throw new Error('Failed to fetch employees');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchAllEmployees = createAsyncThunk(
    'employee/fetchAllEmployees',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams(filters).toString();
            const response = await fetch(`/api/employee/all?${query}`);
            if (!response.ok) throw new Error('Failed to fetch employees');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEmployeeProjects = createAsyncThunk(
    'employee/fetchProjects',
    async (employeeId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/employee/projects?employeeId=${employeeId}`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchEmployeeDetails = createAsyncThunk(
    'employee/fetchDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/employee/${id}`);
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

export const updateEmployeeDetails = createAsyncThunk(
    'employee/updateDetails',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/employee/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
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

export const updateEmployee = createAsyncThunk(
    'employee/update',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/employee/update', {
                method: 'PUT',
                body: formData,
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

export const createNewApplication = createAsyncThunk(
    'employee/createApplication',
    async ({ employeeId, subCompanyId }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/applications/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeId, subCompanyId }),
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

export const checkIn = createAsyncThunk(
    'employee/checkIn',
    async ({ employeeId, supervisorId }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/attendance/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId, supervisorId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Check-in failed');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkOut = createAsyncThunk(
    'employee/checkOut',
    async ({ employeeId, supervisorId }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/attendance/check-out', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeId, supervisorId }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Check-out failed');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAttendanceStatus = createAsyncThunk(
    'employee/fetchAttendanceStatus',
    async (employeeId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/attendance/status?employeeId=${employeeId}`);
            if (!response.ok) throw new Error('Failed to fetch status');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        resetApplicationState: (state) => {
            state.applicationSuccess = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeeApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload;
            })
            .addCase(fetchEmployeeApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEmployeeProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchEmployeeProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(fetchEmployeeDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.employee = action.payload;
            })
            .addCase(fetchEmployeeDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateEmployeeDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployeeDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.employee = action.payload;
            })
            .addCase(updateEmployeeDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employee = action.payload;
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createNewApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.applicationSuccess = false;
            })
            .addCase(createNewApplication.fulfilled, (state) => {
                state.loading = false;
                state.applicationSuccess = true;
            })
            .addCase(createNewApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.allEmployees = action.payload;
            })
            .addCase(fetchAllEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(checkIn.fulfilled, (state) => {
                state.isCheckedIn = true;
                state.checkInTime = new Date().toISOString();
                state.checkInDuration = '0h 0m';
            })
            .addCase(checkOut.fulfilled, (state) => {
                state.isCheckedIn = false;
                state.checkInTime = null;
                state.checkInDuration = null;
            })
            .addCase(checkOut.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchAttendanceStatus.fulfilled, (state, action) => {
                state.isCheckedIn = action.payload.isCheckedIn;
                state.checkInTime = action.payload.checkInTime;
                state.checkInDuration = action.payload.duration;
            });
    },
});

export const { resetApplicationState } = employeeSlice.actions;
export default employeeSlice.reducer;
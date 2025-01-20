'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addCompany } from '@/lib/store/features/companySlice';
import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';

const steps = ['Company Details', 'Director Details', 'Production Details', 'Supervisor Details'];

export default function AddCompany() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.companies);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        companyName: '',
        director: { name: '', email: '', phone: '', password: '' },
        production: { name: '', email: '', phone: '', password: '' },
        supervisor: { name: '', email: '', phone: '', password: '' },
    });
    const [emailError, setEmailError] = useState('');

    const handleChange = (e, role) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [role]: { ...prevData[role], [name]: value },
        }));
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emails = [formData.director.email, formData.production.email, formData.supervisor.email];
        const uniqueEmails = new Set(emails);

        if (uniqueEmails.size !== emails.length) {
            setEmailError('Emails must be unique for each role.');
            return;
        }

        setEmailError('');
        dispatch(addCompany(formData)).then((action) => {
            if (addCompany.fulfilled.match(action)) {
                router.push('/admin/dashboard');
            }
        });
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <TextField
                        label="Company Name"
                        variant="outlined"
                        fullWidth
                        required
                        value={formData.companyName}
                        onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
                        }
                    />
                );
            case 1:
            case 2:
            case 3:
                const role = steps[step].split(' ')[0].toLowerCase();
                return (
                    <>
                        <TextField
                            label="Name"
                            name="name"
                            variant="outlined"
                            fullWidth
                            required
                            value={formData[role].name}
                            onChange={(e) => handleChange(e, role)}
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            required
                            value={formData[role].email}
                            onChange={(e) => handleChange(e, role)}
                            margin="normal"
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            variant="outlined"
                            fullWidth
                            required
                            value={formData[role].phone}
                            onChange={(e) => handleChange(e, role)}
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            required
                            value={formData[role].password}
                            onChange={(e) => handleChange(e, role)}
                            margin="normal"
                        />
                    </>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <Button
                        startIcon={<FiArrowLeft />}
                        onClick={() => router.push('/admin/dashboard')}
                        className="mb-4 text-blue-600"
                    >
                        Back to Dashboard
                    </Button>
                    <Typography component="h1" variant="h4" align="center" gutterBottom className="text-blue-800">
                        Add New Company
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {emailError && <Alert severity="error">{emailError}</Alert>}
                    <Stepper activeStep={activeStep} className="pt-3 pb-5">
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <form onSubmit={handleSubmit}>
                        {getStepContent(activeStep)}
                        <Box className="flex justify-end mt-3">
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} className="mr-2">
                                    Back
                                </Button>
                            )}
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Add Company'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </form>
                </div>
            </div>
        </div>
    );
}
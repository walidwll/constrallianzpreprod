'use client';
import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '@/lib/store/features/authSlice';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());
        const loadingToast = toast.loading('Signing in...');
        try {
            const resultAction = await dispatch(loginUser({ ...formData }));
            if (loginUser.fulfilled.match(resultAction)) {
                toast.dismiss(loadingToast);
                toast.success('Logged in successfully!');
                router.push('/user/dashboard');
            } else {
                toast.dismiss(loadingToast);
                throw new Error(resultAction.payload || 'Login failed');
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err?.message);
            toast.error(err?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
            <Toaster
                position="top-center"
                toastOptions={{
                    success: {
                        duration: 3000,
                    },
                    error: {
                        duration: 5000,
                    },
                    loading: {
                        duration: Infinity,
                    },
                }}
            />
            <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl">

                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Login to Your Account
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md 
                              placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                placeholder="Enter your password"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md 
                              placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row gap-2 w-full'>
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="flex items-center justify-center space-x-2 w-full md:w-1/2 border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Go Back</span>
                        </button>
                        <button
                            type="submit"
                            className="group relative w-full md:w-1/2 flex justify-center py-2 px-4 border border-transparent 
                            text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                            transition-colors duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <Link
                            href="/signup"
                            className="font-medium transition-colors duration-200"
                        >
                            Don't have an account?
                            <span className='text-blue-600 hover:text-blue-500'> Sign up</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Login = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
        </Suspense>
    );
};

export default Login;
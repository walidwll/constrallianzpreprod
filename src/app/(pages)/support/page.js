'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSupportRequest } from '@/lib/store/features/authSlice';

const SupportPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);

  const categories = [
    'Technical Issue',
    'Account Problem',
    'Billing Question',
    'Feature Request',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(sendSupportRequest(formData));
    if (!result.error) {
      setSuccess(true);
      setFormData({ email: '', subject: '', category: '', message: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"/>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"/>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our support team is here to assist you. Please fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="lg:grid lg:grid-cols-5">
              {/* Info Section */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 lg:p-12 text-white lg:col-span-2">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>support@constrallianz.com</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>24/7 Support Available</span>
                  </div>
                </div>

                <div className="mt-12">
                  <h4 className="text-lg font-semibold mb-4">Response Times</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      Technical Issues: 2-4 hours
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      General Queries: 24 hours
                    </li>
                  </ul>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-8 lg:p-12 lg:col-span-3">
                {success ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                      <p className="text-gray-600">Your message has been sent successfully. We'll be in touch soon.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Form fields with floating labels */}
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="peer w-full border-b-2 border-gray-300 bg-transparent pt-8 pb-2 px-0 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none"
                          placeholder="Email"
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-0 top-2 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-8 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                          Email Address
                        </label>
                      </div>

                      {/* Similar floating label pattern for other inputs */}
                      <div className="relative">
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="peer w-full border-b-2 border-gray-300 bg-transparent pt-8 pb-2 px-0 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none"
                          placeholder="Subject"
                        />
                        <label
                          htmlFor="subject"
                          className="absolute left-0 top-2 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-8 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                          Subject
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="category"
                          id="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="peer w-full border-b-2 border-gray-300 bg-transparent pt-8 pb-2 px-0 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none"
                        >
                          <option value="" disabled>Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <label
                          htmlFor="category"
                          className="absolute left-0 top-2 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-8 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                          Category
                        </label>
                      </div>

                      <div className="relative col-span-1 md:col-span-2">
                        <textarea
                          name="message"
                          id="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="peer w-full border-b-2 border-gray-300 bg-transparent pt-8 pb-2 px-0 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none resize-none"
                          placeholder="Message"
                        />
                        <label
                          htmlFor="message"
                          className="absolute left-0 top-2 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-8 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                          Message
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
const AuthLayout = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-600">{title}</h2>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
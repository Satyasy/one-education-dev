import { Link } from 'react-router';
import { useRole } from '../hooks/useAuth';

const UnauthorizedPage: React.FC = () => {
    const { user } = useRole();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full mx-auto text-center px-4">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <svg 
                            className="w-10 h-10 text-red-600 dark:text-red-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You don't have permission to access this page.
                    </p>
                </div>

                {user && (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Current user: <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                        </p>
                        {user.roles && user.roles.length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-center">
                                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Roles:</span>
                                {user.roles.map((role: string, index: number) => (
                                    <span 
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <Link
                        to="/"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go to Dashboard
                    </Link>
                    
                    <button
                        onClick={() => window.history.back()}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back
                    </button>
                </div>

                <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
                    If you believe this is an error, please contact your administrator.
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import UsersList from '../components/UsersList';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ExampleApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Dashboard</h1>
          
          {/* Users Management */}
          <UsersList />
        </div>
        
        {/* Toast notifications */}
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
};

export default ExampleApp;
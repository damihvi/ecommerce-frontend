import React from 'react';
import useCategories from '../hooks/useCategories';

const AdminDashboardTest: React.FC = () => {
  console.log('AdminDashboard: Starting component render');
  
  // Hooks must be called at the top level
  console.log('AdminDashboard: About to call useCategories');
  const { categories, loading } = useCategories();
  console.log('AdminDashboard: useCategories called successfully', { categories, loading });
  
  try {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Admin Dashboard - Categories Test
          </h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Categories Status</h2>
            {loading ? (
              <p className="text-blue-600">🔄 Loading categories...</p>
            ) : (
              <div>
                <p className="text-green-600">✅ Categories loaded successfully!</p>
                <p className="text-gray-600">Found {categories?.length || 0} categories</p>
                {categories && categories.length > 0 && (
                  <ul className="mt-4">
                    {categories.slice(0, 3).map((category: any) => (
                      <li key={category.id} className="py-1">
                        • {category.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdminDashboard: Error in component', error);
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-red-900 mb-8">
            Error in AdminDashboard
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-600">❌ Error: {error?.toString()}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default AdminDashboardTest;

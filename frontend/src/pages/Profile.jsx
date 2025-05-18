import useAuthStore from '../stores/auth';

export default function Profile() {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
          {(user?.email || user?.username || 'U')[0].toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">{user?.email || user?.username || 'User'}</h2>
        <p className="text-gray-500 mb-6">Profile details and settings will appear here.</p>
        <div className="w-full border-t pt-6 mt-6">
          <p className="text-center text-gray-400 text-sm">More profile features coming soon!</p>
        </div>
      </div>
    </div>
  );
} 
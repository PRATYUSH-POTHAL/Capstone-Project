import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <div className="space-y-4">
            <div>
              <label className="text-gray-600">Name</label>
              <p className="text-xl font-semibold">{user?.name}</p>
            </div>
            <div>
              <label className="text-gray-600">Username</label>
              <p className="text-xl font-semibold">@{user?.username}</p>
            </div>
            <div>
              <label className="text-gray-600">Email</label>
              <p className="text-xl font-semibold">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type User = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
  phone: string;
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('role');

        if (error) {
          throw error;
        }

        setUsers(data || []);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hospital Staff</h1>
      
      {loading && <p className="text-gray-500">Loading users...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h2 className="text-lg font-semibold">{user.full_name}</h2>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Role:</span>{' '}
                  <span className="capitalize">{user.role}</span>
                </p>
                {user.department && (
                  <p className="text-sm">
                    <span className="font-medium">Department:</span>{' '}
                    {user.department}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{' '}
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                    {user.email}
                  </a>
                </p>
                {user.phone && (
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span>{' '}
                    <a href={`tel:${user.phone}`} className="text-blue-600 hover:underline">
                      {user.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && !error && users.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
} 
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

type NewUser = Omit<User, 'id'>;

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  // New user form state
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    email: '',
    full_name: '',
    role: 'doctor',
    department: '',
    phone: ''
  });

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

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSuccess(null);
    setFormError(null);
    
    try {
      // Check required fields
      if (!newUser.username || !newUser.email || !newUser.full_name || !newUser.role) {
        setFormError('Please fill in all required fields');
        return;
      }
      
      // Insert new user into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Reset form and show success message
      setNewUser({
        username: '',
        email: '',
        full_name: '',
        role: 'doctor',
        department: '',
        phone: ''
      });
      
      setFormSuccess('User added successfully!');
      
      // Refresh the user list
      fetchUsers();
      
    } catch (error: any) {
      console.error('Error adding user:', error);
      setFormError(error.message);
    }
  }
  
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hospital Staff</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Hide Form' : 'Add New Staff'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Add New Staff Member</h2>
          
          {formSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>{formSuccess}</p>
            </div>
          )}
          
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>Error: {formError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={newUser.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username*
                </label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role*
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Admin</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={newUser.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Staff Member
              </button>
            </div>
          </form>
        </div>
      )}
      
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
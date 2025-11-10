import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
// Assume api.getGuideBookings(userId)

const GuideDashboard = () => {
  const { role, user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (role === 'guide') {
      // api.getGuideBookings(user.id).then(res => setBookings(res.data));
      // Placeholder
      setBookings([{ id: 1, experience_title: 'Safari Tour', tour_date: '2025-11-10', status: 'pending' }]);
    }
  }, [role, user]);

  if (role !== 'guide') return <div>Access denied</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <a href="/guide/create" className="bg-blue-600 text-white px-4 py-2 rounded mb-6 inline-block">Create New Experience</a>
      <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Experience</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td className="border p-2">{b.experience_title}</td>
              <td className="border p-2">{b.tour_date}</td>
              <td className="border p-2">{b.status}</td>
              <td className="border p-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuideDashboard;
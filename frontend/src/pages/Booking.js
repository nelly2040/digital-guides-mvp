import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createBooking } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { getExperience } from '../services/api';  // To get price

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const BookingForm = ({ exp }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const { jwtToken } = useAuth();
  const [tourDate, setTourDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);

  useEffect(() => {
    if (jwtToken && exp) {
      createBooking({ experience_id: exp.id, tour_date: tourDate, guest_count: guestCount }, jwtToken)
        .then(res => setClientSecret(res.data.client_secret));
    }
  }, [jwtToken, exp, tourDate, guestCount]);  // Re-create intent on change

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (error) {
      console.error(error);
    } else if (paymentIntent.status === 'succeeded') {
      alert('Booking confirmed!');
      // Redirect to confirmation
    }
    setLoading(false);
  };

  if (!exp) return <div>Loading...</div>;

  const total = exp.price * guestCount;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Book {exp.title}</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tour Date</label>
        <input type="date" value={tourDate} onChange={(e) => setTourDate(e.target.value)} required className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Guests</label>
        <input type="number" min="1" value={guestCount} onChange={(e) => setGuestCount(parseInt(e.target.value))} className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Card Details</label>
        <CardElement className="p-3 border rounded" />
      </div>
      <p className="text-lg font-semibold mb-4">Total: ${total}</p>
      <button type="submit" disabled={!stripe || loading} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50">
        {loading ? 'Processing...' : 'Pay and Book'}
      </button>
    </form>
  );
};

const Booking = () => {
  const { id } = useParams();
  const [exp, setExp] = useState(null);

  useEffect(() => {
    getExperience(id).then(res => setExp(res.data));
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Elements stripe={stripePromise}>
        <BookingForm exp={exp} />
      </Elements>
    </div>
  );
};

export default Booking;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExperience, createBooking, getReviews } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../hooks/useAuth';
import ReviewForm from '../components/ReviewForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ exp, onBookingSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [guestCount, setGuestCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        alert('Payment error: ' + error.message);
        setProcessing(false);
        return;
      }

      const bookingData = {
        experience_id: exp.id,
        tour_date: selectedDate,
        guest_count: guestCount,
        payment_method_id: paymentMethod.id,
      };

      const response = await createBooking(bookingData);
      onBookingSuccess(response.data.booking_id);
    } catch (error) {
      alert('Booking failed: ' + error.response?.data?.error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Date</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Choose a date</option>
          {exp.available_dates.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Number of Guests</label>
        <input
          type="number"
          min="1"
          max="10"
          value={guestCount}
          onChange={(e) => setGuestCount(parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Card Details</label>
        <div className="p-3 border border-gray-300 rounded-lg">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xl font-semibold">
          Total: ${(exp.price * guestCount).toFixed(2)}
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg text-lg hover:bg-green-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${(exp.price * guestCount).toFixed(2)}`}
      </button>
    </form>
  );
};

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth();
  const [exp, setExp] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [completedBookingId, setCompletedBookingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    getExperience(id).then(res => setExp(res.data));
  }, [id, isAuthenticated, loginWithRedirect]);

  const handleBookingSuccess = (bookingId) => {
    setBookingComplete(true);
    setCompletedBookingId(bookingId);
    alert('Booking confirmed! Thank you for your purchase.');
  };

  const handleReviewSubmitted = () => {
    navigate(`/experiences/${id}`);
  };

  if (!isAuthenticated) return <div>Redirecting to login...</div>;
  if (!exp) return <div className="text-center py-8">Loading...</div>;

  if (bookingComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed! 🎉</h2>
          <p>Your experience "{exp.title}" has been booked successfully.</p>
        </div>
        
        <ReviewForm 
          bookingId={completedBookingId}
          experienceId={parseInt(id)}
          onReviewSubmitted={handleReviewSubmitted}
        />
        
        <button 
          onClick={() => navigate(`/experiences/${id}`)}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Experience
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Book: {exp.title}</h1>
      <p className="text-gray-600 mb-6">with {exp.guide.name}</p>
      
      <Elements stripe={stripePromise}>
        <CheckoutForm exp={exp} onBookingSuccess={handleBookingSuccess} />
      </Elements>
    </div>
  );
};

export default Booking;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { bookingsAPI, experiencesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ experience, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.first_name + ' ' + user?.last_name,
            email: user?.email,
          },
        }
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Create booking record
        await bookingsAPI.create({
          experience_id: experience.id,
          experience_date_id: tourDate,
          number_of_guests: guestCount,
          total_price: experience.price_per_person * guestCount,
          special_requests: ''
        });
        
        alert('Booking confirmed!');
        navigate('/my-bookings');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const total = experience.price_per_person * guestCount;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Book {experience.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Tour Date</label>
          <input 
            type="date" 
            value={tourDate} 
            onChange={(e) => setTourDate(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Number of Guests</label>
          <input 
            type="number" 
            min="1" 
            max={experience.max_group_size}
            value={guestCount} 
            onChange={(e) => setGuestCount(parseInt(e.target.value))} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
          />
          <p className="text-sm text-gray-500 mt-1">Max: {experience.max_group_size} guests</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">Card Details</label>
        <div className="p-4 border border-gray-300 rounded-lg">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Price per person:</span>
          <span className="font-semibold">${experience.price_per_person}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Number of guests:</span>
          <span className="font-semibold">{guestCount}</span>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-emerald-600">${total}</span>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || loading || !tourDate} 
        className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? 'Processing Payment...' : `Pay $${total} and Confirm Booking`}
      </button>
    </form>
  );
};

const Booking = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=booking');
      return;
    }

    const fetchExperience = async () => {
      try {
        const expResponse = await experiencesAPI.getById(id);
        setExperience(expResponse.experience);
        
        // Create payment intent
        const bookingData = {
          experience_id: parseInt(id),
          number_of_guests: 1,
          total_price: expResponse.experience.price_per_person
        };
        
        const bookingResponse = await bookingsAPI.create(bookingData);
        setClientSecret(bookingResponse.client_secret);
        
      } catch (error) {
        console.error('Error fetching experience:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Experience not found</h2>
          <button 
            onClick={() => navigate('/experiences')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            Browse Experiences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <Elements stripe={stripePromise}>
          <CheckoutForm experience={experience} clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
};

export default Booking;
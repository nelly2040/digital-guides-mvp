import React, { useState } from 'react';

const SafariCalculator = () => {
  const [formData, setFormData] = useState({
    duration: 3,
    travelers: 2,
    accommodation: 'midrange',
    season: 'high',
    parkFees: true,
    transport: true,
    meals: true
  });

  const calculateCost = () => {
    let baseCost = 0;
    
    // Base cost per person per day
    const baseRates = {
      budget: 150,
      midrange: 250,
      luxury: 450
    };

    // Season multipliers
    const seasonMultipliers = {
      low: 0.8,
      shoulder: 1.0,
      high: 1.3
    };

    baseCost = baseRates[formData.accommodation] * formData.duration * formData.travelers;
    baseCost *= seasonMultipliers[formData.season];

    // Additional costs
    if (formData.parkFees) baseCost += 70 * formData.duration * formData.travelers;
    if (formData.transport) baseCost += 100 * formData.duration;
    if (formData.meals) baseCost += 50 * formData.duration * formData.travelers;

    return Math.round(baseCost);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };

  const totalCost = calculateCost();

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Safari Cost Calculator
            </h1>
            <p className="text-lg text-neutral-600">
              Estimate your Kenyan safari costs based on your preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Safari Preferences</h2>
              
              <div className="space-y-6">
                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Safari Duration: {formData.duration} days
                  </label>
                  <input
                    type="range"
                    name="duration"
                    min="1"
                    max="14"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-neutral-500 mt-1">
                    <span>1 day</span>
                    <span>14 days</span>
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Number of Travelers: {formData.travelers}
                  </label>
                  <input
                    type="range"
                    name="travelers"
                    min="1"
                    max="12"
                    value={formData.travelers}
                    onChange={handleChange}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-neutral-500 mt-1">
                    <span>1 person</span>
                    <span>12 people</span>
                  </div>
                </div>

                {/* Accommodation */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Accommodation Level
                  </label>
                  <select
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleChange}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="budget">Budget (Camping/Basic Lodges)</option>
                    <option value="midrange">Mid-range (Comfortable Lodges)</option>
                    <option value="luxury">Luxury (Premium Lodges & Tented Camps)</option>
                  </select>
                </div>

                {/* Season */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Season
                  </label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Low Season (Apr-May, Nov)</option>
                    <option value="shoulder">Shoulder Season (Jan-Mar, Jun, Oct)</option>
                    <option value="high">High Season (Jul-Sep, Dec)</option>
                  </select>
                </div>

                {/* Inclusions */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Inclusions
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="parkFees"
                        checked={formData.parkFees}
                        onChange={handleChange}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Park Fees & Conservation Charges</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="transport"
                        checked={formData.transport}
                        onChange={handleChange}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Transport in 4x4 Safari Vehicle</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="meals"
                        checked={formData.meals}
                        onChange={handleChange}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">All Meals & Drinking Water</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Estimated Cost</h2>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  ${totalCost.toLocaleString()}
                </div>
                <p className="text-neutral-600">Total for {formData.travelers} traveler{formData.travelers > 1 ? 's' : ''}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span>Accommodation ({formData.accommodation})</span>
                  <span>${Math.round(totalCost * 0.5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span>Transport & Guide</span>
                  <span>${Math.round(totalCost * 0.25).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span>Park Fees & Activities</span>
                  <span>${Math.round(totalCost * 0.15).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span>Meals & Extras</span>
                  <span>${Math.round(totalCost * 0.1).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary-50 rounded-lg">
                <h3 className="font-semibold text-primary-900 mb-2">What's Included:</h3>
                <ul className="text-sm text-primary-700 space-y-1">
                  <li>• Professional safari guide</li>
                  <li>• Comfortable 4x4 safari vehicle</li>
                  <li>• All game drives as per itinerary</li>
                  {formData.parkFees && <li>• All park entry fees</li>}
                  {formData.meals && <li>• All meals and drinking water</li>}
                  <li>• Accommodation as selected</li>
                </ul>
              </div>

              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold mt-6 transition-colors duration-200">
                Book Similar Safari Experience
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafariCalculator;
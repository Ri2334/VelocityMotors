import React, { useState, useEffect } from 'react';
import vehicleService from '../services/vehicleService';
import VehicleCard from '../components/VehicleCard';
import Toast from '../components/Toast';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(null); // stores vehicleId being purchased
  const [toast, setToast] = useState(null); // stores { message, type }

  // Filter States
  const [make, setMake] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.searchVehicles({
        make,
        category,
        minPrice,
        maxPrice
      });
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (err) {
      showToast('Failed to load inventory vehicles.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reload vehicles when filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVehicles();
    }, 400); // 400ms debounce
    return () => clearTimeout(delayDebounce);
  }, [make, category, minPrice, maxPrice]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handlePurchase = async (vehicleId) => {
    setPurchaseLoading(vehicleId);
    try {
      const response = await vehicleService.purchaseVehicle(vehicleId);
      if (response.success) {
        showToast('Vehicle purchased successfully!');
        // Update local state quantity
        setVehicles(prevVehicles =>
          prevVehicles.map(v =>
            v._id === vehicleId ? { ...v, quantity: v.quantity - 1 } : v
          )
        );
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to complete purchase.';
      showToast(message, 'error');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const clearFilters = () => {
    setMake('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Filter panel */}
      <section className="bg-brand-900 border border-brand-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-brand-100">Filter Inventory</h3>
            <button
              onClick={clearFilters}
              className="text-xs text-accent-400 hover:text-accent-300 font-bold transition-all"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Make search */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider" htmlFor="makeFilter">
                Brand / Make
              </label>
              <input
                id="makeFilter"
                type="text"
                className="bg-brand-950 border border-brand-800 text-brand-100 text-sm px-3.5 py-2.5 rounded-xl focus:border-accent-500 focus:outline-none transition-all placeholder-brand-700"
                placeholder="e.g. Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider" htmlFor="categoryFilter">
                Body Category
              </label>
              <select
                id="categoryFilter"
                className="bg-brand-950 border border-brand-800 text-brand-100 text-sm px-3.5 py-2.5 rounded-xl focus:border-accent-500 focus:outline-none transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            {/* Min price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider" htmlFor="minPriceFilter">
                Minimum Price (₹)
              </label>
              <input
                id="minPriceFilter"
                type="number"
                min="0"
                className="bg-brand-950 border border-brand-800 text-brand-100 text-sm px-3.5 py-2.5 rounded-xl focus:border-accent-500 focus:outline-none transition-all placeholder-brand-700"
                placeholder="e.g. 10000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            {/* Max price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider" htmlFor="maxPriceFilter">
                Maximum Price (₹)
              </label>
              <input
                id="maxPriceFilter"
                type="number"
                min="0"
                className="bg-brand-950 border border-brand-800 text-brand-100 text-sm px-3.5 py-2.5 rounded-xl focus:border-accent-500 focus:outline-none transition-all placeholder-brand-700"
                placeholder="e.g. 50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid inventory list */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-500 border-t-transparent"></div>
            <p className="text-brand-400 text-xs tracking-wider animate-pulse">Loading catalog...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 bg-brand-900 border border-brand-800/80 rounded-3xl p-8 shadow-xl">
            <h4 className="text-xl font-bold text-brand-300">No Vehicles Found</h4>
            <p className="text-brand-500 text-sm mt-1">Try modifying your filters to explore options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map(vehicle => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onPurchase={handlePurchase}
                purchaseLoading={purchaseLoading === vehicle._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import Toast from '../components/Toast';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await vehicleService.getVehicle(id);
        if (response.success) {
          setVehicle(response.data);
        }
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    try {
      const response = await vehicleService.purchaseVehicle(vehicle._id);
      if (response.success) {
        showToast('Vehicle purchased successfully!');
        setVehicle(prev => ({ ...prev, quantity: prev.quantity - 1 }));
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to complete purchase.';
      showToast(message, 'error');
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-500 border-t-transparent"></div>
        <p className="text-brand-400 text-xs tracking-wider">Loading details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-20 bg-brand-900 border border-brand-800 rounded-3xl p-8 shadow-xl">
        <h4 className="text-xl font-bold text-brand-300">Vehicle Not Found</h4>
        <p className="text-brand-500 text-sm mt-1">The vehicle specification sheets might have been removed.</p>
        <Link to="/" className="text-accent-400 hover:text-accent-300 text-sm font-bold mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className="flex flex-col gap-6 font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        <Link to="/" className="text-xs text-brand-400 hover:text-accent-400 font-bold transition-all flex items-center gap-1">
          ← Back to Inventory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Specs sheet */}
        <div className="lg:col-span-2 bg-brand-900 border border-brand-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
          <span className="text-xs text-accent-500 font-extrabold uppercase tracking-widest bg-accent-500/5 px-2.5 py-1 rounded-md">
            {vehicle.category}
          </span>
          <h2 className="text-3xl font-black text-brand-50 mt-3 mb-6">
            {vehicle.make} {vehicle.model}
          </h2>

          <h3 className="text-sm font-bold text-brand-400 uppercase tracking-widest border-b border-brand-850 pb-2 mb-4">
            Technical Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-brand-950/60 p-4 border border-brand-850/40 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Manufacturer</span>
              <span className="text-brand-100 font-bold text-sm">{vehicle.make}</span>
            </div>
            <div className="bg-brand-950/60 p-4 border border-brand-850/40 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Model Range</span>
              <span className="text-brand-100 font-bold text-sm">{vehicle.model}</span>
            </div>
            <div className="bg-brand-950/60 p-4 border border-brand-850/40 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Body Classification</span>
              <span className="text-brand-100 font-bold text-sm">{vehicle.category}</span>
            </div>
            <div className="bg-brand-950/60 p-4 border border-brand-850/40 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Acquisition Date</span>
              <span className="text-brand-100 font-bold text-sm">
                {new Date(vehicle.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action card */}
        <div className="bg-brand-900 border border-brand-800/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-fit gap-8">
          <div>
            <h3 className="text-[10px] font-extrabold text-brand-400 uppercase tracking-widest mb-3">Investment Details</h3>
            <p className="text-4xl font-black text-brand-50">₹{vehicle.price?.toLocaleString('en-IN')}</p>
            
            <div className="mt-6 flex items-center justify-between border-t border-brand-850 pt-4 text-xs font-semibold">
              <span className="text-brand-400">Stock Availability</span>
              {isOutOfStock ? (
                <span className="bg-accent-500/10 text-accent-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Sold Out
                </span>
              ) : (
                <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {vehicle.quantity} Available
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isOutOfStock || purchaseLoading}
            className="w-full bg-accent-600 hover:bg-accent-500 disabled:bg-brand-850 disabled:text-brand-500 disabled:opacity-40 disabled:scale-100 text-brand-50 font-bold py-3.5 px-4 rounded-xl text-sm shadow-lg hover:shadow-accent-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {purchaseLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-50 border-t-transparent"></div>
                Processing...
              </>
            ) : (
              'Acquire / Purchase'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;

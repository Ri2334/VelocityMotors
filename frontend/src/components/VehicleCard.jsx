import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle, onPurchase, purchaseLoading }) => {
  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className="bg-brand-900 border border-brand-800/80 rounded-3xl p-5 shadow-lg flex flex-col justify-between hover:border-brand-750 hover:scale-[1.01] transition-all relative overflow-hidden group">
      {/* Availability Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        {isOutOfStock ? (
          <span className="bg-accent-500/10 text-accent-400 border border-accent-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Out of Stock
          </span>
        ) : (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {vehicle.quantity} In Stock
          </span>
        )}
      </div>

      <div className="mb-6">
        <span className="text-[10px] text-accent-500 font-extrabold uppercase tracking-widest bg-accent-500/5 px-2.5 py-0.5 rounded-md">
          {vehicle.category}
        </span>
        <h3 className="text-xl font-bold text-brand-100 mt-2 truncate group-hover:text-accent-400 transition-colors">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-2xl font-black text-brand-50 mt-3">
          ₹{vehicle.price?.toLocaleString('en-IN')}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to={`/vehicles/${vehicle._id}`}
          className="flex-1 text-center bg-brand-800 hover:bg-brand-700 border border-brand-700/60 text-brand-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
        >
          View Details
        </Link>
        
        <button
          onClick={() => onPurchase(vehicle._id)}
          disabled={isOutOfStock || purchaseLoading}
          className="flex-1 bg-accent-600 hover:bg-accent-500 disabled:bg-brand-850 disabled:border-brand-800 disabled:text-brand-500 disabled:opacity-40 disabled:scale-100 disabled:shadow-none text-brand-50 font-bold py-2.5 px-4 rounded-xl text-xs shadow-md hover:shadow-accent-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
        >
          {purchaseLoading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-brand-50 border-t-transparent"></div>
          ) : (
            'Purchase'
          )}
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;

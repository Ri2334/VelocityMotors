import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Restock States
  const [restockingId, setRestockingId] = useState(null); // ID of row in restock mode
  const [restockAmount, setRestockAmount] = useState('');

  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.getVehicles();
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (err) {
      showToast('Failed to load inventory for admin dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleRestockSubmit = async (vehicleId) => {
    const amount = parseInt(restockAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a positive restock quantity.', 'error');
      return;
    }

    try {
      const response = await vehicleService.restockVehicle(vehicleId, amount);
      if (response.success) {
        showToast('Inventory restocked successfully!');
        setVehicles(prev =>
          prev.map(v => (v._id === vehicleId ? { ...v, quantity: v.quantity + amount } : v))
        );
        cancelRestockMode();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to restock vehicle.', 'error');
    }
  };

  const startRestockMode = (vehicleId) => {
    setRestockingId(vehicleId);
    setRestockAmount('');
  };

  const cancelRestockMode = () => {
    setRestockingId(null);
    setRestockAmount('');
  };

  const openDeleteModal = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setVehicleToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;

    try {
      const response = await vehicleService.deleteVehicle(vehicleToDelete._id);
      if (response.success) {
        showToast('Vehicle deleted successfully.');
        setVehicles(prev => prev.filter(v => v._id !== vehicleToDelete._id));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete vehicle.', 'error');
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete Confirmation Gate */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Vehicle Listing"
        message={`Are you sure you want to remove the ${vehicleToDelete?.make} ${vehicleToDelete?.model} from the inventory? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-100">Inventory Dashboard</h2>
          <p className="text-brand-400 mt-1">Manage, update, and restock Velocity Motors vehicles catalog.</p>
        </div>

        <Link
          to="/admin/add"
          className="bg-accent-600 hover:bg-accent-500 text-brand-50 font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-md shadow-accent-500/10 flex items-center justify-center gap-1.5 w-fit"
        >
          <span>+ Add Vehicle</span>
        </Link>
      </header>

      {/* Database table view */}
      <div className="bg-brand-900 border border-brand-800/80 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-500 border-t-transparent"></div>
            <p className="text-brand-400 text-xs tracking-wider">Loading listings...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-400 font-semibold">No vehicles registered in inventory.</p>
            <Link to="/admin/add" className="text-accent-400 hover:text-accent-300 text-xs font-bold mt-2 inline-block">
              Add the first one now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-950/60 border-b border-brand-800 text-[10px] font-black uppercase text-brand-400 tracking-wider">
                  <th className="px-6 py-4">Make & Model</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Quantity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-850/40 text-sm">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-brand-950/20 transition-all">
                    {/* Make / Model */}
                    <td className="px-6 py-4 font-bold text-brand-100">
                      {vehicle.make} <span className="font-medium text-brand-300">{vehicle.model}</span>
                    </td>
                    
                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-brand-300 bg-brand-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {vehicle.category}
                      </span>
                    </td>
                    
                    {/* Price */}
                    <td className="px-6 py-4 font-black text-brand-100">
                      ₹{vehicle.price?.toLocaleString('en-IN')}
                    </td>
                    
                    {/* Stock Quantity / Inline Restock */}
                    <td className="px-6 py-4">
                      {restockingId === vehicle._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            className="bg-brand-950 border border-brand-800 text-brand-100 text-xs px-2 py-1.5 rounded-lg w-16 focus:outline-none focus:border-accent-500 font-bold"
                            placeholder="+ Qty"
                            value={restockAmount}
                            onChange={(e) => setRestockAmount(e.target.value)}
                          />
                          <button
                            onClick={() => handleRestockSubmit(vehicle._id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-brand-50 text-[10px] font-bold px-2 py-1.5 rounded-lg transition-all"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelRestockMode}
                            className="text-brand-500 hover:text-brand-300 text-[10px] font-bold px-1 py-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${vehicle.quantity === 0 ? 'text-accent-500' : 'text-brand-100'}`}>
                            {vehicle.quantity}
                          </span>
                          <button
                            onClick={() => startRestockMode(vehicle._id)}
                            className="text-[10px] text-accent-500 hover:text-accent-400 font-black uppercase tracking-wider bg-accent-500/5 px-2 py-0.5 rounded"
                          >
                            Restock
                          </button>
                        </div>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3.5">
                      <Link
                        to={`/admin/edit/${vehicle._id}`}
                        className="text-brand-400 hover:text-brand-100 font-bold text-xs transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => openDeleteModal(vehicle)}
                        className="text-accent-400 hover:text-accent-300 font-bold text-xs transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

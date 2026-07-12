import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import Toast from '../components/Toast';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Sedan');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await vehicleService.getVehicle(id);
        if (response.success) {
          const { make: m, model: md, category: cat, price: p, quantity: q } = response.data;
          setMake(m);
          setModel(md);
          setCategory(cat);
          setPrice(p);
          setQuantity(q);
        }
      } catch (err) {
        setFormError('Failed to retrieve vehicle details.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!make || !model || !category || price === '' || quantity === '') {
      setFormError('Please fill in all form inputs');
      return;
    }

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity, 10);

    if (priceNum < 0) {
      setFormError('Price cannot be negative');
      return;
    }

    if (quantityNum < 0) {
      setFormError('Quantity cannot be negative');
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await vehicleService.updateVehicle(id, {
        make,
        model,
        category,
        price: priceNum,
        quantity: quantityNum
      });

      if (response.success) {
        setToast({ message: 'Vehicle details updated successfully!', type: 'success' });
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update vehicle details');
    } finally {
      setSubmitLoading(false);
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

  return (
    <div className="max-w-2xl mx-auto font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-4">
        <Link to="/admin" className="text-xs text-brand-400 hover:text-accent-400 font-bold transition-all flex items-center gap-1">
          ← Back to Admin Panel
        </Link>
      </div>

      <div className="bg-brand-900 border border-brand-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-black text-brand-50 mb-6 font-sans">Edit Vehicle Details</h2>

        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-accent-500/10 border border-accent-500/30 text-accent-400 text-sm font-semibold">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brand-400 uppercase tracking-widest" htmlFor="make">
                Brand / Make
              </label>
              <input
                id="make"
                type="text"
                required
                className="bg-brand-950 border border-brand-800 text-brand-100 text-sm px-4 py-3 rounded-xl focus:border-accent-500 focus:outline-none transition-all placeholder-brand-700"
                placeholder="e.g. Ford"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brand-400 uppercase tracking-widest" htmlFor="model">
                Model Range
              </label>
              <input
                id="model"
                type="text"
                required
                className="bg-brand-950 border border-brand-800 text-brand-100 text-sm px-4 py-3 rounded-xl focus:border-accent-500 focus:outline-none transition-all placeholder-brand-700"
                placeholder="e.g. Mustang"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brand-400 uppercase tracking-widest" htmlFor="category">
                Body Category
              </label>
              <select
                id="category"
                className="bg-brand-950 border border-brand-800 text-brand-100 text-sm px-4 py-3 rounded-xl focus:border-accent-500 focus:outline-none transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brand-400 uppercase tracking-widest" htmlFor="price">
                Price (₹)
              </label>
              <input
                id="price"
                type="number"
                min="0"
                required
                className="bg-brand-950 border border-brand-800 text-brand-100 text-sm px-4 py-3 rounded-xl focus:border-accent-500 focus:outline-none transition-all placeholder-brand-700"
                placeholder="e.g. 35000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brand-400 uppercase tracking-widest" htmlFor="quantity">
                Initial Stock
              </label>
              <input
                id="quantity"
                type="number"
                min="0"
                required
                className="bg-brand-950 border border-brand-800 text-brand-100 text-sm px-4 py-3 rounded-xl focus:border-accent-500 focus:outline-none transition-all placeholder-brand-700"
                placeholder="e.g. 5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="bg-accent-600 hover:bg-accent-500 text-brand-50 font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-accent-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {submitLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-50 border-t-transparent"></div>
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;

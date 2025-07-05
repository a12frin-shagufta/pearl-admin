import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FiX, FiCheckCircle, FiPlus, FiTrash2 } from "react-icons/fi";

const Offer = ({ token }) => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    description: "",
    expiresAt: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/offer/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(res.data.offers || []);
    } catch (err) {
      toast.error("Failed to fetch offers");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${backendUrl}/api/offer/add`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowSuccessPopup(true);
      setCurrentOffer(form.code);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setForm({
        code: "",
        discountPercentage: "",
        description: "",
        expiresAt: "",
      });
      fetchOffers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/offer/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      fetchOffers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete offer");
    }
  };

  useEffect(() => {
    if (token) fetchOffers();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-md rounded-lg">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center animate-bounce-in">
            <FiCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Offer Created!</h3>
            <p className="text-gray-600 mb-4">
              Your offer code <span className="font-bold">{currentOffer}</span> has been successfully created.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Create New Offer</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Offer Code</label>
            <input
              name="code"
              type="text"
              placeholder="SUMMER20"
              value={form.code}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 md:p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Discount %</label>
            <input
              name="discountPercentage"
              type="number"
              placeholder="20"
              min="1"
              max="100"
              value={form.discountPercentage}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 md:p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            name="description"
            type="text"
            placeholder="Summer special discount"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 md:p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
          <input
            name="expiresAt"
            type="date"
            value={form.expiresAt}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 p-2 md:p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center w-full md:w-auto px-6 py-3 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            <>
              <FiPlus className="mr-2" />
              Create Offer
            </>
          )}
        </button>
      </form>

      <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Active Offers</h3>
      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No active offers available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div key={offer._id} className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow relative bg-gray-50">
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors duration-200 z-10"
                  title="Delete offer"
                >
                  <FiTrash2 size={20} />
                </button>
                <div className="flex items-start justify-between pr-12">
                  <div>
                    <h4 className="font-bold text-lg text-blue-600">{offer.code}</h4>
                    {offer.description && (
                      <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                    )}
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {offer.discountPercentage}% OFF
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  {offer.expiresAt && (
                    <p className="text-xs text-gray-500">
                      Expires: {new Date(offer.expiresAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(offer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offer;
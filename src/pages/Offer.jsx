import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Offer = ({ token }) => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    description: "",
    expiresAt: "",
  });

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
    try {
      const res = await axios.post(`${backendUrl}/api/offer/add`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      setForm({
        code: "",
        discountPercentage: "",
        description: "",
        expiresAt: "",
      });
      fetchOffers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create offer");
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create New Offer</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          name="code"
          type="text"
          placeholder="Offer Code"
          value={form.code}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="discountPercentage"
          type="number"
          placeholder="Discount %"
          value={form.discountPercentage}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="description"
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="expiresAt"
          type="date"
          value={form.expiresAt}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Offer
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Active Offers</h3>
      <div className="space-y-3">
        {offers.length === 0 ? (
          <p className="text-gray-500">No active offers available.</p>
        ) : (
          offers.map((offer) => (
            <div key={offer._id} className="border p-4 rounded shadow relative">
              <button
                onClick={() => handleDelete(offer._id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
              >
                ✖
              </button>
              <h4 className="font-bold text-lg">{offer.code}</h4>
              <p className="text-sm text-gray-600">{offer.description}</p>
              <p className="text-sm">Discount: {offer.discountPercentage}%</p>
              {offer.expiresAt && (
                <p className="text-sm text-gray-500">
                  Expires: {new Date(offer.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Offer;

// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App"; // or import VITE_BACKEND_URL

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchOrders();
  }, [token]);

  const handleAction = async (orderId, action) => {
    try {
      await axios.post(`${backendUrl}/api/order/admin/confirm-payment`, { orderId, action }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order updated");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!token) return <p className="p-4">Please login as admin to view orders.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white p-4 rounded-lg border shadow-sm">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-base md:text-lg">Order: {o._id}</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Placed: {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm ${
                    o.paymentStatus === "Paid" 
                      ? "bg-green-100 text-green-800" 
                      : o.paymentStatus === "Half Paid"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {o.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <p><strong>Name:</strong> {o.name}</p>
                  <p><strong>Phone:</strong> {o.phone}</p>
                  <p><strong>Email:</strong> {o.email}</p>
                </div>
                <div>
                  <p><strong>Address:</strong> {o.address}, {o.city}, {o.state}</p>
                  {o.note && <p><strong>Note:</strong> {o.note}</p>}
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-4">
                <p className="font-medium text-sm md:text-base">Items</p>
                <ul className="list-disc pl-4 md:pl-6 mt-1 space-y-1">
                  {o.items.map((it, idx) => (
                    <li key={idx} className="text-sm">
                      {it.name} × {it.quantity} = {currency} {it.total}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Summary */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <p><strong>Subtotal:</strong> {currency} {o.subtotal}</p>
                  <p><strong>Shipping:</strong> {currency} {o.shipping}</p>
                </div>
                <div>
                  <p><strong>Total:</strong> {currency} {o.total}</p>
                  <p><strong>Advance Required:</strong> {currency} {o.advanceRequired}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-4 text-sm">
                <p><strong>Payment Method:</strong> {o.paymentMethod.toUpperCase()}</p>
                {o.transactionRef && <p><strong>Txn Ref:</strong> {o.transactionRef}</p>}
                {o.senderLast4 && <p><strong>Sender Last 4:</strong> {o.senderLast4}</p>}
              </div>

              {/* Payment Proofs */}
              <div className="mt-4">
                <p className="font-medium text-sm md:text-base">Proofs</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {o.paymentProofs && o.paymentProofs.length > 0 ? (
                    o.paymentProofs.map((pf) => (
                      <a 
                        key={pf.filename} 
                        href={`${backendUrl}${pf.url}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 underline text-sm"
                      >
                        View proof
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No proof uploaded</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  onClick={() => handleAction(o._id, "confirm")} 
                  className="px-3 py-2 bg-green-600 text-white rounded text-sm"
                >
                  Confirm Payment
                </button>
                <button 
                  onClick={() => handleAction(o._id, "mark-half")} 
                  className="px-3 py-2 bg-yellow-600 text-white rounded text-sm"
                >
                  Mark Half Paid
                </button>
                <button 
                  onClick={() => handleAction(o._id, "reject")} 
                  className="px-3 py-2 bg-red-600 text-white rounded text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
};

export default Order;
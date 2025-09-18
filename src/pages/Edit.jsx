import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    bestseller: false,
    description: "",
    details: [],
    faqs: [], // ✅ new field
  });

  const [categories, setCategories] = useState([]);
  const [detailInput, setDetailInput] = useState("");
  const [faqInput, setFaqInput] = useState({ question: "", answer: "" }); // ✅ for faq input

  // Fetch product + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.post(`${backendUrl}/api/product/single`, { productId: id }),
          axios.get(`${backendUrl}/api/category/list`),
        ]);

        if (productRes.data.success) {
          const product = productRes.data.product;

          // normalize details
          let detailsArr = [];
          if (Array.isArray(product.details)) {
            detailsArr = product.details;
          } else if (typeof product.details === "string") {
            try {
              detailsArr = JSON.parse(product.details);
              if (!Array.isArray(detailsArr)) {
                detailsArr = [product.details];
              }
            } catch {
              detailsArr = product.details.trim() ? [product.details] : [];
            }
          }

          setForm({
            ...product,
            details: detailsArr,
            faqs: product.faqs || [], // ✅ normalize faqs
          });
        }

        if (categoryRes.data.success) {
          setCategories(categoryRes.data.categories);
        }
      } catch (err) {
        console.error("Error fetching product or categories:", err);
        toast.error("Failed to load product details");
      }
    };
    fetchData();
  }, [id]);

  // Handle input fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add detail
  const handleAddDetail = () => {
    const text = detailInput.trim();
    if (text && !form.details.includes(text)) {
      setForm((prev) => ({ ...prev, details: [...prev.details, text] }));
      setDetailInput("");
    }
  };

  // Remove detail
  const handleRemoveDetail = (detail) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((d) => d !== detail),
    }));
  };

  // Add FAQ
  const handleAddFaq = () => {
    if (faqInput.question.trim() && faqInput.answer.trim()) {
      setForm((prev) => ({
        ...prev,
        faqs: [...prev.faqs, faqInput],
      }));
      setFaqInput({ question: "", answer: "" });
    }
  };

  // Remove FAQ
  const handleRemoveFaq = (index) => {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${backendUrl}/api/product/update`,
        {
          ...form,
          id,
          details: JSON.stringify(form.details),
          faqs: JSON.stringify(form.faqs), // ✅ send faqs as JSON
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product updated successfully!");
      navigate("/list");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Name & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium">Product Name*</label>
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full p-2 md:p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price*</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleInputChange}
              className="w-full p-2 md:p-3 border rounded-lg"
              required
            />
          </div>
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium">Category*</label>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full p-2 md:p-3 border rounded-lg"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Subcategory</label>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleInputChange}
              className="w-full p-2 md:p-3 border rounded-lg"
              disabled={!form.category}
            >
              <option value="">Select Subcategory</option>
              {categories
                .find((cat) => cat.name === form.category)
                ?.subcategories.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Stock + Bestseller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium">Stock*</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleInputChange}
              className="w-full p-2 md:p-3 border rounded-lg"
              required
            />
          </div>

          <div className="flex items-center mt-4 md:mt-6">
            <input
              type="checkbox"
              name="bestseller"
              checked={form.bestseller}
              onChange={handleInputChange}
              className="h-4 w-4 md:h-5 md:w-5"
            />
            <label className="ml-2 text-sm">Mark as Bestseller</label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description*</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 md:p-3 border rounded-lg"
            required
          />
        </div>

        {/* Details (bullet points) */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Details</label>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              type="text"
              value={detailInput}
              onChange={(e) => setDetailInput(e.target.value)}
              placeholder="Enter detail"
              className="flex-1 p-2 md:p-3 border rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddDetail}
              className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg whitespace-nowrap"
            >
              Add
            </button>
          </div>

          <ul className="list-disc list-inside space-y-1 pl-2">
            {form.details?.map((detail, idx) => (
              <li key={idx} className="flex justify-between items-center py-1">
                <span className="break-words flex-1 mr-2">{detail}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(detail)}
                  className="text-red-500 text-sm whitespace-nowrap"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQs */}
        <div>
          <label className="block text-sm font-medium mb-2">FAQs</label>
          <div className="flex flex-col gap-2 mb-3">
            <input
              type="text"
              placeholder="Question"
              value={faqInput.question}
              onChange={(e) =>
                setFaqInput({ ...faqInput, question: e.target.value })
              }
              className="p-2 md:p-3 border rounded"
            />
            <input
              type="text"
              placeholder="Answer"
              value={faqInput.answer}
              onChange={(e) =>
                setFaqInput({ ...faqInput, answer: e.target.value })
              }
              className="p-2 md:p-3 border rounded"
            />
            <button
              type="button"
              onClick={handleAddFaq}
              className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded"
            >
              Add FAQ
            </button>
          </div>

          <ul className="space-y-2">
            {form.faqs.map((faq, idx) => (
              <li
                key={idx}
                className="border p-2 md:p-3 rounded flex flex-col sm:flex-row justify-between items-start gap-2"
              >
                <div className="flex-1">
                  <p className="font-semibold break-words">{faq.question}</p>
                  <p className="text-sm text-gray-600 break-words">{faq.answer}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="text-red-500 text-sm whitespace-nowrap"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-2 md:py-3 px-4 md:px-6 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Edit;
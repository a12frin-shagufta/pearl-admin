import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddProductForm = ({ token }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    bestseller: false,
    description: "",
    details: "",
    colors: [],
    images: {},
  });

  const [colorInput, setColorInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddColor = () => {
    const color = colorInput.trim().toLowerCase();
    if (color && !form.colors.includes(color)) {
      setForm((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }));
      setColorInput("");
    }
  };

  const handleImageChange = (color, file) => {
    setForm((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [color]: file,
      },
    }));
  };

  const handleRemoveColor = (color) => {
    setForm((prev) => {
      const updatedColors = prev.colors.filter((c) => c !== color);
      const updatedImages = { ...prev.images };
      delete updatedImages[color];

      return {
        ...prev,
        colors: updatedColors,
        images: updatedImages,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    // Append basic fields
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'colors' && key !== 'images' && key !== 'sizes') {
        formData.append(key, value);
      }
    });

    // Append colors and images
    formData.append("colors", JSON.stringify(form.colors));
    for (const color of form.colors) {
      if (form.images[color]) {
        formData.append("images", form.images[color]);
      }
    }

    try {
      await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!");
      setForm({
        name: "",
        price: "",
        category: "",
        subcategory: "",
        stock: "",
        bestseller: false,
        description: "",
        details: "",
        colors: [],
        images: {},
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
            <input
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
            <input
              name="subcategory"
              value={form.subcategory}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="bestseller"
              checked={form.bestseller}
              onChange={handleInputChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">Mark as Bestseller</label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Details*</label>
          <textarea
            name="details"
            value={form.details}
            onChange={handleInputChange}
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Color Variants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color Variants*</label>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="Enter color name (e.g., gold, silver)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              Add Color
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {form.colors.map((color) => (
              <div key={color} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="capitalize font-medium text-gray-800">{color}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
                <label className="block text-sm text-gray-600 mb-2">Image for {color}*</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(color, e.target.files[0])}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || form.colors.length === 0}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
              isLoading || form.colors.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
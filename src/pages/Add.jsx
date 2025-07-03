import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    bestseller: false,
    details: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm({
      ...form,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
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
      console.log("complete");
      setForm({
        name: "",
        price: "",
        category: "",
        stock: "",
        bestseller: false,
        details: "",
        image1: null,
        image2: null,
        image3: null,
        image4: null,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="details"
          placeholder="Details"
          value={form.details}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="bestseller"
            checked={form.bestseller}
            onChange={handleInputChange}
          />
          <span>Bestseller</span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => {
            const image = form[`image${i}`];
            return (
              <div key={i} className="flex flex-col items-start space-y-2">
                <label className="font-medium text-sm text-gray-700">
                  Image {i}
                </label>
                <input
                  type="file"
                  name={`image${i}`}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="block w-full border p-2 rounded"
                />
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${i}`}
                    className="w-32 h-32 object-cover rounded border"
                  />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;

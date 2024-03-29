//Arian

import React, { useState, useEffect } from "react";
import "./EditInfo.css";
import { useParams, useNavigate, Link } from "react-router-dom";

const EditInfo = () => {
  const { productId } = useParams();
  const [price, setPrice] = useState(0);
  const [features, setFeatures] = useState("");
  const [stock, setStock] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details based on productId
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/getSingleProduct/${productId}`);
        const data = await response.json();
        setPrice(data.price);
        setFeatures(data.product_features);
        setStock(data.stock);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details");
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/product/edit_product/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price, product_features: features, stock }),
      });
      if (response.ok) {
        // Product updated successfully
        console.log("Product updated successfully");
        navigate("/seller-products"); // Navigate back to seller products
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    }
  };

  const handleSoftDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/product/soft_delete_product/${productId}`, {
        method: "POST",
      });
      if (response.ok) {
        console.log("Product soft deleted successfully");
        navigate("/seller-products");
      } else {
        throw new Error("Failed to soft delete product");
      }
    } catch (error) {
      console.error("Error soft deleting product:", error);
      setError("Failed to soft delete product");
    }
  };

  return (
    <div className="edit-info-container">
      {/* Title Bar */}
      <div className="title-bar">
        <h1>Edit Product Info</h1>
        <div className="options">
          <Link to="/seller-products" className="go-back-option">
            Go Back
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="features">Features:</label>
          <textarea
            id="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit">Update</button>
          <button onClick={handleSoftDelete} className="delete-product-button">
            Delete
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default EditInfo;

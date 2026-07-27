import React from "react";
import ProductCard from "../../components/ProductCard";

export const ProductGrid = ({
  products,
  filteredProducts,
  searchQuery,
  paginatedProducts,
  addToCart,
  buyNow,
}) => {
  if (products.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "var(--text-sub)",
        }}
      >
        <div
          className="spinner"
          style={{
            margin: "0 auto 10px auto",
            borderTopColor: "var(--primary)",
            borderLeftColor: "var(--border-color)",
          }}
        ></div>
        <p>Loading items...</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "var(--text-sub)",
        }}
      >
        <p>No products found matching "{searchQuery}".</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {paginatedProducts.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          addToCart={addToCart}
          buyNow={buyNow}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

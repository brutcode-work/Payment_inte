import React from "react";

export const ProductCard = ({ product, addToCart, buyNow }) => {
  return (
    <div className="product-card">
      {/* Gray Backdrop for Image */}
      <div className="product-img-box">
        {product.category && (
          <div className="product-category-tag">{product.category}</div>
        )}
        <img
          src={product.image}
          className="product-img"
          alt={product.name}
        />
      </div>

      {/* Details below */}
      <div className="product-info">
        <div className="product-title">{product.name}</div>

        <div className="product-meta-row">
          {/* Star score */}
          <div className="product-rating">
            <span className="star-icon">★</span>
            <span>
              {product.rating ? product.rating.toFixed(1) : "5.0"}
            </span>
            <span>({product.reviewsCount || "100"} Reviews)</span>
          </div>

          {/* Price */}
          <div className="product-price">
            ₹{product.price.toFixed(2)}
          </div>
        </div>

        {/* Stock Level indicator */}
        <div
          style={{
            fontSize: "11px",
            color: product.stock < 20 ? "var(--error)" : "var(--text-sub)",
            fontWeight: 600,
            marginTop: "2px",
          }}
        >
          {product.stock < 20
            ? `Only ${product.stock} items left!`
            : `In Stock: ${product.stock}`}
        </div>

        {/* Action buttons */}
        <div className="product-buttons">
          <button
            className="btn-add-cart"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
          <button
            className="btn-buy-now"
            onClick={() => buyNow(product)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

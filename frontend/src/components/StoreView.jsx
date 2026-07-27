import React from "react";
import ProductCard from "./ProductCard";

export const StoreView = ({
  categoriesList,
  selectedCategory,
  handleCategorySelect,
  products,
  filteredProducts,
  searchQuery,
  paginatedProducts,
  addToCart,
  buyNow,
  totalPages,
  currentPageNum,
  setCurrentPageNum,
}) => {
  return (
    <div className="store-catalog-wrapper">
      {/* Mockup Title header */}
      <div className="store-header-container">
        <div className="store-mockup-title">
          <span className="title-bold">Bestselling</span>
          <span className="title-star">✧</span>
          <span className="title-serif">Products</span>
        </div>
      </div>

      {/* Body Layout: Categories sidebar + product grid */}
      <div className="store-body-layout">
        {/* Category Sidebar */}
        <aside className="store-sidebar">
          {categoriesList.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <span className="category-bullet"></span>
              <span>{category}</span>
            </button>
          ))}
        </aside>

        {/* Main Grid area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {products.length === 0 ? (
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
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--text-sub)",
              }}
            >
              <p>No products found matching "{searchQuery}".</p>
            </div>
          ) : (
            <>
              {/* 3-Column layout */}
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

              {/* Bottom Pagination */}
              {totalPages > 1 && (
                <div className="pagination-row">
                  <button
                    className="pagination-arrow"
                    disabled={currentPageNum === 1}
                    onClick={() => setCurrentPageNum((prev) => prev - 1)}
                  >
                    &larr; Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      className={`pagination-number ${
                        currentPageNum === idx + 1 ? "active" : ""
                      }`}
                      onClick={() => setCurrentPageNum(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    className="pagination-arrow"
                    disabled={currentPageNum === totalPages}
                    onClick={() => setCurrentPageNum((prev) => prev + 1)}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreView;

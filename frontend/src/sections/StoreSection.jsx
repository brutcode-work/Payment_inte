import React, { useState } from "react";
import CategorySidebar from "../components/CategorySidebar";
import Pagination from "../components/Pagination";
import ProductGrid from "../features/store/ProductGrid";

export const StoreSection = ({
  products,
  searchQuery,
  addToCart,
  buyNow,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 100;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPageNum(1);
  };

  const categoriesList = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

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
        <CategorySidebar
          categoriesList={categoriesList}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <ProductGrid
            products={products}
            filteredProducts={filteredProducts}
            searchQuery={searchQuery}
            paginatedProducts={paginatedProducts}
            addToCart={addToCart}
            buyNow={buyNow}
          />

          <Pagination
            totalPages={totalPages}
            currentPageNum={currentPageNum}
            setCurrentPageNum={setCurrentPageNum}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreSection;

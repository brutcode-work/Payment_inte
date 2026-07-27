import React from "react";

export const CategorySidebar = ({
  categoriesList,
  selectedCategory,
  handleCategorySelect,
}) => {
  return (
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
  );
};

export default CategorySidebar;

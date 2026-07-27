import React from "react";

export const Pagination = ({
  totalPages,
  currentPageNum,
  setCurrentPageNum,
}) => {
  if (totalPages <= 1) return null;

  return (
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
  );
};

export default Pagination;

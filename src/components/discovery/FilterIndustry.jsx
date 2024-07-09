import React, { useState, useEffect } from "react";
import "./Filter.css"; // Import the CSS file

const FilterIndustry = ({ items, onFilter }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  let filters = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Construction",
    "Manufacturing",
    "Retail",
    "Transportation",
    "Real Estate",
    "Telecommunications",
    "Energy",
    "Entertainment",
    "Hospitality",
    "Agriculture",
    "Aerospace",
  ];

  const handleFilterButtonClick = (selectedCategory) => {
    const newFilters = selectedFilters.includes(selectedCategory)
      ? selectedFilters.filter((el) => el !== selectedCategory)
      : [...selectedFilters, selectedCategory];

    setSelectedFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div>
      <div className="buttons-container">
        {filters.map((category, idx) => (
          <button
            onClick={() => handleFilterButtonClick(category)}
            className={`button ${
              selectedFilters.includes(category) ? "active" : ""
            }`}
            key={`filters-${idx}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterIndustry;

import React from "react";
import "./FilterGroup.css";

export default function FilterGroup({
  id,
  label = "Filter:",
  options = [],
  selectedValue,
  onChange,
  className = "",
}) {
  const selectId = id || `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const handleSelectChange = (e) => {
    const rawValue = e.target.value;
    const matchedOption = options.find((opt) => String(opt.value) === rawValue);
    onChange(matchedOption ? matchedOption.value : rawValue);
  };

  return (
    <div className={`filter-dropdown-group ${className}`}>
      <label
        htmlFor={selectId}
        className="form-label fw-semibold text-dark small mb-1"
      >
        {label}
      </label>

      <select
        id={selectId}
        className="form-select form-select-sm filter-select shadow-sm"
        value={selectedValue}
        onChange={handleSelectChange}
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined ? ` (${option.count})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

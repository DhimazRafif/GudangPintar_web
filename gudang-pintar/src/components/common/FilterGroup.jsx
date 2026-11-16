import React from "react";
import "./FilterGroup.css";
import SelectControl from "./SelectControl";

export default function FilterGroup({
  id,
  label = "Filter:",
  options = [],
  selectedValue,
  onChange,
  className = "",
}) {
  const selectId = id || `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const handleSelectChange = (rawValue) => {
    const matchedOption = options.find((opt) => String(opt.value) === rawValue);
    onChange(matchedOption ? matchedOption.value : rawValue);
  };

  return (
    <div className={`filter-dropdown-group ${className}`}>
      <SelectControl
        id={selectId}
        label={label}
        selectClassName="form-select-sm filter-select shadow-sm"
        options={options}
        value={selectedValue}
        onChange={handleSelectChange}
      />
    </div>
  );
}

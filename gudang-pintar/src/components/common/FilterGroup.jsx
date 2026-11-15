import React from "react";
import Button from "./Button";

export default function FilterGroup({
  label = "Filter:",
  options = [],
  selectedValue,
  onChange,
}) {
  return (
    <div
      className="bg-white p-3 rounded-3 border mb-3 shadow-sm d-flex flex-wrap align-items-center gap-2"
      role="region"
      aria-label={label}
    >
      <span className="fw-semibold text-dark small me-1">{label}</span>

      <div className="d-flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const variant = isSelected
            ? option.activeVariant || "filterActive"
            : option.idleVariant || "filterIdle";

          return (
            <Button
              key={option.value}
              variant={variant}
              size="sm"
              onClick={() => onChange(option.value)}
              title={option.tooltip || `Filter berdasarkan ${option.label}`}
              ariaLabel={`${option.label}${
                option.count !== undefined ? ` (${option.count} item)` : ""
              }`}
            >
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span
                  className={`badge rounded-pill ${
                    isSelected
                      ? "bg-white text-dark"
                      : "bg-secondary bg-opacity-10 text-dark"
                  }`}
                >
                  {option.count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

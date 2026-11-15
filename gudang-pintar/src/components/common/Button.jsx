import React from "react";
import "./Button.css";

const VARIANT_CLASSES = {
  primary: "btn-success custom-btn-primary",
  secondary: "btn-outline-secondary custom-btn-sec",
  danger: "btn-danger custom-btn-danger",
  warning: "btn-warning text-dark custom-btn-warn",
  filterActive: "btn-success custom-btn-filter-active",
  filterIdle: "btn-outline-success custom-btn-filter",
};

const SIZE_CLASSES = {
  sm: "btn-sm px-3 py-1",
  md: "px-3 py-2",
  lg: "btn-lg px-4 py-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled = false,
  isLoading = false,
  icon = null,
  title,
  ariaLabel,
  className = "",
}) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
      aria-label={ariaLabel || title}
      className={`btn custom-btn d-inline-flex align-items-center justify-content-center gap-2 ${variantClass} ${sizeClass} ${className}`}
    >
      {isLoading ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        icon && <span className="d-inline-flex align-items-center">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}

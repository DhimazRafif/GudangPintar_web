import "./FormControls.css";

export default function SelectControl({
  id,
  label,
  options = [],
  value,
  onChange,
  ariaLabel,
  className = "",
  selectClassName = "",
  ...selectProps
}) {
  return (
    <div className={`gp-field ${className}`}>
      {label && <label htmlFor={id} className="gp-field-label">{label}</label>}
      <select
        id={id}
        className={`form-select gp-select ${selectClassName}`}
        value={value}
        aria-label={ariaLabel}
        onChange={(event) => onChange?.(event.target.value, event)}
        {...selectProps}
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

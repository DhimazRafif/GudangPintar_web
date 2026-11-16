import "./FormControls.css";

export default function Input({
  id,
  label,
  hideLabel = false,
  hint,
  error,
  className = "",
  inputClassName = "",
  ...inputProps
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`gp-field ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`gp-field-label${hideLabel ? " visually-hidden" : ""}`}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`form-control gp-input ${inputClassName}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy || undefined}
        {...inputProps}
      />
      {hint && <small className="gp-field-hint" id={`${id}-hint`}>{hint}</small>}
      {error && <small className="gp-field-error" id={`${id}-error`}>{error}</small>}
    </div>
  );
}

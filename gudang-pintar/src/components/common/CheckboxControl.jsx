import "./FormControls.css";

export default function CheckboxControl({
  id,
  label,
  className = "",
  inputClassName = "",
  ...inputProps
}) {
  const checkbox = (
    <input
      id={id}
      type="checkbox"
      className={`form-check-input gp-checkbox ${inputClassName}`}
      {...inputProps}
    />
  );

  if (!label) return checkbox;

  return (
    <label className={`gp-checkbox-field ${className}`} htmlFor={id}>
      {checkbox}
      {label && <span>{label}</span>}
    </label>
  );
}

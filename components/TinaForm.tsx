"use client";

import { useState } from "react";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  required: boolean;
  placeholder?: string;
  options?: string;
}

interface FormData {
  title: string;
  slug: string;
  description?: string;
  successMessage?: string;
  submitLabel?: string;
  submissionEndpoint?: string;
  fields: FormField[];
}

interface TinaFormProps { form: FormData; }

export default function TinaForm({ form }: TinaFormProps) {
  const formData = form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const raw = new FormData(e.currentTarget);
    const data = Object.fromEntries(raw.entries());

    const newErrors: Record<string, string> = {};
    formData.fields.forEach((field) => {
      if (field.required && !data[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (
        field.type === "email" &&
        data[field.name] &&
        !/\S+@\S+\.\S+/.test(data[field.name] as string)
      ) {
        newErrors[field.name] = "Please enter a valid email address";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    if (!formData.submissionEndpoint) {
      setErrors({ _form: "This form is not configured for submissions yet." });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(formData.submissionEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formSlug: formData.slug, data }),
      });

      if (response.ok) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setErrors({ _form: "Something went wrong. Please try again." });
      }
    } catch {
      setErrors({ _form: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="tina-form-success">
        <p className="tina-form-success__icon" aria-hidden="true">✓</p>
        <h3>Thank you!</h3>
        <p>{formData.successMessage ?? "Your message has been sent."}</p>
        <button
          type="button"
          className="tina-form__btn"
          onClick={() => setIsSuccess(false)}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="tina-form" onSubmit={handleSubmit} noValidate>
      {formData.description && (
        <p className="tina-form__description">{formData.description}</p>
      )}

      {errors._form && (
        <div className="tina-form__error-banner" role="alert">
          {errors._form}
        </div>
      )}

      {formData.fields.map((field) => (
        <div key={field.name} className="tina-form__field">
          <label htmlFor={field.name} className="tina-form__label">
            {field.label}
            {field.required && (
              <span className="tina-form__required" aria-label="required">
                {" "}*
              </span>
            )}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
              aria-invalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              aria-invalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            >
              <option value="">Select an option</option>
              {field.options?.split(",").map((opt) => (
                <option key={opt.trim()} value={opt.trim()}>
                  {opt.trim()}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <div className="tina-form__checkbox-row">
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                required={field.required}
                aria-invalid={!!errors[field.name]}
              />
            </div>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              aria-invalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
          )}

          {errors[field.name] && (
            <span
              id={`${field.name}-error`}
              className="tina-form__field-error"
              role="alert"
            >
              {errors[field.name]}
            </span>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="tina-form__btn tina-form__btn--primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending…" : (formData.submitLabel ?? "Submit")}
      </button>
    </form>
  );
}

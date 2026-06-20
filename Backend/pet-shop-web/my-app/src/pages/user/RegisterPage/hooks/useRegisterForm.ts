import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { validateForm } from "../validation";
import type { RegisterFormData, RegisterFormErrors } from "../types";
import type { UseRegisterFormReturn } from "../types";
import { useAuth } from "@/context/authContext";

const initialFormData: RegisterFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  address: "",
};

export function useRegisterForm(): UseRegisterFormReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  }, [errors]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();

      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        await registerUser({
          firstName: formData.firstName.trim() || undefined,
          lastName: formData.lastName.trim() || undefined,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          address: formData.address.trim() || undefined,
        });

        if (location.pathname.includes("/admin")) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/user/products", { replace: true });
        }
      } catch (error: unknown) {
        console.error("Registration error:", error);
        if (error instanceof Error) {
          setErrors({
            general: error.message || "Đăng ký thất bại, vui lòng thử lại",
          });
        } else {
          setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData, navigate, location.pathname, registerUser]
  );

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    resetForm,
  };
}

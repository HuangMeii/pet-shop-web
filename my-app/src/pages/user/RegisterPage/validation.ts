import type {RegisterFormData, RegisterFormErrors} from "./types";

const MAX_NAME = 50;
const MAX_EMAIL = 100;
const MAX_ADDRESS = 255;

export const validateForm = (
  formData: RegisterFormData
): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  const first = formData.firstName.trim();
  if (first.length > MAX_NAME) {
    errors.firstName = `Họ không quá ${MAX_NAME} ký tự`;
  }

  const last = formData.lastName.trim();
  if (last.length > MAX_NAME) {
    errors.lastName = `Tên không quá ${MAX_NAME} ký tự`;
  }

  const email = formData.email.trim();
  if (!email) {
    errors.email = "Email không được để trống";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email không hợp lệ";
  } else if (email.length > MAX_EMAIL) {
    errors.email = `Email không quá ${MAX_EMAIL} ký tự`;
  }

  if (!formData.phone) {
    errors.phone = "Số điện thoại không được để trống";
  } else if (!/^(0|\+84)[0-9]{9}$/.test(formData.phone.trim())) {
    errors.phone =
      "Số điện thoại phải là 0xxxxxxxxx hoặc +84xxxxxxxxx (9 chữ số sau mã vùng)";
  }

  if (!formData.password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(formData.password)) {
    errors.password =
      "Mật khẩu ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Xác nhận mật khẩu không được để trống";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Mật khẩu không khớp";
  }

  const addr = formData.address.trim();
  if (addr.length > MAX_ADDRESS) {
    errors.address = `Địa chỉ không quá ${MAX_ADDRESS} ký tự`;
  }

  return errors;
};

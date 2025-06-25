import { object, string, number, date, ref, boolean } from "yup";
import createError from "../utils/create-error.util.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/;

export const registerSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  identity: string().test(
    "identity check",
    "Identity must be a valid email or mobile number",
    (value) => {
      if (!value) {
        return true;
      }
      return emailRegex.test(value) || mobileRegex.test(value);
    }
  ),
  password: string().min(4).required(),
  confirmPassword: string().oneOf(
    [ref("password")],
    `confirm password is not match`
  ),
  email: string().email(),
  mobile: string().matches(mobileRegex, "Invalid Phone NUmber"),
})
  .noUnknown()
  .transform((value) => {
    if (value.email || value.mobile) {
      delete value.identity;
      return value;
    }
    const newValue = {
      ...value,
      [emailRegex.test(value.identity) ? "email" : "mobile"]: value.identity,
    };
    delete newValue.identity
    return newValue;
  })
  .test(
    "require-identity-or-mobile-or-email",
    "At least one of identity, email, or mobile must be provided",
    (value) => {
      return Boolean(value.identity || value.email || value.mobile);
    }
  );

let data = {
  firstName: "Ruxios",
  lastName: "Zuslust",
  identity: "",
  email: "ruxios@mail",
  // mobile: "1234567890",
  password: "123456",
  confirmPassword: "123456",
};

registerSchema
  .validate(data, { abortEarly: false })
  .then(console.log)
  .catch((err) => {
    console.log("errors", err.errors);
  });

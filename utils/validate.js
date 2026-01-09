import { object, string } from "yup";

export const registerSchema = object({
  // name: string().min(3, 'Name must be at least 3 characters long').max(20).trim().required(),
  email: string().email("Email Invalid").required("Please enter your email").trim(),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .required("Please enter your password").trim(),
});

export const loginSchema = object({
  email: string().email("Email Invalid").required("Please enter your email").trim(),
  password: string().required("Please enter your password").trim(),
});

export const categorySchema = object({
  name: string().required().trim(),
});

export const validate = (schema) => async (req, res, next) => {
  try {
    const validatedData = await schema.validate(req.body, {
      abortEarly: false
    });

    req.body = validatedData;
    
    next();
  } catch (error) {
    const errRegister = error.errors.join(', ');
    const err = new Error(errRegister)
    next(err);
  }
};

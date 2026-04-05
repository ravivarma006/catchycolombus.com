import { z } from "zod";

// ─────────────────────────────────────────
// Shared field helpers
// ─────────────────────────────────────────
const optionalUrl = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (!v) return true;
      try {
        const u = new URL(v);
        return u.protocol === "https:" || u.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL (https://...)" }
  )
  .optional()
  .or(z.literal(""));

const optionalPhone = z
  .string()
  .trim()
  .refine(
    (v) => !v || (/^[\d\s().+\-]{7,20}$/.test(v) && v.replace(/\D/g, "").length >= 10),
    { message: "Enter a valid phone number (at least 10 digits)" }
  )
  .optional()
  .or(z.literal(""));

const requiredEmail = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(254, "Email is too long");

const shortText = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long (max ${max} chars)`);

const longText = (max = 2000) =>
  z.string().trim().max(max, `Description is too long (max ${max} chars)`).optional().or(z.literal(""));

// ─────────────────────────────────────────
// Event Request Schema
// ─────────────────────────────────────────
export const eventRequestSchema = z.object({
  event_name:   shortText("Event name", 150),
  email:        requiredEmail,
  phone:        optionalPhone,
  event_date:   z
    .string()
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
      message: "Enter a valid date (YYYY-MM-DD)",
    })
    .optional()
    .or(z.literal("")),
  event_time:   z
    .string()
    .refine((v) => !v || /^\d{2}:\d{2}$/.test(v), {
      message: "Enter a valid time",
    })
    .optional()
    .or(z.literal("")),
  address:      z.string().trim().max(300, "Address too long").optional().or(z.literal("")),
  price:        z.string().trim().max(50, "Price too long").optional().or(z.literal("")),
  description:  longText(),
  website:      optionalUrl,
  image_url:    optionalUrl,
});

export type EventRequestInput = z.infer<typeof eventRequestSchema>;

// ─────────────────────────────────────────
// Provider Request Schema
// ─────────────────────────────────────────
export const providerRequestSchema = z.object({
  business_name:  shortText("Business name", 150),
  email:          requiredEmail,
  phone:          optionalPhone,
  business_type:  z.string().trim().max(100, "Business type too long").optional().or(z.literal("")),
  category_id:    z.string().uuid("Invalid category").optional().or(z.literal("")),
  address:        z.string().trim().max(300, "Address too long").optional().or(z.literal("")),
  description:    longText(),
  website:        optionalUrl,
  image_url:      optionalUrl,
});

export type ProviderRequestInput = z.infer<typeof providerRequestSchema>;

// ─────────────────────────────────────────
// Coupon Request Schema
// ─────────────────────────────────────────
export const couponRequestSchema = z.object({
  product_service_name: shortText("Business / product name", 150),
  email:                requiredEmail,
  phone:                optionalPhone,
  category_id:          z.string().uuid("Invalid category").optional().or(z.literal("")),
  coupon_code:          z
    .string()
    .trim()
    .max(50, "Coupon code is too long")
    .refine((v) => !v || /^[A-Za-z0-9_\-]{2,50}$/.test(v), {
      message: "Coupon code may only contain letters, numbers, hyphens, and underscores",
    })
    .optional()
    .or(z.literal("")),
  address:     z.string().trim().max(300, "Address too long").optional().or(z.literal("")),
  description: longText(),
  website:     optionalUrl,
  image_url:   optionalUrl,
});

export type CouponRequestInput = z.infer<typeof couponRequestSchema>;

// ─────────────────────────────────────────
// Auth Schemas
// ─────────────────────────────────────────
export const loginSchema = z.object({
  email:    requiredEmail,
  password: z.string().min(1, "Password is required").max(128, "Password too long"),
});

export const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100, "Full name too long"),
  email:     requiredEmail,
  password:  z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .refine((v) => /[A-Z]/.test(v), { message: "Password must contain at least one uppercase letter" })
    .refine((v) => /[0-9]/.test(v), { message: "Password must contain at least one number" }),
});

// ─────────────────────────────────────────
// Helper: format Zod errors for server actions
// ─────────────────────────────────────────
export function formatZodErrors(error: z.ZodError<unknown>): string {
  return error.issues.map((issue) => issue.message).join(". ");
}

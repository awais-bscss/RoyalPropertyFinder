import jwt from "jsonwebtoken";

export const generateToken = (payload: { id: unknown; sessionId?: string; [key: string]: any }, expiresIn: string = "30d"): string => {
  const secret = process.env.JWT_SECRET || "fallback_secret_key";
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

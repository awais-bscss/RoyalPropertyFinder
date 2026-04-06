import { Request } from "express";
import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import redisClient from "../../config/redis";
import { generateToken } from "../../shared/utils/jwt";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const createSessionToken = async (req: Request, user: any, rememberMe = false) => {
  const sessionId = crypto.randomUUID();
  const parser = new (UAParser as any)(req.headers["user-agent"] || "");
  const browser = parser.getBrowser();
  const os = parser.getOS();
  
  // Enhanced Location Parser
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip || "Unknown IP";
  const formattedIp = ip === "::1" || ip === "127.0.0.1" ? "Localhost" : ip;
  const loc = user.city ? `${user.city} (${formattedIp})` : `Location: ${formattedIp}`; 

  const device = `${browser.name || "App / Unknown Browser"} on ${os.name || "Mobile / Unknown OS"}`;
  
  const sessionData = {
    id: sessionId,
    device,
    loc,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const expiresInSeconds = rememberMe ? 30 * 24 * 60 * 60 : 30 * 24 * 60 * 60; // Keeping 30 days standard for now
  
  await redisClient.set(
    `session:${user._id.toString()}:${sessionId}`,
    JSON.stringify(sessionData),
    "EX",
    expiresInSeconds
  );
  
  return generateToken({ id: user._id, sessionId });
};

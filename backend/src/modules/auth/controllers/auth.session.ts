import { Request, Response } from "express";
import { catchAsync } from "../../../shared/utils/catchAsync";
import redisClient from "../../../config/redis";

/**
 * @desc    Logout user
 */
export const logout = catchAsync(async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (token && token !== "none") {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
      if (decoded && decoded.sessionId && decoded.id) {
        await redisClient.del(`session:${decoded.id.toString()}:${decoded.sessionId}`);
      }
    }
  } catch (err) {}

  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ success: true, message: "Logged out successfully", data: {} });
});

/**
 * @desc    Get all active sessions for current user
 */
export const getSessions = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const currentSessionId = (req as any).sessionId;
  const keys = await redisClient.keys(`session:${user._id.toString()}:*`);
  const sessions = [];

  for (const key of keys) {
    const data = await redisClient.get(key);
    if (data) {
      const parsed = JSON.parse(data);
      sessions.push({ ...parsed, current: parsed.id === currentSessionId });
    }
  }

  sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.status(200).json({ success: true, data: sessions });
});

/**
 * @desc    Revoke a specific session
 */
export const revokeSession = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const { sessionId } = req.params;
  const key = `session:${user._id.toString()}:${sessionId}`;

  const data = await redisClient.get(key);
  if (data) {
    const parsed = JSON.parse(data);
    parsed.status = 'revoked';
    parsed.revokedAt = new Date().toISOString();
    await redisClient.set(key, JSON.stringify(parsed), "EX", 24 * 60 * 60);
  }

  res.status(200).json({ success: true, message: "Session revoked successfully" });
});

/**
 * @desc    Revoke all sessions except current
 */
export const revokeAllSessions = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const currentSessionId = (req as any).sessionId;
  const keys = await redisClient.keys(`session:${user._id.toString()}:*`);
  
  for (const key of keys) {
    if (!key.endsWith(`:${currentSessionId}`)) {
      const data = await redisClient.get(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.status === 'active') {
          parsed.status = 'revoked';
          parsed.revokedAt = new Date().toISOString();
          await redisClient.set(key, JSON.stringify(parsed), "EX", 24 * 60 * 60);
        }
      }
    }
  }

  res.status(200).json({ success: true, message: "All other sessions revoked successfully" });
});

/**
 * @desc    Permanently delete a specific session from history
 */
export const deleteSessionHistory = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const { sessionId } = req.params;
  await redisClient.del(`session:${user._id.toString()}:${sessionId}`);
  res.status(200).json({ success: true, message: "History entry deleted" });
});

/**
 * @desc    Clear all revoked sessions from history
 */
export const clearHistory = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  const keys = await redisClient.keys(`session:${user._id.toString()}:*`);
  
  for (const key of keys) {
    const data = await redisClient.get(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.status === 'revoked') await redisClient.del(key);
    }
  }

  res.status(200).json({ success: true, message: "All history cleared successfully" });
});

declare module "ffprobe-client";

export declare global {
  namespace Express {
    interface Request {
      user?: { uid: string };
    }
  }
}

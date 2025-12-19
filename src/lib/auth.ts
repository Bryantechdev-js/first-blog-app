import { jwtVerify } from "jose";

export async function verifyAuth(token: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    console.log("user token decode: " , payload);
    
    return {
      userId: payload.userId,
      email: payload.email,
      userName: payload.userName,
    };
  } catch (err) {
    console.error("verifyAuth error:", err);
    return null;
  }
}

import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = "$uperM@n@123";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: this.generateHash(salt, password),
        salt,
      },
    });
  }
  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const userSalt = user.salt;
    const userHashedPassword = this.generateHash(userSalt, password);

    if (user.password !== userHashedPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }
  public static decodeJWTToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
  public static getUserById(id: string) {
    return prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }
}

export default UserService;

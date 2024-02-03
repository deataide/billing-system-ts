import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req: any, res: any, next: any) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return res.status(401).json({ mensagem: "Não autorizado." });
  }

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  // eslint-disable-next-line no-undef
  const secret = process.env.AUTH_SECRET || "NONE";

  jwt.verify(bearerToken, secret, (err: any) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }

    req.token = bearerToken;

    next();
  });
};

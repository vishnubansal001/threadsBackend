import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  const gqlServer = await createApolloGraphqlServer();

  app.get("/", (req, res) => {
    res.send({ message: "Server is Up and Running" });
  });

  app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
      context: async ({ req }) => {
        // @ts-ignore
        const token = req.headers["token"];
        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error: any) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
  });
}

init();

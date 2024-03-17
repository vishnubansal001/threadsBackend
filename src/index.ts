import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query { 
            hello: String
            say(name: String): String
        }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello there, I am a graphql server",
        say: (_, { name }) => `Hello ${name},How are you?`,
      },
    },
  });

  await gqlServer.start();

  app.get("/", (req, res) => {
    res.send({ message: "Server is Up and Running" });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
  });
}

init();

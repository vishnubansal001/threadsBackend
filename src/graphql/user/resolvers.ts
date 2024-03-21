import UserService, {
  CreateUserPayload,
  GetUserTokenPayload,
} from "../../services/user";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const res = await UserService.getUserToken(payload);
    return res;
  },
  getCurrentLoggedInUser: async (_: any, __: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;
      const res = await UserService.getUserById(id);
      return res;
    }
    throw new Error("User not found");
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = {
  queries,
  mutations,
};

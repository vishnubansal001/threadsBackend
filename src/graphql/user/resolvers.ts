import UserService, { CreateUserPayload, GetUserTokenPayload } from "../../services/user";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const res = await UserService.getUserToken(payload);
    return res;
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

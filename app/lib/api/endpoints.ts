const BASE_PATH = "/api/v1/bite-brew";

export const ApiEndpoints = {
  login: `${BASE_PATH}/auth/signin`,
  signup: `${BASE_PATH}/auth/signup`,
  listMenus: `${BASE_PATH}/menu/items`,
  orderMenus: `${BASE_PATH}/orders`,
};

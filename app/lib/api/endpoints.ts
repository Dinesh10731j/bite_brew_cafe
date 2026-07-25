const BASE_PATH = "/api/v1/bite-brew";

export const ApiEndpoints = {
  login: `${BASE_PATH}/auth/signin`,
  signup: `${BASE_PATH}/auth/signup`,
  forgotPassword: `${BASE_PATH}/auth/forgot-password`,
  resetPassword: `${BASE_PATH}/auth/reset-password`,
  me: `${BASE_PATH}/users/me`,
  listMenus: `${BASE_PATH}/menu/items`,
  orderMenus: `${BASE_PATH}/orders`,  
  logout: `${BASE_PATH}/auth/logout`,
  listStaff: `${BASE_PATH}/staff`,
  listGallery: `${BASE_PATH}/gallery`,
  subscribe: `${BASE_PATH}/newsletter/subscribe`,

  // Loyalty System
  loyaltyDashboard: `${BASE_PATH}/loyalty/dashboard`,
  loyaltyCatalog: `${BASE_PATH}/loyalty/catalog`,
  loyaltyWallet: `${BASE_PATH}/loyalty/wallet`,
  loyaltyRedeem: `${BASE_PATH}/loyalty/redeem`,
  loyaltyCheckIn: `${BASE_PATH}/loyalty/check-in`,
  loyaltyReferral: `${BASE_PATH}/loyalty/referral`,
  loyaltyHistory: `${BASE_PATH}/loyalty/history`,
};

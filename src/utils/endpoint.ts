export const API_ENDPOINT = {
  REQUESTDELIVERY: {
    GET_PRODUCT_TYPE: 'customer/delivery/product-type',
    GET_DELIVERY_METHOD: 'customer/delivery/delivery-method',
    GET_ADDON: 'customer/delivery/addon',
    GET_DETAIL_DELIVERY: 'customer/delivery',
    POST_DELIVERY_FEE: 'customer/delivery/delivery-fee',
    POST_DRLIVERY: 'customer/delivery',
    POST_RATING: 'customer/delivery',
    PUT_CANCEL: 'customer/delivery',
    POST_KEEP_FIND_DRRIVER: 'customer/delivery',
  },
  AUTH: {
    REQUEST_OTP: 'authen/request-otp',
    VERIFY_OTP: 'authen/verify-otp',
    CREATE_USER: 'authen/create-user',
    LOGIN: 'authen/login',
    LOGOUT: 'authen/logout',
    GET_PROFILE: 'authen/profile',
    GET_SESSION: 'authen/get-session',
    FORGOT_PASSWORD_OTP: 'authen/forgot-password-otp',
    FORGOT_PASSWORD: 'authen/forgot-password',
    KYC_USER: 'authen/create-update-user',
    CHANGE_PASSWORD: 'authen/change-password',
    UPLOAD_IMAGE: 'user/upload-image-message',
    MESSAGE_HISTORY: 'user/message/history',
    INFO_USER: 'user',
  },
  GOONG: {
    GEO_CODE: 'Geocode',
    PLACE_DETAIL: 'Place/Detail',
    PLACE_AUTO: 'Place/AutoComplete',
    DIRECTION: 'Direction',
    DISTANCE_MATRIX: 'DistanceMatrix',
  },
  HOME: {
    CATELOG: 'customer/customer-catalog/get-all',
    PROMOTION: 'customer/promotion/list-promotion',
    SUGGEST_RESTAURANTS: 'customer/restaurant/suggest-restaurants',
    GET_RESTAURANTS_NEAR_ME: 'customer/restaurant/near-me',
  },
  CATEGORY: {
    RESTAURANT: 'customer/restaurant/list-restaurants',
    DETAIL_RESTAURANT: 'customer/restaurant/get-detail',
    EXTRA_FOOD: 'customer/food/get-detail',
    LIST_FOOD_CATALOG: 'customer/food-catalog/list-food-catalog',
    LIST_FOOD: 'customer/food/list-food',
    CALCULATE_PRICE: 'customer/order/calculate',
    POST_RATING: 'customer/order',
  },
  ORDER: {
    CREATE: 'customer/order/create',
    DETAIL: 'customer/order/get-detail',
    CANCEL: 'customer/order',
    KEEP_FIND_DRIVER: 'customer/order',
    GET_FOOD_DETAIL: 'customer/food/get-detail',
    GET_ORDER_LIST: 'customer/order/list-orders',
    GET_DELIVERY_LIST: 'customer/delivery/get-all',
    CALCULATE: 'customer/order/calculate',
    MOTORCYCLE_TAXI: 'customer/motorcycle-taxi/get-all',
    CAR_TAXI:
      'customer/motorcycle-taxi/get-all/?vehicle=CAR4SEATS&vehicle=CAR7SEATS&vehicle=CARLUXURY&vehicle=CARSHARE',
  },

  MOTORCYCLE_TAXI: {
    CREATE: 'customer/motorcycle-taxi/create',
    PRE_CREATE: 'customer/motorcycle-taxi/pre-create',
    CANCEL: 'customer/motorcycle-taxi',
    RATING: 'customer/review/submit-review',
  },

  SHIPPING_TYPES: {
    GET_ALL: 'customer/shipping-types',
  },

  PUBLIC: {
    DRIVER_LOCATION: 'public/driver',
  },
  MAP: {
    AUTOCOMPLEATE:
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
  },
};

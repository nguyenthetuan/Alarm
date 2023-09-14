import { NavigationService, Routes } from 'navigation';
import { FindCarType } from './enum';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export interface ICategory {
  icon: string;
  queue_number: string;
  type: TTypeCategory;
  name: string;
  id: string;
  defaultIcon?: string;
  onPress?: () => void;
}
export interface IHomeState {
  loading: boolean;
  listCategories: any[];
  listPromotions: IPromotion[];
  listSuggests: any[];
  listRestaurantNearMe: any[];
  listMessageHistory: any[];
  infoUser: any;
}
export enum ETypeCategory {
  FOOD = 'FOOD',
  DRINK = 'DRINK',
  BOOKING = 'BOOKING',
  PROMOTION = 'PROMOTION',
  MOTORBIKE_BOOKING = 'MOTORBIKE_BOOKING',
  DELIVERY = 'DELIVERY',
  COSMETIC = 'COSMETIC',
  DOMESTIC_WOKER = 'DOMESTIC_WOKER',
  ALL = 'ALL',
  CARBOOKING = 'CAR_BOOKING',
  DRIVERBOOKING = 'DRIVER_BOOKING',
  CARRENTAL = 'CAR_RENTAL',
  DELIVERYNATIONWIDE = 'DELIVERY_NATIONWIDE',
}
export type TTypeCategory =
  | ETypeCategory.FOOD
  | ETypeCategory.DRINK
  | ETypeCategory.BOOKING
  | ETypeCategory.PROMOTION
  | ETypeCategory.MOTORBIKE_BOOKING
  | ETypeCategory.DELIVERY
  | ETypeCategory.COSMETIC
  | ETypeCategory.DOMESTIC_WOKER
  | ETypeCategory.ALL
  | ETypeCategory.CARBOOKING
  | ETypeCategory.DRIVERBOOKING
  | ETypeCategory.CARRENTAL
  | ETypeCategory.DELIVERYNATIONWIDE;
interface ITypeCategory {
  icon: string;
  screen?: string;
  onPress?: () => void;
}
export const DATA_CATEGORY: Record<ETypeCategory, ITypeCategory> = {
  [ETypeCategory.FOOD]: {
    icon: 'food1',
  },
  [ETypeCategory.DRINK]: {
    icon: 'drink1',
  },
  [ETypeCategory.BOOKING]: {
    icon: 'booking',
  },
  [ETypeCategory.PROMOTION]: {
    icon: 'promotion',
  },
  [ETypeCategory.MOTORBIKE_BOOKING]: {
    icon: 'bike',
    onPress: () =>
      NavigationService.navigate(Routes.FindCar, {
        type: FindCarType.MOTORBIKE,
      }),
  },
  [ETypeCategory.DELIVERY]: {
    icon: 'deliveryStuff',
    onPress: () => NavigationService.navigate(Routes.RequestDelivery),
  },
  [ETypeCategory.COSMETIC]: {
    icon: 'comestic',
    onPress: () => {},
  },
  [ETypeCategory.DOMESTIC_WOKER]: {
    icon: 'houseHelper',
    onPress: () => {},
  },
  [ETypeCategory.ALL]: {
    icon: 'all',
    onPress: () => NavigationService.navigate(Routes.AllCategories),
  },
  [ETypeCategory.CARBOOKING]: {
    icon: 'car',
    onPress: () =>
      NavigationService.navigate(Routes.FindCar, {
        type: FindCarType.CAR,
      }),
  },
  [ETypeCategory.DRIVERBOOKING]: {
    icon: 'derviceCar',
    onPress: () => {
      Toast.show({
        text1: 'Tính năng đang được phát triển',
        position: 'top',
        type: 'error',
      });
    },
  },
  [ETypeCategory.CARRENTAL]: {
    icon: 'carRental',
    onPress: () => {
      Toast.show({
        text1: 'Tính năng đang được phát triển',
        position: 'top',
        type: 'error',
      });
    },
  },
  [ETypeCategory.DELIVERYNATIONWIDE]: {
    icon: 'carDeliver',
    onPress: () => {
      Toast.show({
        text1: 'Tính năng đang được phát triển',
        position: 'top',
        type: 'error',
      });
    },
  },
};

interface IPromoCondition {
  condition_value: number;
  condition_type: 'MINIMUM_ORDER';
}

interface IPromoOffer {
  offer_type: 'DISCOUNT_ORDER';
  offer_value: number;
  offer_unit: 'AMOUNT';
}

interface IPromoQuantity {
  remaining: number;
  initialized: number;
}

export interface IPromotion {
  condition: IPromoCondition;
  offer: IPromoOffer;
  quantity: IPromoQuantity;
  status: 'ACTIVE';
  apply_payment_methods: ['ALL'];
  _id: string;
  name: string;
  start_date: string;
  end_date: string;
  code: string;
  usable_catalog: 'ALL';
  id: string;
  image_url: string;
  description: string;
  restaurant_id: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}

export interface IMetaDataResponse<T = any> {
  status: number;
  data: Data<T>;
}

export interface Data<T> {
  result: T[];
  total?: number;
  currentPage?: number;
  limit?: number;
}

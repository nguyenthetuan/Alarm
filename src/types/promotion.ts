export interface IPromotionListItem {
  condition: {
    condition_value: number;
    condition_type: string;
  };
  offer: {
    offer_type: string;
    offer_value: number;
    offer_unit: string;
  };
  quantity: {
    remaining: number;
    initialized: number;
  };
  status: string;
  apply_payment_methods: string[];
  image_url: string;
  description: null;
  restaurant_id: null;
  _id: string;
  name: string;
  start_date: string;
  end_date: string;
  code: string;
  usable_catalog: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IPromotionState {
  allPromotions: IPromotionListItem[];
}

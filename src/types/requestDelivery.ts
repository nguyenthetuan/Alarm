export interface requestDelivery {
  loading: boolean;
  listProductType: ItemProductType[];
  listDeliveryMethod: ItemProductType[];
  listAddon: itemAddon[];
  distance: [];
  delivery: {};
  detailDelivery: {};
}

export interface ItemProductType {
  code: string;
  name: string;
  price: string;
  id: string;
  _id: string;
}

export interface itemDetailProductType {
  name: string;
  id: string;
  price: string;
}

export interface itemAddon {
  name: string;
  id: string;
  price: string;
  _id: string;
  createAt: string;
  updateAt: string;
}

export interface IRefModal {
  show: () => void;
  close: () => void;
}

export interface location {
  from: {
    address: string;
    lat: number;
    long: number;
    place_id?: string;
  };
  to: {
    address: string;
    lat: number;
    long: number;
    place_id?: string;
  };
}

import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  IExtraFood,
  ILongLocation,
  IOrderRequest,
  IPromotionListItem,
} from 'types';
interface IOrderItem {
  itemId: string;
  quantity: number;
  itemName: string;
  price: string;
  image: string;
  index: number;
  extraOptions: IExtraFood[];
}
interface IStateItem {
  orderItems: IOrderItem;
  extraOptions: IExtraFood[];
}
interface IContext {
  addItemToOrder: (item: any) => void;
  updateOrderItems: (item: any) => void;
  removeItem: (item: IOrderItem) => void;
  removeAll: () => void;
  updateLocationOrder: (loc: ILongLocation) => void;
  setNote: React.Dispatch<React.SetStateAction<String>>;
  setOrderRequest: React.Dispatch<
    React.SetStateAction<IOrderRequest | undefined>
  >;
  setSelectedRestaurant: React.Dispatch<React.SetStateAction<string>>;
  setDistance: React.Dispatch<React.SetStateAction<Number>>;
  setPromotions: React.Dispatch<React.SetStateAction<IPromotionListItem[]>>;
  setDeliveryFee: React.Dispatch<React.SetStateAction<Number | string>>;

  orderRequest?: IOrderRequest;
  note: string;
  orderItems: IOrderItem[];
  promotions: IPromotionListItem[];
  location?: ILongLocation;
  price: number;
  selectedRestaurant: string;
  distance: number;
  deliveryFee: number | string;
}
const CartContext = createContext<IContext>({
  addItemToOrder: () => {},
  updateOrderItems: () => {},
  removeItem: () => {},
  removeAll: () => {},
  updateLocationOrder: () => {},
  setSelectedRestaurant: () => {},
  setNote: () => {},
  setOrderRequest: () => {},
  setDistance: () => {},
  setPromotions: () => {},
  setDeliveryFee: () => {},

  orderRequest: undefined,
  note: '',
  price: 0,
  orderItems: [],
  promotions: [],
  location: undefined,
  selectedRestaurant: '',
  distance: 0,
  deliveryFee: 0,
});

let count = 0;

const CartProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [promotions, setPromotions] = useState<IPromotionListItem[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [location, setLocation] = useState<ILongLocation | undefined>(
    undefined,
  );
  const [deliveryFee, setDeliveryFee] = useState<number | string>(0);
  const [note, setNote] = useState<string>('');
  const [orderRequest, setOrderRequest] = useState<IOrderRequest | undefined>(
    undefined,
  );
  const [distance, setDistance] = useState<number>(0);

  const removeAll = useCallback(() => {
    setOrderItems([]);
    setLocation(undefined);
  }, []);

  const removeItem = useCallback(
    (item: IOrderItem) => {
      setOrderItems(prev => {
        const existedItem = orderItems.find(
          order => order.itemId === item.itemId,
        );
        if (!existedItem) {
          return prev;
        }
        let newOrderList = prev.filter(order => order.itemId !== item.itemId);
        const newQuantity = existedItem.quantity - 1;

        return {
          ...prev,
          orderItems: newQuantity
            ? [...newOrderList, { ...existedItem, quantity: newQuantity }]
            : newOrderList,
        };
      });
    },
    [orderItems],
  );

  const addItemToOrder = useCallback(
    (item: IStateItem) => {
      setOrderItems(prev => {
        return [
          ...prev,
          {
            ...item?.orderItems,
            index: count++,
            extraOptions: item.extraOptions,
          },
        ];
      });
    },
    [orderItems],
  );

  const updateOrderItems = useCallback(
    (item: IStateItem) => {
      setOrderItems(prev => {
        const existedItem = orderItems.find(
          order => order.index === item?.orderItems.index,
        );
        if (!existedItem) {
          return prev;
        } else {
          const index = prev.findIndex(el => existedItem.index === el.index);
          if (index > -1) {
            prev.splice(index, 1);
          }
          if (item?.orderItems.quantity === 0) {
            return [...prev];
          }
          prev.push({ ...item.orderItems, extraOptions: item?.extraOptions });
          return [...prev];
        }
      });
    },
    [orderItems],
  );

  const updateLocation = useCallback((loc: ILongLocation) => {
    setLocation(loc);
  }, []);

  const price = useMemo(() => {
    return orderItems?.reduce((prev, curr: IOrderItem) => {
      const extraPrice =
        curr.extraOptions?.reduce((_prev, _curr) => _curr.price + _prev, 0) ??
        0;
      return prev + (Number(curr?.price) + extraPrice) * curr.quantity;
    }, 0);
  }, [orderItems]);

  const value = useMemo<IContext>(() => {
    return {
      location,
      orderItems: orderItems,
      promotions,
      addItemToOrder: addItemToOrder,
      updateOrderItems: updateOrderItems,
      price,
      removeAll: removeAll,
      removeItem: removeItem,
      selectedRestaurant,
      setSelectedRestaurant,
      updateLocationOrder: updateLocation,
      note,
      setNote,
      orderRequest,
      distance,
      setOrderRequest,
      setDistance,
      setPromotions,

      deliveryFee,
      setDeliveryFee,
    };
  }, [
    location,
    orderItems,
    promotions,
    addItemToOrder,
    updateOrderItems,
    price,
    removeAll,
    removeItem,
    selectedRestaurant,
    setSelectedRestaurant,
    updateLocation,
    note,
    setNote,
    orderRequest,
    distance,
    setOrderRequest,
    setDistance,
    setPromotions,
    deliveryFee,
    setDeliveryFee,
  ]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;

import React, { useEffect, useState } from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ImageCus, TextCus, TouchCus, ViewCus } from 'components';
import { formatMoney } from 'utils';
import styles from './styles';
import { IOrderRequest, IShippingType } from 'types';
import { Images } from 'assets';
import { useOrders } from 'hooks';

type Option = {
  fast: boolean;
  price: number;
  time: number;
  distance: number;
  orderRequest: IOrderRequest;
} & IShippingType;

interface IProps {
  initialValue?: Option;
  options: Option[];
  onCancel: () => void;
  onSubmit: (data: Option) => void;
}

const ChooseWayToDelivery: React.FC<IProps> = props => {
  const [listData, setListData] = useState(props.options);
  const { onCalculate } = useOrders();

  useEffect(() => {
    setListData(props.options);
  }, [props.options]);

  useEffect(() => {
    if (props.options.length > 0) {
      const listDataClone = [...props.options];
      const listFunc: Promise<any>[] = [];
      for (let i = 0; i < listDataClone.length; i++) {
        const element = listDataClone[i];
        listFunc.push(
          new Promise(res => {
            onCalculate(
              { shippingTypeId: element.id, ...element.orderRequest },
              rs => {
                res({ id: element.id, ...rs.data.result[0] });
              },
            );
          }),
        );
      }

      Promise.all(listFunc).then(rs => {
        if (rs && rs.length > 0) {
          for (let i = 0; i < rs.length; i++) {
            const element: any = rs[i];
            for (let j = 0; j < listDataClone.length; j++) {
              const data = listDataClone[j];
              if (element.id === data.id) {
                listDataClone[j].time = element.durationMinute;
                listDataClone[j].distance = element.distanceKm;
              }
            }
          }
          setListData(listDataClone);
        }
      });
    }
  }, [props.options]);

  return (
    <ViewCus flex-1 flex-column flexGrow-1 style={[styles.w100]}>
      <BottomSheetScrollView>
        {listData?.map((val, index) => {
          return (
            <TouchCus
              key={index}
              flex-row
              mb-12
              px-16
              h-48
              items-center
              justify-space-between
              style={[
                styles.w100,
                val.id === props.initialValue?.id ? styles.selected : null,
              ]}
              onPress={() => {
                props.onSubmit(val);
              }}>
              <ViewCus flex-row items-center>
                <ViewCus mr-8>
                  <ViewCus items-center>
                    <ViewCus
                      bg-pinkShadow45
                      br-40
                      h-30
                      w-30
                      style={[
                        {
                          position: 'absolute',
                        },
                      ]}
                    />
                    <ImageCus
                      source={Images.bike}
                      style={[
                        {
                          width: 32,
                          height: 32,
                        },
                      ]}
                      resizeMode="contain"
                    />
                  </ViewCus>
                </ViewCus>
                <ViewCus>
                  <TextCus>
                    Giao {val.fast ? 'nhanh' : 'chậm'}{' '}
                    {formatMoney(val.pricePerKm * val.distance)}
                  </TextCus>
                </ViewCus>
              </ViewCus>
              <TextCus>
                {val.time} phút - {val.distance}km
              </TextCus>
            </TouchCus>
          );
        })}
      </BottomSheetScrollView>
    </ViewCus>
  );
};

export default ChooseWayToDelivery;

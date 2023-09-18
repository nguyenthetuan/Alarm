import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Images } from 'assets';
import Icon from 'assets/svg/Icon';
import { ImageCus, TextCus, TouchCus, ViewCus } from 'components';
import { NavigationService, Routes } from 'navigation';
import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, ActivityIndicator } from 'react-native';
import { Colors } from 'theme';
import { formatMoney, height } from 'utils';
import { useOrders } from 'hooks';
import styles from './styles';
import _ from 'lodash';

interface Option {
  id: number;
  fast: boolean;
  price: number;
  time: number;
  distance: number;
}

interface IProps {
  initialValue?: Option;
  options: Option[];
  onCancel: () => void;
  onSubmit: (data: Option) => void;
  fromToData: any;
  onLayout: (height: number) => void;
  type: string;
}

const ChooseWayToDelivery: React.FC<IProps> = props => {
  const [data, setData] = useState(
    _.cloneDeep(
      props.type !== 'CAR_DRIVER'
        ? props.options.filter(
            elm => elm.type.includes(props.type) && elm.vehicle,
          )
        : props.options.filter(elm => !elm.vehicle),
    ) || [],
  );
  const [refresh, setRefresh] = useState(1);
  const { loading } = useOrders();

  // const isFocused = useIsFocused();
  useEffect(() => {
    setData(
      _.cloneDeep(
        props.type !== 'CAR_DRIVER'
          ? props.options.filter(
              elm => elm.type.includes(props.type) && elm.vehicle,
            )
          : props.options.filter(elm => !elm.vehicle),
      ),
    );
    setRefresh(refresh + 1);
  }, [props.options]);

  return (
    <ViewCus>
      <BottomSheetScrollView>
        <View
          onLayout={e =>
            props.onLayout(e.nativeEvent.layout.height + (height * 100) / 812)
          }>
          <ViewCus
            mb-20
            pl-20
            pr-20
            flex-row
            style={{ justifyContent: 'space-between' }}>
            <TextCus bold heading4>
              Gợi ý dịch vụ
            </TextCus>
            <TouchCus
              onPress={props.onShowFullWayToDelivery}
              style={{ alignItems: 'center' }}
              flex-row>
              <TextCus color={Colors.main}>Tất cả phương tiện</TextCus>
              <Image
                style={{ width: 14, height: 14, marginLeft: 10 }}
                resizeMode={'contain'}
                source={Images.arrowUp}
              />
            </TouchCus>
          </ViewCus>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.main} />
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => `${index.toString()}`}
              renderItem={({ item, index }) => {
                const _item = { ...item };
                console.log('item', _item);
                console.log('item.price', _item.price);
                console.log('item.price', _item.distance);

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
                      item.id === props.initialValue?.id
                        ? styles.selected
                        : null,
                    ]}
                    onPress={() => {
                      props.onSubmit(item);
                    }}>
                    <ViewCus flex-row items-center>
                      <ViewCus mr-8>
                        {/* <Icon.MotoCylce fast={val.fast} /> */}
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
                          {(item.type === 'CAR4SEATS' ||
                            item.type === 'CAR7SEATS') && (
                            <ImageCus
                              source={Images.car4Seat}
                              style={[
                                {
                                  width: 32,
                                  height: 32,
                                },
                              ]}
                              resizeMode="contain"
                            />
                          )}
                          {item.type === 'DRIVER' && (
                            <ImageCus
                              source={Images.derviceCar}
                              style={[
                                {
                                  width: 32,
                                  height: 32,
                                },
                              ]}
                              resizeMode="contain"
                            />
                          )}
                          {item.type === 'MOTORBIKE' && (
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
                          )}
                        </ViewCus>
                      </ViewCus>
                      <ViewCus>
                        <ViewCus flex-row items-center>
                          <TextCus color={Colors.black3A} mr-5>
                            {/* Giao {val.fast ? 'nhanh' : 'chậm'} {formatMoney(val.price)} */}
                            {item.title}
                          </TextCus>
                          <Icon.Info />
                        </ViewCus>
                        {item.subTitle && (
                          <ViewCus>
                            <TextCus color={'#838D8D'} caption>
                              {/* Giao {val.fast ? 'nhanh' : 'chậm'} {formatMoney(val.price)} */}
                              {item.subTitle}
                            </TextCus>
                          </ViewCus>
                        )}
                      </ViewCus>
                    </ViewCus>
                    <TextCus color="#021616" mainSize bold>
                      {formatMoney(_item?.price)} - {_item.distance}km
                    </TextCus>
                  </TouchCus>
                );
              }}
            />
          )}
          {/* <ViewCus px-16 style={[BaseStyle.flexRowSpaceBetwwen]}>
          <TextCus color="#000000" heading5>
            Đi chung
          </TextCus>
          <Icon.Info width={20} height={20} />
        </ViewCus> */}

          <ViewCus px-16 mt-8 flex-row items-center>
            <TouchCus
              f-1
              onPress={() => {
                NavigationService.navigate(Routes.BikeMethodPayment);
              }}>
              <ViewCus
                flex-row
                f-1
                style={{
                  marginRight: 16,
                }}>
                <Icon.CashOutLine />

                <TextCus color="#697575" subhead ml-5>
                  Tiền mặt
                </TextCus>
              </ViewCus>
            </TouchCus>

            <TouchCus
              f-1
              onPress={() => {
                NavigationService.navigate(Routes.Promotion, {
                  backPath: Routes.FindCar,
                  params: { type: props.type },
                });
              }}>
              <ViewCus
                f-1
                style={{
                  borderRightWidth: 1,
                  borderLeftWidth: 1,
                  marginRight: 16,
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <TextCus color="#697575" subhead>
                  Ưu đãi
                </TextCus>
              </ViewCus>
            </TouchCus>
            <TouchCus
              onPress={props?.onOpenMore}
              style={{ paddingHorizontal: 20 }}
              flex-row>
              <ViewCus
                mr-4
                style={{
                  height: 4,
                  width: 4,
                  backgroundColor: '#EE0A0A',
                  borderRadius: 8,
                }}
              />
              <ViewCus
                mr-4
                style={{
                  height: 4,
                  width: 4,
                  backgroundColor: '#EE0A0A',
                  borderRadius: 8,
                }}
              />
              <ViewCus
                mr-4
                style={{
                  height: 4,
                  width: 4,
                  backgroundColor: '#EE0A0A',
                  borderRadius: 8,
                }}
              />
            </TouchCus>
          </ViewCus>
        </View>
      </BottomSheetScrollView>
    </ViewCus>
  );
};

export default ChooseWayToDelivery;

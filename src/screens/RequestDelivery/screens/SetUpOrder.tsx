import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Icon from 'assets/svg/Icon';
import {
  Buttons,
  Divider,
  IconApp,
  ImageCus,
  ModalCus,
  TextCus,
  TextInputs,
  TouchCus,
  ViewCus,
} from 'components';
import { BaseStyle, Colors } from 'theme';
import { useGeo, useLocation } from 'hooks';

import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ChooseFromTo from '../components/ChooseFromTo';
import { IconName, Images } from 'assets';
import { RadioButton } from 'react-native-paper';
import { formatMoney } from 'utils';
import SelectedGroupItems from '../components/SelectedGroupItems';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

const dumpDataHinhThuc = [
  {
    icon: 'deliveryStuff', //
    title: 'Lấy hàng ngay (15 phút)',
    subTitle: 'Giao vào 14:00 - Siêu tốc',
  },
  {
    icon: 'bike', //
    title: 'Xe máy',
    subTitle: 'Hàng hóa tối đa 30kg (50x40x50cm)',
  },
];

const dumpDataLoaiHinhThuc = [
  {
    icon: 'deliveryStuff', //
    title: 'Thực phẩm',
  },
  {
    icon: 'deliveryStuff', //
    title: 'Quần áo',
  },
  {
    icon: 'bike', //
    title: 'Điện tử',
  },
  {
    icon: 'bike', //
    title: 'Dễ vỡ',
  },
  {
    icon: 'bike', //
    title: 'Khác',
  },
];

const dumpDataLoaiHinhHangHoa = [
  {
    title: 'Cơ bản',

    subTitle: 'Mặc định',
  },
  {
    title: 'Tiêu chuẩn',
    subTitle: '4.000đ',
  },
  {
    title: 'Nâng cao',
    subTitle: '10.000đ',
  },
];

const dumpDataListOptions = [
  {
    title: 'Thu tiền hộ (COD)',
    price: 20_000,
  },
  {
    title: 'Giao hàng tận tay',
  },
  {
    title: 'Giao hàng cỡ lớn (Từ 50kg, 60x70x60cm)',
  },
];

interface IProps {
  fromToData: {
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
  };
}
interface IRefs {}
const SetUpOrder = React.forwardRef<IRefs, IProps>((props, ref) => {
  //#region Static
  //#endregion

  //#region State
  const [value, setValue] = React.useState('first');
  const [showInputPriceModal, setShowInputPriceModal] = useState(false);
  //#endregion

  //#region Ref control
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  //#endregion

  //#region Ref value
  //#endregion

  //#region Function
  //#endregion

  //#region Watch change
  //#endregion

  //#region Render
  //#endregion

  //#region Export func
  useImperativeHandle(ref, () => {
    return {};
  });
  //#endregion
  return (
    <ViewCus style={[]}>
      <ChooseFromTo fromToData={props.fromToData} disabled={true} />
      {/* Chọn hình thức */}
      <ViewCus>
        <TextCus
          px-16
          mb-8
          color={Colors.black}
          style={{
            fontWeight: 600,
          }}>
          Chọn hình thức
        </TextCus>
        <ViewCus>
          {dumpDataHinhThuc.map((item, index) => {
            return (
              <ViewCus key={index} style={[]}>
                <ViewCus
                  px-16
                  py-8
                  f-1
                  items-center
                  style={[
                    {
                      flexDirection: 'row',
                    },
                    index == 0 ? styles.selectedDelivery : {},
                  ]}>
                  <ViewCus mr-8>
                    <ViewCus
                      bg-pinkShadow45
                      br-40
                      h-30
                      w-30
                      //   t-5
                      style={[{ position: 'absolute' }]}
                    />
                    <ImageCus
                      source={Images[item.icon]}
                      style={[
                        {
                          width: 32,
                          height: 32,
                        },
                      ]}
                      resizeMode="contain"
                    />
                  </ViewCus>
                  <ViewCus f-1 style={[{}]}>
                    <TextCus subhead color={Colors.black3A}>
                      {item.title}
                    </TextCus>
                    <TextCus caption color={Colors.grey8D}>
                      {item.subTitle}
                    </TextCus>
                  </ViewCus>
                  <ViewCus>
                    <IconApp
                      name={IconName.ChevronRight}
                      size={10}
                      color={Colors.disable}
                    />
                  </ViewCus>
                </ViewCus>
              </ViewCus>
            );
          })}
        </ViewCus>
      </ViewCus>
      {/* END Chọn hình thức */}
      {/* Áp dụng ưu đãi */}
      <ViewCus mb-8>
        <TextCus
          px-16
          color={Colors.black}
          style={{
            fontWeight: 600,
          }}>
          Áp dụng ưu đãi
        </TextCus>
        <ViewCus>
          <ViewCus>
            <ViewCus
              px-16
              py-8
              f-1
              items-center
              style={[
                {
                  flexDirection: 'row',
                },
              ]}>
              <ViewCus mr-8>
                <Icon.PromotionTag />
              </ViewCus>
              <ViewCus f-1 style={[{}]}>
                <TextCus subhead color={Colors.black3A}>
                  Áp dụng ưu đãi để được giảm giá
                </TextCus>
              </ViewCus>
              <ViewCus>
                <IconApp
                  name={IconName.ChevronRight}
                  size={10}
                  color={Colors.disable}
                />
              </ViewCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
      </ViewCus>
      {/* END Áp dụng ưu đãi */}
      {/* Khối lượng */}
      <ViewCus mb-8>
        <TextCus
          px-16
          color={Colors.black}
          style={{
            fontWeight: 600,
          }}>
          Khối lượng
        </TextCus>
        <ViewCus>
          <ViewCus>
            <ViewCus
              px-16
              f-1
              items-center
              style={[
                {
                  flexDirection: 'row',
                },
              ]}>
              <ViewCus f-1 style={[{}]}>
                <TextCus subhead color={Colors.black3A}>
                  Ước tính trọng lượng
                </TextCus>
              </ViewCus>
              <ViewCus
                f-1
                style={[
                  {
                    flexDirection: 'row',
                  },
                ]}>
                {/* <TextInputs
                  styleWrapperInput={{
                    flex: 1,
                    width: 120,
                    backgroundColor: 'red',
                    margin: 0,
                  }}
                  textAlign="center"
                /> */}
                <TextInput
                  keyboardType="number-pad"
                  style={[
                    BaseStyle.textInput,
                    {
                      textAlign: 'center',
                      flex: 1,
                      fontSize: 14,
                      height: 'auto',
                      padding: 0,
                      borderRadius: 8,
                      marginRight: 8,
                    },
                  ]}
                  value=""
                />
                <TextCus>kg</TextCus>
              </ViewCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
      </ViewCus>
      {/* END Khối lượng */}
      {/* Loại hàng hóa */}
      <ViewCus>
        <TextCus
          px-16
          mb-8
          color={Colors.black}
          style={{
            fontWeight: 600,
          }}>
          Loại hàng hóa
        </TextCus>
        <ViewCus>
          <ViewCus>
            <ViewCus
              px-16
              f-1
              items-center
              style={[
                {
                  flexDirection: 'row',
                },
              ]}>
              <ViewCus
                f-1
                style={[
                  {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  },
                ]}>
                <SelectedGroupItems
                  wrapperStyle={{
                    marginBottom: 8,
                  }}
                  items={dumpDataLoaiHinhThuc}
                  flatListProps={{
                    horizontal: true,
                  }}
                  renderItemFunc={(data, index, isSelected) => {
                    return (
                      <ViewCus
                        key={index}
                        px-16
                        py-8
                        mr-16
                        style={[
                          {
                            flexDirection: 'row',
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: Colors.redF3,
                            backgroundColor: Colors.redF3,
                          },
                          {
                            backgroundColor: isSelected
                              ? Colors.main
                              : 'transparent',
                          },
                        ]}>
                        <ImageCus
                          source={Images[data.icon]}
                          style={[
                            {
                              width: 24,
                              height: 24,
                              marginRight: 8,
                            },
                          ]}
                          resizeMode="contain"
                        />
                        <TextCus
                          color={isSelected ? Colors.white : Colors.black3A}>
                          {data.title}
                        </TextCus>
                      </ViewCus>
                    );
                  }}
                />
              </ViewCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
      </ViewCus>
      {/* END Loại hàng hóa */}
      {/* Dịch vụ thêm */}
      <ViewCus mt-16>
        <TextCus
          px-16
          mb-8
          color={Colors.black}
          style={{
            fontWeight: 600,
          }}>
          Dịch vụ thêm
        </TextCus>
        <ViewCus>
          <ViewCus>
            <ViewCus
              px-16
              f-1
              items-center
              style={[
                {
                  flexDirection: 'row',
                },
              ]}>
              <ViewCus f-1 style={[{}]}>
                <RadioButton.Group
                  onValueChange={v => setValue(v)}
                  value={value}>
                  {dumpDataListOptions.map((x, i) => {
                    return (
                      <ViewCus
                        key={i}
                        items-center
                        style={[
                          {
                            flexDirection: 'row',
                          },
                        ]}>
                        <TextCus style={[x.price ? {} : { flex: 1 }]}>
                          {x.title}{' '}
                        </TextCus>
                        {x.price && (
                          <TouchCus
                            f-1
                            onPress={() => {
                              setShowInputPriceModal(true);
                              bottomSheetModalRef.current?.present();
                            }}>
                            <TextCus color={Colors.main}>
                              /{formatMoney(x.price)}
                            </TextCus>
                          </TouchCus>
                        )}
                        <RadioButton.Android value={x as any} />
                      </ViewCus>
                    );
                  })}
                </RadioButton.Group>
              </ViewCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
      </ViewCus>
      {/* END Dịch vụ thêm */}
      <Modal
        visible={showInputPriceModal}
        animationType="fade"
        style={{
          flex: 1,
          backgroundColor: 'red',
        }}
        transparent={true}>
        <ViewCus
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#40000000',
            },
          ]}>
          <ViewCus
            px-8
            style={[
              {
                zIndex: 2,
                width: '95%',
                borderRadius: 16,
                paddingVertical: 8,
                backgroundColor: Colors.white,
                shadowColor: Colors.black,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              },
            ]}>
            <ViewCus>
              <ViewCus style={[BaseStyle.flexRowSpaceBetwwen]} mx-16 mb-16>
                <TextCus useI18n heading4>
                  Nhập số tiền thu hộ
                </TextCus>
                <TouchCus
                  onPress={() => {
                    setShowInputPriceModal(false);
                  }}>
                  <Icon.Close />
                </TouchCus>
              </ViewCus>
              <ViewCus
                style={[
                  {
                    flexDirection: 'row',
                  },
                ]}
                items-center
                mx-16
                mb-16>
                <TextInput
                  textAlign="center"
                  keyboardType="decimal-pad"
                  style={[BaseStyle.textInput, { flex: 1, marginRight: 8 }]}
                />
                <TextCus>Đồng</TextCus>
              </ViewCus>
              <ViewCus>
                <Buttons
                  onPress={() => {
                    setShowInputPriceModal(false);
                  }}
                  disabled={false}
                  loading={false}
                  style={[]}>
                  <TextCus useI18n bold heading5 color={Colors.white}>
                    Xác nhận
                  </TextCus>
                </Buttons>
              </ViewCus>
            </ViewCus>
          </ViewCus>
          <TouchableWithoutFeedback
            onPress={() => {
              setShowInputPriceModal(false);
            }}>
            <ViewCus
              style={{
                height: '100%',
                width: '100%',
                zIndex: 1,
                backgroundColor: '#00000040',
                position: 'absolute',
              }}></ViewCus>
          </TouchableWithoutFeedback>
        </ViewCus>
      </Modal>
    </ViewCus>
  );
});

const styles = StyleSheet.create({
  selectedDelivery: {
    backgroundColor: Colors.redFFa,
    borderColor: Colors.redEB,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
});

export default SetUpOrder;

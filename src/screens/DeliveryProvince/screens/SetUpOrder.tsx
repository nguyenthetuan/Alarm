import Icon from 'assets/svg/Icon';
import {
  Buttons,
  IconApp,
  ImageCus,
  ScrollViewCus,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import { NavigationService, Routes } from 'navigation';
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { BaseStyle, Colors } from 'theme';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { IconName, Images } from 'assets';
import { useDeliveryProvince, useRequestDelivery } from 'hooks';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { IRefModal } from 'types';
import { formatMoney } from 'utils';
import ChooseFromTo from '../components/ChooseFromTo';
import ModalSelectTypeDelivery from '../components/ModalDeliveryMethod';
import SelectedGroupItems from '../components/SelectedGroupItems';
import { useCart } from 'context/CartContext';

const type = [
  {
    icon: 'deliveryStuff', //
    title: 'Thực phẩm',
    code: 'FOOD',
  },
  {
    icon: 'iconClothes', //
    title: 'Quần áo',
    code: 'CLOTHES',
  },
  {
    icon: 'iconPhoneDelivery', //
    title: 'Điện tử',
    code: 'ELECTRONIC',
  },
  {
    icon: 'iconFragile', //
    title: 'Dễ vỡ',
    code: 'FRAGILE',
  },
  {
    icon: 'bike', //
    title: 'Khác',
    code: 'OTHER',
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
  cotinue: (value) => void;
  inforOder: any;
}
interface IRefs {}
const SetUpOrder = React.forwardRef<IRefs, IProps>((props, ref) => {
  const refModalDeliveryMethod = useRef<IRefModal>(null);
  const [showInputPriceModal, setShowInputPriceModal] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { setDistance, distance } = useCart();
  const {
    listProductType,
    listSpecificationType,
    listDeliveryMethod,
    listAddon,
    postDeliveryDistance,
  } = useDeliveryProvince();
  const [deliveryMethod, setDeliveryMethod] = useState(
    listDeliveryMethod?.find(
      elm =>
        `${elm.id}` === props.inforOder.postDeliveryDistance ||
        elm?.detail?.some(i => i.id === props.inforOder.postDeliveryDistance),
    ),
  );

  const [formData, setFormData] = useState({
    pickupLocation: props.fromToData.from,
    dropoffLocation: props.fromToData.to,
    weight: props.inforOder.weight,
    productType: props.inforOder.productType,
    specification: props.inforOder.specification,
    addon: props.inforOder.addon,
    postDeliveryDistance: props.inforOder.postDeliveryDistance,
    deliveryMethod: props.inforOder.deliveryMethod,
  });

  const dumpDataHinhThuc =
    listDeliveryMethod?.map(elm => {
      return {
        ...elm,
        icon: 'bike',
        title: elm.name,
        subTitle: 'Hàng hóa tối đa 30kg (50x40x50cm)',
      };
    }) || [];

  const dumpDataLoaiHinhThuc =
    listProductType?.result?.map(elm => {
      const item = type.find(e => e.code === elm.code);
      return {
        ...item,
        ...elm,
      };
    }) || [];

  const dumpDataLoaiQuyCach =
    listSpecificationType?.result?.map(elm => {
      const item = type.find(e => e.code === elm.code);
      return {
        ...item,
        ...elm,
      };
    }) || [];

  const dumpDataListOptions =
    listAddon?.result?.map(elm => {
      return {
        ...elm,
        title: elm.name,
      };
    }) || [];

  const valiSetUpOder = useCallback(() => {
    let result = true;
    if (
      !formData.deliveryMethod ||
      !formData.postDeliveryDistance ||
      !formData.weight ||
      !formData.productType ||
      !formData.specification
      // || !formData.addon
    ) {
      result = false;
    }
    return result;
  }, [formData]);
  useImperativeHandle(
    ref,
    useCallback(() => {
      return {
        isValid: () => {
          return valiSetUpOder();
        },
        getValue: () => {
          return formData;
        },
      };
    }, [formData]),
  );

  const setFormDataDistance = response => {
    if (response.status === 200) {
      setDistance(response.data.result[0].distanceKm);
      setFormData(data => {
        return {
          ...data,
          distance: response.data.result[0].distanceKm,
        };
      });
    }
  };
  const renderDeliveryMethod = () => {
    return (
      <ViewCus>
        <SelectedGroupItems
          items={dumpDataHinhThuc}
          flatListProps={{
            horizontal: false,
          }}
          initValue={deliveryMethod}
          onChange={(item: any) => {
            setDeliveryMethod(item);
            setFormData;
            if (item.detail?.length) {
              refModalDeliveryMethod.current?.show();
              setFormData(data => {
                return {
                  ...data,
                  postDeliveryDistance: item.id,
                };
              });
            } else {
              setFormData(data => {
                postDeliveryDistance(
                  {
                    ...data,
                    deliveryMethod: {
                      id: item.id,
                      name: item.name,
                      price: item.price,
                    },
                  },
                  respose => setFormDataDistance(respose),
                );
                return {
                  ...data,
                  deliveryMethod: {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                  },
                  postDeliveryDistance: item.id,
                };
              });
            }
          }}
          renderItemFunc={(data, index, isSelected) => {
            return (
              <ViewCus key={index} style={[]}>
                <ViewCus
                  px-16
                  py-8
                  f-1
                  items-center
                  flex-row
                  style={[isSelected ? styles.selectedDelivery : {}]}>
                  <ViewCus mr-8>
                    <ViewCus
                      bg-pinkShadow45
                      br-40
                      h-30
                      w-30
                      style={styles.wrapImageDelivery}
                    />
                    <ImageCus
                      source={Images[data.icon]}
                      style={styles.imageDelivery}
                      resizeMode="contain"
                    />
                  </ViewCus>
                  <ViewCus f-1 style={[{}]}>
                    <TextCus subhead semiBold color={Colors.black3A}>
                      {data.title}
                    </TextCus>
                    <TextCus caption color={Colors.grey8D}>
                      {data.subTitle}
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
          }}
        />
      </ViewCus>
    );
  };

  const renderProductType = () => {
    return (
      <ScrollViewCus
        horizontal
        contentContainerStyle={{ marginLeft: 14 }}
        f-2
        flex-row
        items-center
        px-16>
        <SelectedGroupItems
          wrapperStyle={styles.wrapItem}
          items={dumpDataLoaiHinhThuc}
          initValue={
            listProductType?.result?.find(
              elm => elm.name === formData.productType,
            ) || {}
          }
          flatListProps={{
            horizontal: true,
          }}
          onChange={(item: any) => {
            setFormData(data => {
              return {
                ...data,
                productType: item.name,
              };
            });
          }}
          renderItemFunc={(data, index, isSelected) => {
            return (
              <ViewCus
                key={index}
                px-16
                py-8
                mr-16
                style={isSelected ? styles.itemActive : styles.item}>
                <Image
                  source={Images[data.icon]}
                  style={isSelected ? styles.imageActive : styles.image}
                  resizeMode="contain"
                />
                <TextCus color={isSelected ? Colors.white : Colors.black3A}>
                  {data.title}
                </TextCus>
              </ViewCus>
            );
          }}
        />
      </ScrollViewCus>
    );
  };

  const renderStandard = () => {
    return (
      <ScrollViewCus
        horizontal
        contentContainerStyle={{ marginLeft: 14 }}
        f-2
        flex-row
        items-center
        px-16>
        <SelectedGroupItems
          wrapperStyle={styles.wrapItem}
          items={dumpDataLoaiQuyCach}
          initValue={
            listSpecificationType?.result?.find(
              elm => elm.code === formData?.specification?.code,
            ) || {}
          }
          flatListProps={{
            horizontal: true,
          }}
          onChange={(item: any) => {
            setFormData(data => {
              postDeliveryDistance(
                {
                  ...data,
                  specification: item,
                },
                respose => setFormDataDistance(respose),
              );
              return {
                ...data,
                specification: item,
                postDeliveryDistance: item.id,
              };
            });
          }}
          renderItemFunc={(data, index, isSelected) => {
            return (
              <ViewCus
                key={index}
                px-16
                py-8
                mr-16
                style={
                  isSelected ? styles.itemActiveStandard : styles.itemStandard
                }>
                <TextCus
                  semiBold
                  heading5
                  color={isSelected ? Colors.white : Colors.main}>
                  {data.name}
                </TextCus>
                <TextCus color={isSelected ? Colors.white : Colors.black3A}>
                  {data.price ? formatMoney(data.price) : 'Mặt định'}
                </TextCus>
              </ViewCus>
            );
          }}
        />
      </ScrollViewCus>
    );
  };

  const renderAddon = () => {
    return (
      <ViewCus px-16 f-1 items-center flex-row>
        <ViewCus f-1>
          <SelectedGroupItems
            wrapperStyle={styles.wrapItem}
            items={dumpDataListOptions}
            flatListProps={{
              horizontal: true,
            }}
            initValue={
              (formData?.addon &&
                listAddon?.result.find(
                  elm => elm.id === formData?.addon?.id,
                )) ||
              {}
            }
            onChange={(item: any) => {
              setFormData(data => {
                postDeliveryDistance(
                  {
                    ...data,
                    addon: {
                      id: item.id,
                      name: item.name,
                      price: item.price,
                    },
                  },
                  respose => setFormDataDistance(respose),
                );
                return {
                  ...data,
                  addon: {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                  },
                };
              });
            }}
            renderItemFunc={(data, index, isSelected) => {
              return (
                <ViewCus key={index} items-center flex-row>
                  <TextCus style={[data.price ? {} : { flex: 1 }]}>
                    {data.title}{' '}
                  </TextCus>
                  {data.price && (
                    <TouchCus
                      f-1
                      onPress={() => {
                        setShowInputPriceModal(true);
                        bottomSheetModalRef.current?.present();
                      }}>
                      <TextCus color={Colors.main}>
                        /{formatMoney(data.price)}
                      </TextCus>
                    </TouchCus>
                  )}
                  <ViewCus
                    style={
                      isSelected ? styles.radioButtonActive : styles.radioButton
                    }
                  />
                </ViewCus>
              );
            }}
          />
        </ViewCus>
      </ViewCus>
    );
  };

  return (
    <ViewCus style={[]}>
      <ChooseFromTo fromToData={props.fromToData} disabled={true} />
      <ViewCus>
        <TextCus px-16 mb-8 heading5 color-black style={styles.text}>
          Chọn hình thức
        </TextCus>
        {renderDeliveryMethod()}
      </ViewCus>
      <ViewCus my-8>
        <TextCus px-16 heading5 color-black style={styles.text}>
          Áp dụng ưu đãi
        </TextCus>
        <ViewCus>
          <ViewCus>
            <ViewCus px-16 py-8 f-1 items-center flex-row>
              <ViewCus mr-8>
                <Icon.PromotionTag />
              </ViewCus>
              <TouchCus
                f-1
                onPress={() => {
                  NavigationService.navigate(Routes.Promotion, {
                    backPath: Routes.DeliveryProvince,
                  });
                }}>
                <TextCus mainSize color={Colors.black3A}>
                  Áp dụng ưu đãi để được giảm giá
                </TextCus>
              </TouchCus>
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
      <ViewCus mb-8>
        <TextCus px-16 heading5 color={Colors.black} style={styles.text}>
          Khối lượng
        </TextCus>
        <ViewCus>
          <ViewCus>
            <ViewCus px-16 f-1 items-center flex-row>
              <ViewCus f-1 style={[{}]}>
                <TextCus mainSize color={Colors.black3A}>
                  Ước tính trọng lượng
                </TextCus>
              </ViewCus>
              <ViewCus f-1 flex-row items-center>
                <TextInput
                  keyboardType="number-pad"
                  style={[
                    BaseStyle.textInput,
                    {
                      textAlign: 'center',
                      flex: 1,
                      fontSize: 14,
                      height: 32,
                      padding: 0,
                      borderRadius: 8,
                      marginRight: 8,
                    },
                  ]}
                  placeholder={'Nhập số lượng'}
                  placeholderTextColor={Colors.grey85}
                  onChangeText={value => {
                    setFormData(data => {
                      return {
                        ...data,
                        weight: value,
                      };
                    });
                  }}
                  value={formData?.weight || ''}
                />
                <TextCus bold>Kg</TextCus>
              </ViewCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
      </ViewCus>
      <ViewCus>
        <TextCus heading5 px-16 mb-8 color-black style={styles.text}>
          Loại hàng hóa
        </TextCus>
        {renderProductType()}
      </ViewCus>
      <ViewCus>
        <TextCus heading5 px-16 mb-8 color-black style={styles.text}>
          Quy cách
        </TextCus>
        {renderStandard()}
      </ViewCus>
      {/*<ViewCus mt-16>*/}
      {/*  <TextCus heading5 px-16 mb-8 color-black style={styles.text}>*/}
      {/*    Dịch vụ thêm*/}
      {/*  </TextCus>*/}
      {/*  {renderAddon()}*/}
      {/*</ViewCus>*/}
      {/* END Dịch vụ thêm */}
      <Modal
        visible={showInputPriceModal}
        animationType="fade"
        style={{
          flex: 1,
        }}
        transparent={true}>
        <ViewCus
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
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
              }}
            />
          </TouchableWithoutFeedback>
        </ViewCus>
      </Modal>
      <ModalSelectTypeDelivery
        ref={refModalDeliveryMethod}
        continue={item => {
          setFormData(data => {
            postDeliveryDistance(
              {
                ...data,
                deliveryMethod: { ...item },
              },
              respose => setFormDataDistance(respose),
            );
            return {
              ...data,
              deliveryMethod: { ...item },
            };
          });
        }}
        data={deliveryMethod?.detail || []}
      />
    </ViewCus>
  );
});

const styles = StyleSheet.create({
  radioButtonActive: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.main,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  selectedDelivery: {
    backgroundColor: '#FFF9F2',
    borderColor: Colors.koromiko,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  item: {
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.redF3,
    backgroundColor: '#FFF9F2',
  },
  itemActive: {
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.redF3,
    backgroundColor: Colors.main,
  },
  itemStandard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.redF3,
    backgroundColor: '#FFF9F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActiveStandard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.redF3,
    backgroundColor: Colors.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: Colors.main,
  },
  imageActive: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: Colors.white,
  },
  wrapProduct: {
    flexWrap: 'wrap',
  },
  wrapItem: {
    marginBottom: 8,
  },
  wrapImageDelivery: {
    position: 'absolute',
  },
  imageDelivery: {
    width: 32,
    height: 32,
  },
});

export default SetUpOrder;

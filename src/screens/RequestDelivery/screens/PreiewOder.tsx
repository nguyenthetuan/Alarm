import Icon from 'assets/svg/Icon';
import {
  Buttons,
  IconApp,
  ImageCus,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { BaseStyle, Colors } from 'theme';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { IconName, Images } from 'assets';
import { useAuth, useRequestDelivery } from 'hooks';
import {
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

const type = [
  {
    icon: 'deliveryStuff', //
    title: 'Thực phẩm',
    code: 'FOOD',
  },
  {
    icon: 'deliveryStuff', //
    title: 'Quần áo',
    code: 'CLOTHES',
  },
  {
    icon: 'bike', //
    title: 'Điện tử',
    code: 'ELECTRONIC',
  },
  {
    icon: 'bike', //
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
  receiverInfo: any;
}
interface IRefs {}
const PreviewOder = React.forwardRef<IRefs, IProps>((props, ref) => {
  const refModalDeliveryMethod = useRef<IRefModal>(null);
  const [showInputPriceModal, setShowInputPriceModal] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { userInfo } = useAuth();
  console.log('userInfo', userInfo);

  const {
    listProductType,
    listDeliveryMethod,
    listAddon,
    postDeliveryDistance,
  } = useRequestDelivery();
  const [deliveryMethod, setDeliveryMethod] = useState(
    listDeliveryMethod?.result.find(
      elm => `${elm.id}` === props.inforOder.postDeliveryDistance,
    ),
  );

  const [formData, setFormData] = useState({
    pickupLocation: props.fromToData.from,
    dropoffLocation: props.fromToData.to,
    weight: props.inforOder.weight,
    productType: props.inforOder.productType,
    addon: props.inforOder.addon,
    postDeliveryDistance: props.inforOder.postDeliveryDistance,
    deliveryMethod: props.inforOder.deliveryMethod,
  });

  const dumpDataHinhThuc = listDeliveryMethod?.result.map(elm => {
    return {
      ...elm,
      icon: 'bike',
      title: elm.name,
      subTitle: 'Hàng hóa tối đa 30kg (50x40x50cm)',
    };
  });

  const dumpDataLoaiHinhThuc = listProductType?.result.map(elm => {
    const item = type.find(e => e.code === elm.code);
    return {
      ...item,
      ...elm,
    };
  });

  const dumpDataListOptions = listAddon?.result.map(elm => {
    return {
      ...elm,
      title: elm.name,
    };
  });

  const valiSetUpOder = useCallback(() => {
    let result = true;
    if (
      !formData.deliveryMethod ||
      !formData.postDeliveryDistance ||
      !formData.weight ||
      !formData.addon
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

  const setDistance = response => {
    if (response.status === 200) {
      setFormData(data => {
        return {
          ...data,
          distance: response.data.result[0].distanceText,
        };
      });
    }
  };
  const rerderInforSenderReceiver = () => {
    return (
      <>
        <ViewCus px-16 f-1>
          <ViewCus flex-row>
            <Image
              source={Images.personActive}
              style={styles.imagePersonSender}
            />
            <TextCus l-10 style={styles.text}>
              Người gửi
            </TextCus>
          </ViewCus>
          <TextCus style={styles.textInfor}>
            {userInfo?.full_name} - {userInfo?.phone_number} -{' '}
            {userInfo?.address}
          </TextCus>
        </ViewCus>
        <ViewCus px-16 f-1 mt-10 mb-10>
          <ViewCus flex-row>
            <Image source={Images.person} style={styles.imageReceive} />
            <TextCus l-10 style={styles.text}>
              Người nhận
            </TextCus>
          </ViewCus>
          <TextCus style={styles.textInfor}>
            {props?.receiverInfo?.receiverName} -{' '}
            {props?.receiverInfo?.receiverPhone} -{' '}
            {props?.receiverInfo?.receiverHouseNumber}
          </TextCus>
        </ViewCus>
      </>
    );
  };
  const renderDeliveryMethod = () => {
    return (
      <ViewCus>
        <SelectedGroupItems
          disable
          items={dumpDataHinhThuc}
          flatListProps={{
            horizontal: false,
          }}
          initValue={deliveryMethod}
          onChange={(item: any) => {
            setDeliveryMethod(item);
            setFormData;
            if (item.detail) {
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
                  respose => setDistance(respose),
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
                    <TextCus subhead color={Colors.black3A}>
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
      <ViewCus f-2 flex-row style={styles.wrapProduct} items-center px-16>
        <SelectedGroupItems
          disable
          wrapperStyle={styles.wrapItem}
          items={dumpDataLoaiHinhThuc}
          initValue={listProductType?.result.find(
            elm => elm.name === formData.productType,
          )}
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
                <ImageCus
                  source={Images[data.icon]}
                  style={styles.image}
                  resizeMode="contain"
                />
                <TextCus color={isSelected ? Colors.white : Colors.black3A}>
                  {data.title}
                </TextCus>
              </ViewCus>
            );
          }}
        />
      </ViewCus>
    );
  };

  const renderAddon = () => {
    return (
      <ViewCus px-16 f-1 items-center flex-row>
        <ViewCus f-1>
          <SelectedGroupItems
            disable
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
                  respose => setDistance(respose),
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
      {rerderInforSenderReceiver()}
      <ViewCus>
        <TextCus px-16 mb-8 color-black style={styles.text}>
          Chọn hình thức
        </TextCus>
        {renderDeliveryMethod()}
      </ViewCus>
      <ViewCus mb-8>
        <TextCus px-16 color-black style={styles.text}>
          Áp dụng ưu đãi
        </TextCus>
        <ViewCus>
          <ViewCus>
            <ViewCus px-16 py-8 f-1 items-center flex-row>
              <ViewCus mr-8>
                <Icon.PromotionTag />
              </ViewCus>
              <TouchCus f-1>
                <TextCus subhead color={Colors.black3A}>
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
        <TextCus px-16 color={Colors.black} style={styles.text}>
          Khối lượng
        </TextCus>
        <ViewCus>
          <ViewCus>
            <ViewCus px-16 f-1 items-center flex-row>
              <ViewCus f-1 style={[{}]}>
                <TextCus subhead color={Colors.black3A}>
                  Ước tính trọng lượng
                </TextCus>
              </ViewCus>
              <ViewCus f-1 flex-row>
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
                <TextCus>kg</TextCus>
              </ViewCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
      </ViewCus>
      <ViewCus>
        <TextCus px-16 mb-8 color-black style={styles.text}>
          Loại hàng hóa
        </TextCus>
        {renderProductType()}
      </ViewCus>
      <ViewCus mt-16>
        <TextCus px-16 mb-8 color-black style={styles.text}>
          Dịch vụ thêm
        </TextCus>
        {renderAddon()}
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
              respose => setDistance(respose),
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

export default PreviewOder;

const styles = StyleSheet.create({
  imagePersonSender: {
    tintColor: Colors.main,
    height: 20,
    width: 20,
  },
  imageReceive: {
    height: 20,
    width: 20,
  },
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
    backgroundColor: Colors.redFFa,
    borderColor: Colors.redEB,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  item: {
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.redF3,
    backgroundColor: 'transparent',
  },
  itemActive: {
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.redF3,
    backgroundColor: Colors.main,
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
  },
  textInfor: {
    fontWeight: '400',
    fontSize: 12,
    color: Colors.grey85,
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 8,
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

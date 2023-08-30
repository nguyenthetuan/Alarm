import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Images } from 'assets';
import Icon from 'assets/svg/Icon';
import { ImageCus, RoutineLocaltion, TextCus, ViewCus } from 'components';
import { useOrders } from 'hooks';
import React, { useEffect } from 'react';
import { BaseStyle } from 'theme';
import { IDriver_OrderDetail, IOrderDetail } from 'types';
import { getImage, getWidthBySpace } from 'utils';
import styles from './styles';

interface IProps {
  orderDetailData?: IOrderDetail | null;
  onCancel: () => void;
}

const driverInfomation = (
  driverInfo: IDriver_OrderDetail | null | undefined,
) => {
  // const callDriver = () => {
  //   if (driverInfo?.phone_number) {
  //     openLink('telephone', driverInfo.phone_number);
  //   }
  // };
  return (
    <ViewCus>
      <ViewCus style={styles.w100} px-16>
        <ViewCus flex-row justify-space-between items-center>
          <ViewCus items-flex-start w-32 />
          <ViewCus items-center w-68 h-68>
            {driverInfo?.avatar && (
              <ImageCus
                source={{
                  uri: getImage({
                    image: driverInfo?.avatar,
                  }),
                }}
                style={BaseStyle.flexGrow1}
                resizeMode="stretch"
              />
            )}

            {!driverInfo?.avatar && (
              <ImageCus
                source={
                  driverInfo?.type === 'car'
                    ? Images.carDriverAvatar
                    : Images.bikeDriverAvatar
                }
                style={[
                  BaseStyle.flexGrow1,
                  BaseStyle['w100%'],
                  BaseStyle['h100%'],
                ]}
                resizeMode="stretch"
              />
            )}
          </ViewCus>
          <ViewCus items-flex-end w-32>
            {/* <TouchCus onPress={callDriver}>
              <Icon.PhoneCircle width={32} height={32} />
            </TouchCus> */}
          </ViewCus>
        </ViewCus>
      </ViewCus>
      <ViewCus style={styles.w100} px-16>
        <ViewCus flex-column justify-center>
          <ViewCus mt-12>
            <TextCus textAlign="center" useI18n heading4>
              delivery.driverAreComing
            </TextCus>
          </ViewCus>
          {driverInfo?.full_name && (
            <ViewCus mt-12>
              <TextCus textAlign="center" heading2>
                {driverInfo?.full_name}
              </TextCus>
            </ViewCus>
          )}
        </ViewCus>
        <ViewCus mt-12>{Icon.Line(getWidthBySpace(32))}</ViewCus>
      </ViewCus>
    </ViewCus>
  );
};

const DriverAreComing: React.FC<IProps> = props => {
  //#region Static
  const { getFoodDetailByCode } = useOrders();
  //#endregion

  //#region ScreenState
  // const [listItemDetail, setListItemDetail] = useState({});
  //#endregion
  //#region handle event
  // const callCenter = () => {
  //   openLink('telephone', '19008079');
  // };
  //#endregion

  useEffect(() => {
    if (
      props?.orderDetailData &&
      props?.orderDetailData?.order_items?.length > 0
    ) {
      const listFunc = props.orderDetailData.order_items.map(x => {
        return new Promise(res => {
          getFoodDetailByCode(x.item_id, res);
        });
      });
      if (listFunc.length > 0) {
        Promise.all(listFunc)
          .then((values: any[]) => {
            const listData: any = values.map(x => x?.data?.result?.[0]);
            const rs = {};
            listData?.forEach?.(x => {
              rs[`${x.id}`] = { ...x };
            });
            setListItemDetail(rs);
          })
          .catch((e: TypeError) => {
            console.log(
              '🚀 ~ file: DriverAreComing.tsx:63 ~ useEffect ~ e:',
              e,
            );
          });
      }
    }
  }, [props.orderDetailData]);

  // if (!props.orderDetailData) {
  //   return <></>;
  // }

  return (
    <ViewCus>
      <BottomSheetView>
        {driverInfomation({
          ...props?.orderDetailData?.driver,
          type: props.type,
        })}
      </BottomSheetView>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <ViewCus>
          <ViewCus pl-16 pr-16 f-1 flexGrow-1 style={[styles.w100]}>
            <RoutineLocaltion
              style={[styles.w100]}
              from="36 Đinh Tiên Hoàng, Phường 6, Quận Bình Thạnh"
              to="58 Trần Văn Danh, Phường 13, Quận Tân Bình"
            />
          </ViewCus>
        </ViewCus>
      </BottomSheetScrollView>
    </ViewCus>
  );
};

export default DriverAreComing;

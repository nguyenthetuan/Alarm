import { Icons } from 'assets';
import { HomeLayout, TextCus, ViewCus } from 'components';
import { NavigationService, Routes } from 'navigation';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { UserSelectors } from 'store/user';
import { Colors, FontWeight } from 'theme';
import { IRestaurant, IUserInfo } from 'types';
import { formatMoney } from 'utils';
import { getWalletProfileAPI } from 'utils/APIManager';

// const DataFunction = [
//   {
//     id: 1,
//     Icon: Icons.IconWalletOut,
//     title: 'Nạp điểm',
//     action: () => NavigationService.navigate(Routes.TopUpPoint, {}),
//   },
//   {
//     id: 2,
//     Icon: Icons.IconWalletIn,
//     title: 'Rút điểm',
//     action: () => NavigationService.navigate(Routes.WithdrawPoints, {}),
//   },
//   {
//     id: 3,
//     Icon: Icons.IconWalletHistory,
//     title: 'Lịch sử',
//     action: () => NavigationService.navigate(Routes.HistoryWallet, {}),
//   },
//   {
//     id: 4,
//     Icon: Icons.IconWalletSp,
//     title: 'Thiện Nguyện',
//   },
// ];
interface wallet {
  id?: string;
  user_name?: string;
  wallet_active?: number;
  point?: number;
  promotion?: number;
  total_amount?: number;
}
export default function Wallet() {
  const [wallet, setWallet] = useState<wallet>({});
  const userInfo = useSelector(
    UserSelectors.getAttrByKey('userInfo'),
  ) as IUserInfo;
  const DataFunction = [
    {
      id: 1,
      Icon: Icons.IconWalletOut,
      title: 'Nạp điểm',
      action: () => NavigationService.navigate(Routes.TopUpPoint, {}),
    },
    {
      id: 2,
      Icon: Icons.IconWalletIn,
      title: 'Rút điểm',
      action: () =>
        NavigationService.navigate(Routes.WithdrawPoints, {
          wallet: wallet,
        }),
    },
    {
      id: 3,
      Icon: Icons.IconWalletHistory,
      title: 'Lịch sử',
      action: () => NavigationService.navigate(Routes.HistoryWallet, {}),
    },
    {
      id: 4,
      Icon: Icons.IconWalletSp,
      title: 'Thiện Nguyện',
    },
  ];

  const getWalletProfile = async () => {
    try {
      const res = await getWalletProfileAPI(userInfo?.id);
      if (res) {
        setWallet(res?.data?.result?.[0]);
      }
    } catch (error) {
      if (error) {
      }
    }
  };

  useEffect(() => {
    getWalletProfile();
  }, []);
  const renderTopContent = () => {
    return (
      <ViewCus>
        <ViewCus style={styles.boxHeader}>
          <ViewCus style={styles.boxContent}>
            <Image source={Icons.HomePriceWallet} />
            <ViewCus style={{ marginLeft: 12 }}>
              <TextCus heading5 regular color="white">
                Số dư hiện tại
              </TextCus>
              <TextCus heading2 color="white">
                {formatMoney(wallet?.total_amount || 0)}
              </TextCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
        <ViewCus style={styles.viewChooseDate}>
          <ViewCus style={styles.viewChooseDate1}>
            <ViewCus
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={Icons.IconWallet} />
              <TextCus heading5 regular style={{ marginLeft: 8 }}>
                Ví hoạt động
              </TextCus>
            </ViewCus>

            <ViewCus style={styles.textChooseDate}>
              <TextCus heading3 color={Colors.main} style={{ marginRight: 10 }}>
                {formatMoney(wallet?.wallet_active || 0)}
              </TextCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>

        <ViewCus
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ViewCus style={styles.viewWalletAdd}>
            <ViewCus style={styles.viewChooseDate1}>
              <ViewCus
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={Icons.IconWalletAdd} />
                <TextCus heading5 regular style={{ marginLeft: 8 }}>
                  Điểm nạp
                </TextCus>
              </ViewCus>

              <ViewCus style={styles.textChooseDate}>
                <TextCus
                  heading3
                  color={Colors.main}
                  style={{ marginRight: 10 }}>
                  {formatMoney(wallet?.point || 0)}
                </TextCus>
              </ViewCus>
            </ViewCus>
          </ViewCus>
          <ViewCus style={styles.viewWalletAdd}>
            <ViewCus style={styles.viewChooseDate1}>
              <ViewCus
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={Icons.IconWalletPromotion} />
                <TextCus heading5 regular style={{ marginLeft: 8 }}>
                  Khuyến mãi
                </TextCus>
              </ViewCus>

              <ViewCus style={styles.textChooseDate}>
                <TextCus
                  heading3
                  color={Colors.main}
                  style={{ marginRight: 10 }}>
                  {formatMoney(wallet?.promotion || 0)}
                </TextCus>
              </ViewCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
      </ViewCus>
    );
  };
  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        notGoBack: false,
        title: 'Ví điểm',
        iconColor: Colors.white,
      }}>
      <ViewCus
        style={{
          backgroundColor: Colors.greyF7,
          flex: 1,
        }}>
        {renderTopContent()}
        <ViewCus style={{ paddingHorizontal: 24, marginTop: 24 }}>
          <TextCus heading3>Chức năng</TextCus>
          <ViewCus style={styles.viewContentFunction}>
            {DataFunction?.map((e, index) => (
              <TouchableOpacity
                onPress={e?.action ? e?.action : () => {}}
                key={`${index}_${e.id}`}
                style={{ alignItems: 'center' }}>
                <Image source={e.Icon} />
                <TextCus style={{ marginTop: 6 }}>{e.title}</TextCus>
              </TouchableOpacity>
            ))}
          </ViewCus>
        </ViewCus>
        <ViewCus style={{ paddingHorizontal: 24, marginTop: 24 }}>
          <TextCus heading3>Chức sách vay vốn cho tài xế gober</TextCus>
        </ViewCus>
      </ViewCus>
    </HomeLayout>
  );
}
const styles = StyleSheet.create({
  header: {
    flex: 1,
    marginTop: 12,
  },
  divide: {},
  boxUpdated: {
    backgroundColor: Colors.blueED,
  },
  textUpdated: {
    fontSize: 14,
    lineHeight: 16,
    color: Colors.black3A,
  },
  textWallet: {
    fontSize: 14,
    lineHeight: 19,
  },
  btnAction: {
    width: 71,
    height: 28,
    borderRadius: 4,
  },
  boxHeader: {
    height: 100,
    backgroundColor: Colors.main,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },

  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  boxContent: {
    height: 100,
    alignItems: 'center',
    marginLeft: 24,
    flexDirection: 'row',
  },
  textIncome: {
    fontSize: 16,
    lineHeight: 18,
  },
  textMoney: {
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.black3A,
    paddingTop: 6,
  },
  viewChooseDate: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,

    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    marginTop: 30,
  },
  viewWalletAdd: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: '47%',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    marginTop: 20,
  },
  viewChooseDate1: {
    width: '90%',
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChooseDate: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  viewTotal: {
    width: '90%',
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  viewContentFunction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
  },
});

import Icon from 'assets/svg/Icon';
import {
  BottomSheetCommon,
  HomeLayout,
  SelecterPicker,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import { UserSelectors } from 'store/user';
import { Colors, FontWeight } from 'theme';
import { IRefBottom, IUserInfo, SELECT_OPTION } from 'types';
import { formatMoney, getCurrentDate } from 'utils';
import { getHistoryWalletAPI } from 'utils/APIManager';

export default function HistoryWallet() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const refDateTo = useRef<IRefBottom>(null);
  const refDateFrom = useRef<IRefBottom>(null);
  const [dateTo, setDateTo] = React.useState(moment());
  const [dateFrom, setDateFrom] = React.useState(moment());
  const [listAll, setListAll] = useState([]);
  const [listOut, setListOut] = useState([]);
  const [listIn, setListIn] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const userInfo = useSelector(
    UserSelectors.getAttrByKey('userInfo'),
  ) as IUserInfo;
  const [routes] = React.useState([
    { key: 'all', title: 'Tất cả' },
    { key: 'moneyIn', title: 'Tiền vào' },
    { key: 'moneyOut', title: 'Tiền ra' },
  ]);

  const getHistoryWallet = async (params: any) => {
    try {
      const res: any = await getHistoryWalletAPI(params);
      if (res) {
        setListAll(res?.data?.result);
        const out = res?.data?.result?.filter(e => e?.type === 'OUT');
        setListOut(out);
        const inList = res?.data?.result?.filter(e => e?.type !== 'OUT');
        setListIn(inList);
      }
    } catch (error) {
      if (error) {
      }
    }
  };

  useEffect(() => {
    const params = {
      limit: 20,
      page: 1,
      tus: true,
      startDate: `${moment(dateFrom).format('MM/DD/YYYY')} 00:00`,
      endDate: `$${moment(dateTo).format('MM/DD/YYYY')} 23:59`,
      user_id: userInfo?.id,
    };
    getHistoryWallet(params);
  }, [trigger]);

  const renderItem = ({ item }) => {
    return (
      <ViewCus style={styles.containerOrder}>
        <TextCus heading5 regular color={Colors.grey85}>
          {moment(item?.createdAt).format('DD/MM/YYYY hh:mm')}
        </TextCus>
        <ViewCus style={styles.viewOrder}>
          <TextCus heading5 regular color={Colors.black3A}>
            Đơn hàng
          </TextCus>
          <TextCus
            heading5
            medium
            color={item?.type !== 'OUT' ? Colors.success : Colors.redEB}>
            {item?.type !== 'OUT' ? '+' : '-'} {formatMoney(item?.cash_return)}{' '}
            VNĐ
          </TextCus>
        </ViewCus>
        <ViewCus style={styles.viewOrder}>
          <TextCus heading5 regular color={Colors.black3A}>
            Số dư
          </TextCus>
          <TextCus heading5 medium color={Colors.black3A}>
            {formatMoney(item?.price)} VNĐ
          </TextCus>
        </ViewCus>
      </ViewCus>
    );
  };
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'all': {
        return (
          <ViewCus>
            <FlatList
              data={listAll}
              renderItem={renderItem}
              keyExtractor={(item, indexItem) => `${item?.id}_${indexItem}`}
            />
          </ViewCus>
        );
      }

      case 'moneyIn': {
        return (
          <ViewCus>
            <FlatList
              data={listIn}
              renderItem={renderItem}
              keyExtractor={(item, indexItem) => `${item?.id}_${indexItem}`}
            />
          </ViewCus>
        );
      }
      case 'moneyOut': {
        return (
          <ViewCus>
            <FlatList
              data={listOut}
              renderItem={renderItem}
              keyExtractor={(item, indexItem) => `${item?.id}_${indexItem}`}
            />
          </ViewCus>
        );
      }
      default:
        break;
    }
  };

  const renderTabBar = props => {
    return (
      <ViewCus style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const selectedItem = index === i;
          return (
            <TouchCus
              key={route.key}
              style={[styles.tabItem, selectedItem && styles.selectedTabItem]}
              onPress={() => setIndex(i)}>
              <TextCus>
                <TextCus
                  useI18n
                  style={[styles.label, selectedItem && styles.selectedLabel]}>
                  {route.title}
                </TextCus>
              </TextCus>
            </TouchCus>
          );
        })}
      </ViewCus>
    );
  };

  const renderChooseDate = () => {
    return (
      <ViewCus style={styles.containerChooseDate}>
        <ViewCus style={{ marginTop: 12 }}>
          <TextCus color={Colors.black3A}>Từ ngày</TextCus>
          <TouchableOpacity
            onPress={() => refDateFrom?.current?.show()}
            style={styles.viewChooseDate}>
            <TextCus>{moment(dateFrom).format('DD/MM/YYYY')}</TextCus>
            <Icon.ArrowDown />
          </TouchableOpacity>
        </ViewCus>
        <ViewCus style={{ marginTop: 12 }}>
          <TextCus color={Colors.black3A}>Đến ngày</TextCus>
          <TouchableOpacity
            onPress={() => refDateTo?.current?.show()}
            style={styles.viewChooseDate}>
            <TextCus>{moment(dateTo).format('DD/MM/YYYY')}</TextCus>
            <Icon.ArrowDown />
          </TouchableOpacity>
        </ViewCus>
        <TouchableOpacity
          onPress={() => setTrigger(!trigger)}
          style={{ marginTop: 40, width: 40 }}>
          <Icon.IconSearch />
        </TouchableOpacity>
      </ViewCus>
    );
  };

  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        notGoBack: false,
        title: 'home.home_tab.history',
        iconColor: Colors.white,
      }}>
      <ViewCus style={styles.container}>
        <ViewCus style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon.SearchTrade />
          <TextCus heading2 medium style={{ marginLeft: 6 }}>
            Tra cứu giao dịch
          </TextCus>
        </ViewCus>
        {renderChooseDate()}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </ViewCus>
      <BottomSheetCommon ref={refDateFrom} hideBackdrop={false}>
        <SelecterPicker
          selectType={SELECT_OPTION.DATE_PICKER}
          selectOptionTitle="account.choose_day_filter"
          onConfirmSelect={date => {
            refDateFrom.current?.close();
            // setDateFrom(moment(date).format('DD/MM/YYYY'));
            setDateFrom(date);
          }}
          onCancelSelect={() => refDateFrom.current?.close()}
          maxDate={getCurrentDate()}
          // selectedPickerDate={getValues('birthday')}
        />
      </BottomSheetCommon>
      <BottomSheetCommon ref={refDateTo} hideBackdrop={false}>
        <SelecterPicker
          selectType={SELECT_OPTION.DATE_PICKER}
          selectOptionTitle="account.choose_day_filter"
          onConfirmSelect={date => {
            refDateTo.current?.close();
            // setDateTo(moment(date).format('DD/MM/YYYY'));
            setDateTo(date);
          }}
          onCancelSelect={() => refDateTo.current?.close()}
          maxDate={getCurrentDate()}
          // selectedPickerDate={getValues('birthday')}
        />
      </BottomSheetCommon>
    </HomeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
    flex: 1,
  },
  tabContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    marginVertical: 8,
    // marginHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  selectedTabItem: {
    borderBottomColor: Colors.main,
    borderBottomWidth: 3,
    borderRadius: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: FontWeight.semibold,
    color: Colors.black3A,
  },
  selectedLabel: {
    color: Colors.main,
  },
  viewChooseDate: {
    borderWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
    borderColor: Colors.greyD9,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  containerChooseDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  viewOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  containerOrder: {
    marginTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyD9,
  },
});

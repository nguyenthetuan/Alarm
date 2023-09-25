import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconName } from 'assets';
import { Images } from 'assets';
import { useAuth, useKey, useLocation } from 'hooks';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import * as Screens from 'screens';
import { Colors } from 'theme';
import { BaseStyle } from 'theme';
import { KEY_CONTEXT, isIos } from 'utils';
import ButtonBottomStack from './ButtonBottomStack';
import { navigationRef } from './NavigationService';
import { Routes } from './Routes';
import { RootStackParamList } from './types';
import Geolocation from '@react-native-community/geolocation';
import { BottomSheetAlert } from 'components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ViewCus } from 'components';
import LottieView from 'lottie-react-native';
import { StatusBar, Image } from 'react-native';
import MessageDetail from 'screens/Message/MessageDetail';
// import { Images } from 'assets';
const Tab = createBottomTabNavigator();
const TABAR_SCREEN = [
  {
    screen: Routes.Home,
    component: Screens.Home,
    textLabel: 'bottom.home',
    icon: Images.bottomHomepage,
  },
  {
    screen: Routes.Activity,
    component: Screens.Activity,
    textLabel: 'bottom.activity',
    icon: Images.bottomActivity,
  },
  {
    screen: Routes.Notification,
    component: Screens.Notification,
    textLabel: 'text.notification',
    icon: Images.bottomNotification,
  },
  {
    screen: Routes.Promotion,
    component: Screens.Message,
    textLabel: 'bottom.message',
    icon: Images.bottomMessage,
  },
  {
    screen: Routes.Account,
    component: Screens.Account,
    textLabel: 'bottom.account',
    icon: Images.bottomAccount,
  },
];

const HomeTabs = () => {
  const renderTabButton = useCallback(props => {
    return (
      <ButtonBottomStack
        {...props}
        icon={props.icon}
        route={props.screen}
        label={props.textLabel}
      />
    );
  }, []);
  return (
    <Tab.Navigator
      screenOptions={({}) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.main,
        tabBarInactiveTintColor: Colors.grey84,
        tabBarStyle: {
          height: isIos ? 98 : 60,
        },
      })}>
      {TABAR_SCREEN?.map((tabItem, index) => (
        <Tab.Screen
          key={index}
          name={tabItem?.screen}
          component={tabItem?.component}
          options={{
            tabBarShowLabel: false,
            tabBarButton: (props: BottomTabBarButtonProps) =>
              renderTabButton({ ...props, ...tabItem }),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator<RootStackParamList>();
interface IProps {
  inititalRoute: any;
}
const StackNavigator: React.FC<IProps> = ({ inititalRoute }) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={inititalRoute}>
      <Stack.Group>
        {inititalRoute === 'HomeTabs' ? (
          <Stack.Screen
            name={Routes.HomeTabsLogin}
            component={HomeTabs}
            options={{
              gestureEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen name={Routes.Intro} component={Screens.Intro} />
        )}
        <Stack.Screen name={Routes.InputPhone} component={Screens.InputPhone} />
        <Stack.Screen
          name={Routes.HomeTabs}
          component={HomeTabs}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name={Routes.InputPassword}
          component={Screens.InputPassword}
        />
        <Stack.Screen
          name={Routes.ResetPassword}
          component={Screens.ResetPassword}
        />
        <Stack.Screen name={Routes.KYC} component={Screens.KYC} />
        <Stack.Screen name={Routes.OTP} component={Screens.OTP} />
        <Stack.Screen name={Routes.Message} component={Screens.Message} />

        <Stack.Screen
          name={Routes.AllCategories}
          component={Screens.AllCategories}
        />
        <Stack.Screen name={Routes.Categories} component={Screens.Categories} />
        <Stack.Screen name={Routes.CartOrder} component={Screens.CartOrder} />
        <Stack.Screen name={Routes.CheckOrder} component={Screens.CheckOrder} />
        <Stack.Screen name={Routes.ExtraFood} component={Screens.ExtraFood} />
        <Stack.Screen name={Routes.Delivery} component={Screens.Delivery} />
        <Stack.Screen name={Routes.shipment} component={Screens.Shipment} />
        <Stack.Screen name={Routes.FindCar} component={Screens.FindCar} />
        <Stack.Screen
          name={Routes.SuggestForYou}
          component={Screens.SuggestForYou}
        />

        <Stack.Screen
          name={Routes.MethodPayment}
          component={Screens.MethodPayment}
        />
        <Stack.Screen
          name={Routes.BikeMethodPayment}
          component={Screens.BikePaymentMethod}
        />
        <Stack.Screen name={Routes.Promotion} component={Screens.Promotion} />
        <Stack.Screen
          name={Routes.RestaurantDetail}
          component={Screens.RestaurantDetail}
        />
        <Stack.Screen
          name={Routes.DeliveryAddress}
          component={Screens.DeliveryAddress}
        />
        <Stack.Screen
          name={Routes.InputAddress}
          component={Screens.InputAddress}
        />
        <Stack.Screen
          name={Routes.HistoryActivity}
          component={Screens.HistoryActivity}
        />
        <Stack.Screen name={Routes.Biker} component={Screens.Biker} />
        <Stack.Screen
          name={Routes.Notification}
          component={Screens.Notification}
        />
        <Stack.Screen
          name={Routes.ChangePassword}
          component={Screens.ChangePassword}
        />
        <Stack.Screen
          name={Routes.ContactSupport}
          component={Screens.ContactSupport}
        />
        <Stack.Screen name={Routes.InfoUser} component={Screens.InfoUser} />
        <Stack.Screen name={Routes.Term} component={Screens.Term} />
        <Stack.Screen
          name={Routes.RequestDelivery}
          component={Screens.RequestDelivery}
        />
        <Stack.Screen
          name={Routes.DeliveryProvince}
          component={Screens.DeliveryProvince}
        />
        <Stack.Screen name={Routes.Rating} component={Screens.Rating} />
        <Stack.Screen
          name={Routes.RatingBiker}
          component={Screens.RatingBiker}
        />
        <Stack.Screen
          name={Routes.RatingRestaurant}
          component={Screens.RatingRestaurant}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
        }}>
        <Stack.Screen
          name={Routes.ModalScreen}
          component={Screens.ModalScreen}
        />
        <Stack.Screen name={Routes.Wallet} component={Screens.Wallet} />
        <Stack.Screen
          name={Routes.WithdrawPoints}
          component={Screens.WithdrawPoints}
        />
        <Stack.Screen
          name={Routes.HistoryWallet}
          component={Screens.HistoryWallet}
        />
        <Stack.Screen name={Routes.TopUpPoint} component={Screens.TopUpPoint} />
      </Stack.Group>
      <Stack.Screen name={Routes.MessageDetail} component={MessageDetail} />
    </Stack.Navigator>
  );
};

export const Navigator = () => {
  const { user } = useAuth();
  const { getKeyStore } = useKey();
  const { saveCurrentLocation } = useLocation();
  const [inititalRoute, setInititalRoute] = useState('');
  const [isWaiting, setIsWaiting] = useState(true);
  const watchPositionRef = useRef<ReturnType<
    typeof Geolocation.watchPosition
  > | null>(null);
  useLayoutEffect(() => {
    (async () => {
      const isCheckIntro = await AsyncStorage.getItem('Intro');
      if (isCheckIntro === 'Y') {
        setInititalRoute(
          user?.accessToken ? Routes.HomeTabs : Routes.InputPhone,
        );
        return true;
      }
      setInititalRoute(Routes.Intro);
    })();
  }, [user?.accessToken]);

  const startWatchPosition = useCallback(() => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        const { latitude, longitude } = position.coords;
        saveCurrentLocation({
          lat: latitude,
          long: longitude,
        });
      },
      error => {},
      {
        enableHighAccuracy: true,
        maximumAge: 5_000,
        interval: 5000,
      },
    );
    watchPositionRef.current = Geolocation.watchPosition(
      p => {
        const { latitude, longitude } = p.coords;
        saveCurrentLocation({
          lat: latitude,
          long: longitude,
        });
      },
      error => {
        console.log('Error:', error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5_000,
        interval: 5000,
      },
    );
  }, []);

  const clearWatchPosition = useCallback(() => {
    if (watchPositionRef.current !== null) {
      Geolocation.clearWatch(watchPositionRef.current);
      watchPositionRef.current = null;
    }
  }, []);

  useEffect(() => {
    startWatchPosition();
    return () => {
      clearWatchPosition();
    };
  }, []);

  if (isWaiting) {
    setTimeout(() => {
      setIsWaiting(false);
    }, 4000);
    return (
      <ViewCus style={[BaseStyle.flex1]}>
        <StatusBar barStyle={'dark-content'} />
        <Image
          source={Images.splashImage}
          style={{ justifyContent: 'center', alignSelf: 'center' }}
        />
      </ViewCus>
    );
  }
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <StackNavigator inititalRoute={inititalRoute} />
        <BottomSheetAlert />
      </NavigationContainer>
    </>
  );
};

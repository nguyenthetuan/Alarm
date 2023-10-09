import { yupResolver } from '@hookform/resolvers/yup';
import { RouteProp, useRoute } from '@react-navigation/native';
import { IconName } from 'assets';
import {
  BottomSheetAlert,
  HomeLayout,
  TextCus,
  TextInputs,
  ViewCus,
  IconApp,
} from 'components';
import { BottomSheetRef } from 'components/BottomSheetAlert/BottomSheetAlert';
import { useAuth } from 'hooks';
import { NavigationService, RootStackParamList, Routes } from 'navigation';
import React, { useCallback, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InteractionManager, Image, View } from 'react-native';
import { BaseStyle, Colors } from 'theme';
import { EnumOTP } from 'types';
import { yupSchemaRegisterPassword } from 'utils';
import { Images } from 'assets';
import styles from './styles';

type TFormPassword = {
  password: string;
  confirmPassword: string;
};
export default function ResetPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<TFormPassword>({
    mode: 'onChange',
    resolver: yupResolver(yupSchemaRegisterPassword),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const sheetAlertRef = useRef<BottomSheetRef | null>(null);
  const route = useRoute<RouteProp<RootStackParamList, 'ResetPassword'>>();
  const { onResetPassword } = useAuth();
  const onHandleRegister = useCallback(
    (value: TFormPassword) => {
      const { password } = value;
      if (route?.params.type_check === EnumOTP.REGISTER) {
        NavigationService.navigate(Routes.KYC, {
          password,
          phoneNumber: route?.params.phoneNumber,
          typeCheck: route?.params.type_check,
        });
        return true;
      }
      onResetPassword(
        {
          password,
          phoneNumber: route?.params.phoneNumber,
          typeCheck: route?.params.type_check,
        },
        rs => {
          if (rs.status === 200) {
            sheetAlertRef.current?.handleOpenPress({
              type: 'success',
              title: 'Đổi mật khẩu thành công',
              subtitle: 'Vui lòng đăng nhập để tiếp tục',
              textOk: 'Đăng nhập',
              onOk: () => {
                sheetAlertRef.current?.handleClosePress();
                InteractionManager.runAfterInteractions(() => {
                  NavigationService.navigate(Routes.InputPhone);
                });
              },
            });
          }
        },
      );
    },
    [route.params],
  );
  return (
    <HomeLayout
      isForForm
      textBtn="auth.continue"
      onPress={handleSubmit(onHandleRegister)}
      styleContent={[BaseStyle.wrapperContentAuth]}
      disabled={!isDirty && !isValid}
      loading={false}
      iconRight={
        <View>
          <IconApp
            name={IconName.ChevronRight}
            size={15}
            color={Colors.white}
          />
        </View>
      }
      isDark>
      <ViewCus mt-30 mx-30>
        <View style={styles.wrapLock}>
          <Image source={Images.lock} />
        </View>
        <TextCus heading1 mt-12 mb-8 useI18n textAlign="center">
          auth.create_password
        </TextCus>
        <TextCus mb-32 color-grey85 useI18n textAlign="center">
          auth.resetpwd_subtitle
        </TextCus>
        <Controller
          control={control}
          name="password"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputs
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="auth.enter_password"
              error={errors.password?.message}
              // style={[BaseStyle.boxShadow]}
              isPassword
              leftIcon={IconName.Lock}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputs
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="auth.repeat_password"
              error={errors.confirmPassword?.message}
              // style={[BaseStyle.boxShadow]}
              isPassword
              leftIcon={IconName.Lock}
            />
          )}
        />
      </ViewCus>
      <BottomSheetAlert
        ref={sheetAlertRef}
        onChange={index => {
          if (index === -1) {
            NavigationService.navigate(Routes.InputPhone);
          }
        }}
      />
    </HomeLayout>
  );
}

import { yupResolver } from '@hookform/resolvers/yup';
import { Buttons, IconApp, TextCus, TextInputs, ViewCus } from 'components';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { RouteProp, useRoute } from '@react-navigation/native';
import { IconName } from 'assets';
import { useAuth } from 'hooks';
import { NavigationService, RootStackParamList, Routes } from 'navigation';
import { ScrollView, StatusBar, View } from 'react-native';
import { Colors } from 'theme';
import { yupSchemaInputPhone } from 'utils';
import styles from './styles';

type TFormInputPhone = {
  phoneNumber: string;
};
const InputPhone: React.FC = ({}) => {
  const route = useRoute<RouteProp<RootStackParamList, 'InputPhone'>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormInputPhone>({
    mode: 'onChange',
    resolver: yupResolver(yupSchemaInputPhone),
    defaultValues: {
      phoneNumber: '',
    },
  });
  const { loading, onRequestOTP } = useAuth();
  const onSubmitInputPhone = useCallback(
    (value: TFormInputPhone) => {
      onRequestOTP({ phoneNumber: value.phoneNumber });
    },
    [onRequestOTP],
  );
  return (
    <View style={styles.image}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <ViewCus style={styles.flex04}>{/* <Icon.Logo /> */}</ViewCus>
        <ViewCus px-24 style={styles.flex06}>
          <TextCus
            heading1
            mb-8
            useI18n
            textAlign="center"
            color={Colors.black3A}>
            auth.login_title
          </TextCus>
          <TextCus bold mb-12 color-grey85 useI18n textAlign="center">
            auth.login_subtitle
          </TextCus>
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputs
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="account.phone_number_input"
                keyboardType="phone-pad"
                error={errors.phoneNumber?.message}
                leftIcon={IconName.PhoneOutline}
              />
            )}
          />
          <TextCus
            useI18n
            color-blue47
            textAlign="right"
            onPress={() => {
              NavigationService.navigate(route.params?.back ?? Routes.HomeTabs);
            }}>
            auth.skip
          </TextCus>
          <Buttons
            textBtn={'continue'}
            mt-24
            mb-32
            style={styles.btnLogin}
            onPress={handleSubmit(onSubmitInputPhone)}
            disabled={loading}
            loading={loading}
            icon={
              <ViewCus ml-5>
                <IconApp
                  name={IconName.ChevronRight}
                  size={11}
                  color={Colors.white}
                />
              </ViewCus>
            }
          />
          <TextCus color-grey84>
            Tôi đồng ý những{' '}
            <TextCus
              style={styles.textDk}
              color-blue47
              onPress={() => NavigationService.navigate(Routes.Term)}>
              điều khoản và điều kiện
            </TextCus>{' '}
            của ứng dụng để tiếp tục
          </TextCus>
        </ViewCus>
      </ScrollView>
    </View>
  );
};
export default InputPhone;

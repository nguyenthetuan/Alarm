import {
  IconApp,
  ImageCus,
  SafeAreaStatusBar,
  SafeAreaViewCus,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Colors } from 'theme';
import { IRefBottom } from 'types';
import { IconName } from 'assets';
import styles from './Screens/styles';
import { getImage, KEY_CONTEXT, openLink } from 'utils';
import { NavigationService } from 'navigation';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useAuth, useKey, useSocket } from 'hooks';
import { IP_HOST } from '@env';
import IconSVG from 'assets/IconSVG';
import ImageMessagePicker from 'screens/Message/components/ImageMessagePicker';
import moment from 'moment/moment';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import ChatContent from 'screens/Message/components/chatContent';

export const avatarDefault =
  'https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png';

const MessageDetail = ({ route }) => {
  const partner = route?.params?.partner;

  const { onConnect, onConnectError, socket } = useSocket({
    uri: `ws://${IP_HOST}/message`,
    opts: {
      autoConnect: true,
      reconnection: true,
      transports: ['websocket'],
    },
  });
  const { userInfo, getListMessageHistory, onUploadImageChat } = useAuth();
  const userId = userInfo?.id;
  const isFocused = useIsFocused();

  const refChat = useRef();
  const refModal = useRef<IRefBottom>(null);
  const [message, setMessage] = useState('');
  const [listMessage, setListMessage] = useState<any>([]);
  const { getKeyStore } = useKey();

  useEffect(() => {
    onConnect(() => {
      console.log('===========onConnected===========');
    });
    onConnectError(err => {
      console.log('===========onConnectError===========');
      console.log('Tom log  => err', err);
    });
    if (isFocused) {
      fetchMessageHistory();
    }
    onListingNewMessage(handleNewMessage);
  }, [socket, isFocused]);

  const fetchMessageHistory = () => {
    getListMessageHistory(userId, partner?.user_id || partner?.id, rs => {
      if (
        Array.isArray(_.first(rs?.data?.result)) &&
        _.first(rs?.data?.result).length > 0
      ) {
        setListMessage([..._.first(rs?.data?.result)]?.reverse());
      }
    });
  };

  const onSendMessage = () => {
    if (message) {
      socket.emit('send_message', {
        sender_user_id: userId,
        receiver_user_id: partner?.user_id || partner?.id,
        content: message,
        type: 'TEXT',
      });
      setMessage('');
      const itemChatTemp = {
        type: 'TEXT',
        content: message,
        _id: new Date().getTime(),
        sender_user_id: userId,
        receiver_user_id: partner?.user_id || partner?.id,
        id: new Date().getTime(),
        createdAt: moment(),
        updatedAt: moment(),
      };

      setListMessage(state => [itemChatTemp, ...state]);
    }
  };

  const onSendImage = (url?: string) => {
    if (url) {
      socket.emit('send_message', {
        sender_user_id: userId,
        receiver_user_id: partner?.user_id || partner?.id,
        content: url,
        type: 'IMAGE',
      });
      setMessage('');
      const itemChatTemp = {
        type: 'IMAGE',
        content: url,
        _id: new Date().getTime(),
        sender_user_id: userId,
        receiver_user_id: partner?.user_id || partner?.id,
        id: new Date().getTime(),
        createdAt: moment(),
        updatedAt: moment(),
      };

      setListMessage(state => [itemChatTemp, ...state]);
    }
  };

  const onListingNewMessage = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('receive_message');
      socket.on('receive_message', callback);
    },
    [socket],
  );

  const handleNewMessage = data => {
    console.log('Tom log  => handleNewMessage', data);

    setListMessage(state => [
      {
        ...data,
        _id: new Date().getTime(),
        id: new Date().getTime(),
        createdAt: moment(),
        updatedAt: moment(),
      },
      ...state,
    ]);
  };

  const inputViewHeight = useRef(
    new Animated.Value(Platform.OS === 'android' ? 60 : 80),
  );

  const callDriver = () => {
    if (partner?.phone_number) {
      openLink('telephone', partner?.phone_number);
    }
  };

  const renderHeader = () => {
    return (
      <ViewCus p-16 flex-1 flex-row items-center style={styles.wrapperHeader}>
        <TouchCus onPress={() => NavigationService.goBack()} p-16 pl-0>
          <IconApp
            name={IconName.ChevronLeft}
            size={16}
            color={Colors.black3A}
          />
        </TouchCus>
        <ViewCus
          flex-1
          flex-row
          justify-space-between
          items-center
          style={{ width: '87%' }}>
          <ViewCus flex-1 flex-row>
            <ImageCus
              source={{
                uri: partner?.avatar
                  ? getImage({
                      image: partner?.avatar,
                    })
                  : avatarDefault,
              }}
              style={styles.avatarHeader}
              resizeMode="cover"
            />
            <ViewCus>
              <TextCus heading5 bold color-black3A>
                {partner?.full_name}
              </TextCus>
              <ViewCus flex-row items-center>
                <TextCus mainSize medium numberOfLines={1} color-black3A>
                  99-H7 7060 - Honda Air Blade
                </TextCus>
              </ViewCus>
            </ViewCus>
          </ViewCus>
          <TouchCus onPress={callDriver}>
            <IconApp
              name={IconName.PhoneOutline}
              size={24}
              color={Colors.disable}
            />
          </TouchCus>
        </ViewCus>
      </ViewCus>
    );
  };

  const onActionMessage = () => {
    console.log('onActionMessage');
  };

  const onActionMedia = () => {
    Keyboard.dismiss();
    refModal?.current?.show?.();
    console.log('onActionMedia');
  };

  const onEndReached = () => {
    console.log('onEndReached');
  };

  const onUploadImage = useCallback(
    async image => {
      const token = await getKeyStore(KEY_CONTEXT.ACCESS_TOKEN);
      onUploadImageChat(image, token, rs => {
        try {
          onSendImage(_.first(_.first(rs)?.files));
        } catch (err) {}
      });
    },
    [onUploadImageChat],
  );

  return (
    <SafeAreaViewCus bgColor={Colors.white}>
      <SafeAreaStatusBar modeContent={'dark-content'} />
      {renderHeader()}
      <ChatContent
        refChat={refChat}
        data={listMessage}
        onEndReach={onEndReached}
        isEndLoad={false}
        isLoading={false}
        userId={userId}
        listHeaderComponent={() => {}}
        partner={partner}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View
          style={[styles.bottomChatView, { height: inputViewHeight.current }]}>
          <ViewCus flex-row items-center justify-space-between>
            <ViewCus flex-row items-center>
              <TouchCus onPress={onActionMessage} activeOpacity={0.6}>
                <IconSVG.IconMessageMessage />
              </TouchCus>
              <TouchCus onPress={onActionMedia} activeOpacity={0.6} ml-5>
                <IconSVG.IconCameraMessage />
              </TouchCus>
            </ViewCus>

            <TextInput
              autoFocus={true}
              style={[styles.textInputContainer]}
              placeholder="Soạn tin nhắn"
              onChangeText={text => {
                setMessage(text);
              }}
              // onBlur={onBlurInput}
              value={message}
            />
            {!!message && (
              <TouchCus
                activeOpacity={0.6}
                onPress={onSendMessage}
                style={styles.sentButton}>
                <IconSVG.IconSendMessage />
              </TouchCus>
            )}
          </ViewCus>
        </Animated.View>
      </KeyboardAvoidingView>
      <ImageMessagePicker
        refModal={refModal}
        onChangePicture={image => onUploadImage(image)}
      />
    </SafeAreaViewCus>
  );
};

export default MessageDetail;

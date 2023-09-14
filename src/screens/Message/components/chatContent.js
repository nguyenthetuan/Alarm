import { isEmpty } from 'lodash';
import React, { memo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { ImageCus, TextCus, ViewCus } from 'components';
import { Colors } from 'theme';
import { getImage, width } from 'utils';
import { avatarDefault } from 'screens/Message/MessageDetail';

const ChatContent = ({
  data,
  refChat,
  isLoading,
  isEndLoad,
  onEndReach,
  userId,
  partner,
  listHeaderComponent,
}) => {
  const renderItem = (item, index) => {
    const isSender = item.sender_user_id?.toString() === userId?.toString();
    const driverInfo = {};
    return (
      <ViewCus
        style={[
          styles.messView,
          { flexDirection: isSender ? 'row-reverse' : 'row' },
        ]}>
        <ViewCus flex-rows style={[styles.textBasicStyle]}>
          <ViewCus
            flex-row
            style={{ justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
            {!isSender && (
              <ImageCus
                source={{
                  uri: partner?.avatar
                    ? getImage({
                        image: partner?.avatar,
                      })
                    : avatarDefault,
                }}
                style={styles.avatar}
                resizeMode="cover"
              />
            )}
            {item?.type === 'IMAGE' ? (
              <ImageCus
                source={{
                  uri: getImage({
                    image: item?.content,
                  }),
                }}
                style={styles.textImage}
                resizeMode="cover"
              />
            ) : (
              <TextCus
                style={[
                  styles.textMessage,
                  isSender && styles.textMessageSender,
                ]}>
                {item?.content}
              </TextCus>
            )}
          </ViewCus>
        </ViewCus>
      </ViewCus>
    );
  };

  const buildFooterComponent = () => {
    if (isEndLoad) {
      return (
        <ViewCus center style={styles.textHeight}>
          <TextCus>Không còn tin nhắn nào!</TextCus>
        </ViewCus>
      );
    } else {
      if (isLoading && !isEmpty(data)) {
        return (
          <ViewCus center style={styles.textHeight}>
            <ActivityIndicator size="small" color={Colors.greyEE} />
          </ViewCus>
        );
      } else {
        return <ViewCus />;
      }
    }
  };

  return (
    <FlatList
      ref={refChat}
      inverted
      data={data}
      extraData={data}
      overScrollMode="never"
      keyExtractor={(item, index) => item?._id || index.toString()}
      initialNumToRender={25}
      scrollEventThrottle={50}
      updateCellsBatchingPeriod={50}
      maxToRenderPerBatch={20}
      onEndReachedThreshold={2}
      onEndReached={() => {
        data?.length < 25 ? {} : onEndReach();
      }}
      renderItem={({ item, index }) => renderItem(item, index)}
      ListFooterComponent={data?.length < 25 ? null : buildFooterComponent()}
      ListHeaderComponent={listHeaderComponent}
    />
  );
};

export default memo(ChatContent);
const styles = StyleSheet.create({
  messView: {
    marginHorizontal: 16,
    marginRight: 16,
  },
  textHeight: { height: 46 },
  textBasicStyle: {
    paddingTop: 12,
    paddingBottom: 15,
    width: width * 0.67,
  },
  title: {
    flex: 1,
    marginLeft: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 20,
    marginRight: 8,
  },
  textMessage: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: Colors.greyEE,
    maxWidth: '100%',
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  textMessageSender: {
    backgroundColor: Colors.main,
    color: Colors.white,
  },
  textImage: {
    borderRadius: 8,
    width: width * 0.55,
    height: 150,
  },
});

import { RNFlatList, HomeLayout } from 'components';
import React, { useCallback, useEffect } from 'react';
import { NotificationItem } from './components';
import { Colors } from 'theme';
import { useNotification } from 'hooks';
const Notification: React.FC = () => {
  const renderItem = useCallback(({ item }) => {
    return <NotificationItem item={item} />;
  }, []);
  const { fetchNotificaitonData, listNotificationData } = useNotification();
  useEffect(() => {
    fetchNotificaitonData();
  }, [fetchNotificaitonData]);
  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        title: 'noti.title',
        iconColor: Colors.white,
      }}>
      <RNFlatList
        data={listNotificationData}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={() => {
          fetchNotificaitonData();
        }}
      />
    </HomeLayout>
  );
};
export default Notification;

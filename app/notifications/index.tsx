import { socket } from '@@/services/socket';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, SegmentedButtons, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomHeader } from '../../components/Header/CustomHeader';
import NotificationItem from '../../components/Notifications/NotificationItem';
import {
  getNotification,
  markNotificationsAsRead,
  markSingleNotificationAsRead,
} from '../../services/Notification/Notification';
import { useAppStore } from '../../stores/appStore';

interface Notification {
  _id: string;
  subject: string; // Đổi từ title -> subject
  content: string;
  isRead: boolean;
  createdAt: string;
  user: string;
  type?: string;
  link?: string;
  isDeleted?: boolean;
  updatedAt?: string;
}

type TabValue = 'all' | 'unread' | 'read';

export default function NotificationsScreen() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState<TabValue>('all');

  const fetchNotifications = useCallback(
    async (pageNum: number = 1, shouldRefresh: boolean = false) => {
      if (!currentUser?.userId) {
        return;
      }

      try {
        setLoading(pageNum === 1 && !shouldRefresh);
        if (shouldRefresh) setRefreshing(true);

        const cond: any = { user: currentUser.userId };
        if (selectedTab === 'unread') {
          cond.isRead = false;
        } else if (selectedTab === 'read') {
          cond.isRead = true;
        }

        const params = {
          page: pageNum,
          limit: 10,
          cond: cond,
        };

        const response = await getNotification(params);
        const newNotifications = response?.data?.result || [];

        if (pageNum === 1) {
          setNotifications(newNotifications);
        } else {
          setNotifications((prev) => [...prev, ...newNotifications]);
        }

        setHasMore(newNotifications.length === 10);
        setPage(pageNum);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
        if (shouldRefresh) setRefreshing(false);
      }
    },
    [currentUser, selectedTab],
  );

  // Setup Socket.IO để nhận thông báo realtime
  useEffect(() => {
    if (!currentUser?.userId) return;

    socket.emit('join-notification-room', currentUser.userId);

    const handleNewNotification = (notification: Notification) => {
      if (selectedTab === 'all' || selectedTab === 'unread') {
        setNotifications((prev) => [notification, ...prev]);
      }
    };

    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
      socket.emit('leave-notification-room', currentUser.userId);
    };
  }, [currentUser, selectedTab]);

  // Fetch notifications khi mount hoặc tab thay đổi
  useEffect(() => {
    setNotifications([]);
    setPage(1);
    setHasMore(true);
    fetchNotifications(1);
  }, [selectedTab, fetchNotifications]);

  const handleRefresh = () => {
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markSingleNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      if (selectedTab === 'unread') {
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== id),
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (!notifications || notifications.length === 0) return;

      const unreadIds = notifications
        .filter((n) => !n.isRead)
        .map((n) => n._id);

      if (unreadIds.length === 0) return;

      await markNotificationsAsRead(unreadIds);

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true })),
      );

      if (selectedTab === 'unread') {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={() => {
        if (!item.isRead) {
          handleMarkAsRead(item._id);
        }
      }}
    />
  );

  const renderFooter = () => {
    if (!loading || notifications.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#8B5CF6" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    let emptyText = 'Không có thông báo nào';
    if (selectedTab === 'unread') {
      emptyText = 'Không có thông báo chưa đọc';
    } else if (selectedTab === 'read') {
      emptyText = 'Không có thông báo đã đọc';
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  };

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        showLogo={false}
        showNotification={false}
        backgroundImage={require('../../assets/images/bg-home.jpg')}
        imageOpacity={0.7}
        titleColor="#ffffff"
      />

      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <SegmentedButtons
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as TabValue)}
            buttons={[
              {
                value: 'all',
                label: 'Tất cả',
                style: selectedTab === 'all' ? styles.activeTab : undefined,
              },
              {
                value: 'unread',
                label: `Chưa đọc ${unreadCount > 0 ? `(${unreadCount})` : ''}`,
                style: selectedTab === 'unread' ? styles.activeTab : undefined,
              },
              {
                value: 'read',
                label: 'Đã đọc',
                style: selectedTab === 'read' ? styles.activeTab : undefined,
              },
            ]}
            theme={{
              colors: {
                secondaryContainer: '#8B5CF6',
                onSecondaryContainer: '#ffffff',
              },
            }}
          />
        </View>

        {selectedTab !== 'read' && unreadCount > 0 && (
          <View style={styles.actionContainer}>
            <Text style={styles.markAllButton} onPress={handleMarkAllAsRead}>
              Đánh dấu tất cả là đã đọc
            </Text>
          </View>
        )}

        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#8B5CF6']}
            />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  markAllButton: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomHeader } from '../components/Header/CustomHeader';
import NotificationItem from '../components/Notifications/NotificationItem';
import {
  getNotification,
  putNotification,
} from '../services/Notification/Notification';
import { useAppStore } from '../stores/appStore';

interface Notification {
  _id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  user: string;
  type?: string;
  link?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(
    async (pageNum: number = 1, shouldRefresh: boolean = false) => {
      if (!currentUser?._id) return;

      try {
        setLoading(pageNum === 1 && !shouldRefresh);
        if (shouldRefresh) setRefreshing(true);

        const response = await getNotification({
          page: pageNum,
          limit: 10,
          cond: { user: currentUser._id },
        });

        const newNotifications = response.data || [];

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
    [currentUser],
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
      await putNotification(id, { isRead: true });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có thông báo nào</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        showLogo={false}
        showNotification={false}
        backgroundImage={require('../assets/images/bg-home.jpg')}
        imageOpacity={0.7}
        titleColor="#ffffff"
      />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
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

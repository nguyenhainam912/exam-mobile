import { putUser } from '@@/services/user/user';
import { useAppStore } from '@@/stores/appStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  Text,
} from 'react-native-paper';
import { UserFormData } from './Dialogs/DialogEditProfile';
import { ProfileDialogs } from './ProfileDialogs';

export function ProfileContent() {
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Lấy currentUser từ store
  const { currentUser, setCurrentUser } = useAppStore();

  // State mặc định cho userInfo
  const [userInfo, setUserInfo] = useState({
    name: 'Đang tải...',
    email: 'Đang tải...',
    phone: 'Đang tải...',
    joinDate: 'Đang tải...',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  });

  // Cập nhật userInfo khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      setUserInfo({
        name: currentUser.fullName || 'Chưa cập nhật',
        email: currentUser.email || 'Chưa cập nhật',
        phone: currentUser.phoneNumber || 'Chưa cập nhật',
        joinDate: formatDate(currentUser.createdAt || new Date().toISOString()),
        address: currentUser.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
      });
    }
  }, [currentUser]);

  // Hàm format ngày tháng
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // Hàm format địa chỉ
  const formatAddress = () => {
    if (!userInfo.address) return 'Chưa cập nhật';

    const parts = [];
    if (userInfo.address.street) parts.push(userInfo.address.street);
    if (userInfo.address.city) parts.push(userInfo.address.city);
    if (userInfo.address.country) parts.push(userInfo.address.country);

    return parts.length > 0 ? parts.join(', ') : 'Chưa cập nhật';
  };

  const handleLogout = async () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.multiRemove(['user_info', 'settings']);

      // Reset currentUser trong store
      setCurrentUser(null);

      setShowLogoutDialog(false);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      setShowLogoutDialog(false);
    }
  };

  // Hàm lưu thông tin người dùng
  const handleSaveUserData = async (data: UserFormData) => {
    try {
      // Gọi API để cập nhật thông tin người dùng trên server
      if (currentUser?._id) {
        const payload = {
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          avatar: data.avatar,
          address: data.address,
        };

        // Gọi API putUser để cập nhật dữ liệu
        const response = await putUser(currentUser.userId, payload);

        if (response?.statusCode === 200 && response?.data) {
          // Cập nhật dữ liệu trong store với data từ server
          const updatedUser = {
            ...currentUser,
            ...response.data, // Sử dụng dữ liệu từ server response
          };

          setCurrentUser(updatedUser);

          // Lưu thông tin cập nhật vào AsyncStorage
          await AsyncStorage.setItem('user_info', JSON.stringify(updatedUser));

          // Thông báo cập nhật thành công
          console.log('Cập nhật thành công');
        } else {
          throw new Error('Cập nhật thất bại');
        }
      } else {
        throw new Error('Không tìm thấy ID người dùng');
      }
    } catch (error: any) {
      console.error('Lỗi khi cập nhật:', error);

      // Xử lý lỗi theo format API mới
      if (error.response?.data?.errorDescription) {
        console.error('Error:', error.response.data.errorDescription);
        // Có thể hiển thị thông báo lỗi cho user ở đây
      } else if (error.response?.data?.message) {
        console.error('Error:', error.response.data.message);
      } else if (error.message) {
        console.error('Error:', error.message);
      }

      // Throw error để component có thể handle
      throw error;
    }
  };

  // Lấy chữ cái đầu của tên để hiển thị trong Avatar khi không có ảnh
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View style={styles.container}>
      {/* Tất cả Dialog đã được tách */}
      <ProfileDialogs
        showLogoutDialog={showLogoutDialog}
        showHelpDialog={showHelpDialog}
        showSupportDialog={showSupportDialog}
        showTermsDialog={showTermsDialog}
        showEditDialog={showEditDialog}
        setShowLogoutDialog={setShowLogoutDialog}
        setShowHelpDialog={setShowHelpDialog}
        setShowSupportDialog={setShowSupportDialog}
        setShowTermsDialog={setShowTermsDialog}
        setShowEditDialog={setShowEditDialog}
        confirmLogout={confirmLogout}
        userData={currentUser}
        onSaveUserData={handleSaveUserData}
      />

      {/* Phần header cố định */}
      <View style={styles.fixedHeader}>
        {/* Phần thông tin cá nhân */}
        <View style={styles.profileHeader}>
          {currentUser?.avatar ? (
            <Avatar.Image
              size={48}
              source={{ uri: currentUser.avatar }}
              style={{ marginRight: 16 }}
            />
          ) : (
            <Avatar.Text
              size={48}
              label={getInitials(userInfo.name)}
              color="#fff"
              style={{ backgroundColor: '#8B5CF6', marginRight: 16 }}
            />
          )}
          <View style={styles.profileInfo}>
            <Text variant="titleLarge" style={styles.name}>
              {userInfo.name}
            </Text>
          </View>
        </View>

        {/* Nút Chỉnh sửa hồ sơ */}
        <Button
          mode="outlined"
          style={styles.editButton}
          icon="account-edit"
          onPress={() => setShowEditDialog(true)}
        >
          Chỉnh sửa hồ sơ
        </Button>
      </View>

      {/* Phần có thể scroll */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Thông tin chi tiết */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Thông tin cá nhân
          </Text>
          <View style={styles.infoCard}>
            <InfoRow icon="email" label="Email" value={userInfo.email} />
            <Divider style={styles.divider} />
            <InfoRow
              icon="phone"
              label="Số điện thoại"
              value={userInfo.phone}
            />
            <Divider style={styles.divider} />
            <InfoRow
              icon="map-marker"
              label="Địa chỉ"
              value={formatAddress()}
            />
            <Divider style={styles.divider} />
            <InfoRow
              icon="calendar"
              label="Ngày tham gia"
              value={userInfo.joinDate}
            />
          </View>
        </View>

        {/* Trợ giúp & Hỗ trợ */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Trợ giúp & Hỗ trợ
          </Text>
          <View style={styles.helpCard}>
            <List.Item
              title="Trung tâm trợ giúp"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="help-circle-outline"
                  color="#8B5CF6"
                />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setShowHelpDialog(true)}
            />
            <Divider />
            <List.Item
              title="Liên hệ hỗ trợ"
              left={(props) => (
                <List.Icon {...props} icon="headset" color="#8B5CF6" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setShowSupportDialog(true)}
            />
            <Divider />
            <List.Item
              title="Điều khoản sử dụng"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="file-document-outline"
                  color="#8B5CF6"
                />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setShowTermsDialog(true)}
            />
          </View>
        </View>

        {/* Nút đăng xuất */}
        <Button
          mode="contained"
          style={styles.logoutButton}
          buttonColor="#f87171"
          icon="logout"
          onPress={handleLogout}
        >
          Đăng xuất
        </Button>

        {/* Phiên bản */}
        <Text style={styles.version}>Phiên bản 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

// Thêm interface cho InfoRow props
interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

// Component hiển thị thông tin dạng hàng
function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        <IconButton
          icon={icon}
          size={20}
          iconColor="#8B5CF6"
          style={styles.infoIcon}
        />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  // Phần header cố định
  fixedHeader: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    // Thêm shadow để tạo hiệu ứng phân tách
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 2,
  },
  // Phần có thể scroll
  scrollContent: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: 'white',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  role: {
    color: '#6B7280',
    marginTop: 2,
    fontSize: 14,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#DDD6FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '500',
  },
  editButton: {
    marginTop: 8,
    marginBottom: 8,
    borderColor: '#8B5CF6',
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#4B5563',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    margin: 0,
    marginRight: 8,
    backgroundColor: '#F3E8FF',
    height: 36,
    width: 36,
  },
  infoLabel: {
    color: '#4B5563',
    fontSize: 16,
  },
  infoValue: {
    color: '#111827',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 4,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  helpCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutButton: {
    marginVertical: 24,
  },
  version: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginBottom: 32,
  },
  contactIcon: {
    margin: 0,
    marginRight: 8,
    backgroundColor: '#F3E8FF',
    height: 36,
    width: 36,
  },
});

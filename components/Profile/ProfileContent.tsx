import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  Text,
} from 'react-native-paper';

export function ProfileContent() {
  const [userInfo] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    role: 'Giáo viên',
    joinDate: '01/09/2023',
  });

  return (
    <View style={styles.container}>
      {/* Phần header cố định */}
      <View style={styles.fixedHeader}>
        {/* Phần thông tin cá nhân */}
        <View style={styles.profileHeader}>
          <Avatar.Image
            size={80}
            source={{ uri: 'https://i.pravatar.cc/300' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text variant="titleLarge" style={styles.name}>
              {userInfo.name}
            </Text>
            <Text style={styles.role}>{userInfo.role}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Tài khoản đã xác thực</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Nút Chỉnh sửa hồ sơ */}
        <Button
          mode="outlined"
          style={styles.editButton}
          icon="account-edit"
          onPress={() => console.log('Edit profile')}
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
              icon="calendar"
              label="Ngày tham gia"
              value={userInfo.joinDate}
            />
          </View>
        </View>

        {/* Cài đặt */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Cài đặt
          </Text>
          <View style={styles.settingsCard}>
            <List.Item
              title="Thông báo"
              description="Quản lý thông báo ứng dụng"
              left={(props) => (
                <List.Icon {...props} icon="bell-outline" color="#8B5CF6" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('Notifications')}
            />
            <Divider />
            <List.Item
              title="Ngôn ngữ"
              description="Tiếng Việt"
              left={(props) => (
                <List.Icon {...props} icon="translate" color="#8B5CF6" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('Language')}
            />
            <Divider />
            <List.Item
              title="Giao diện"
              description="Sáng"
              left={(props) => (
                <List.Icon {...props} icon="theme-light-dark" color="#8B5CF6" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('Theme')}
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
              onPress={() => console.log('Help center')}
            />
            <Divider />
            <List.Item
              title="Liên hệ hỗ trợ"
              left={(props) => (
                <List.Icon {...props} icon="headset" color="#8B5CF6" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('Contact support')}
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
              onPress={() => console.log('Terms')}
            />
          </View>
        </View>

        {/* Nút đăng xuất */}
        <Button
          mode="contained"
          style={styles.logoutButton}
          buttonColor="#f87171"
          icon="logout"
          onPress={() => console.log('Logout')}
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
});

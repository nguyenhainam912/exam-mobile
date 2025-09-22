import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, HelperText, TextInput } from 'react-native-paper';

interface DialogEditProfileProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (userData: UserFormData) => void;
  userData: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    avatar?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };
}

export interface UserFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export function DialogEditProfile({
  visible,
  onDismiss,
  onSave,
  userData,
}: DialogEditProfileProps) {
  const [fullName, setFullName] = useState(userData?.fullName || '');
  // Email không cần setState vì không cho phép chỉnh sửa
  const email = userData?.email || '';
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [avatar, setAvatar] = useState(userData?.avatar || '');
  const [street, setStreet] = useState(userData?.address?.street || '');
  const [city, setCity] = useState(userData?.address?.city || '');
  const [state, setState] = useState(userData?.address?.state || '');
  const [country, setCountry] = useState(userData?.address?.country || '');
  const [zipCode, setZipCode] = useState(userData?.address?.zipCode || '');

  // Validation states
  const [errors, setErrors] = useState({
    fullName: false,
  });

  // Hàm xử lý khi lưu
  const handleSave = () => {
    // Validate required fields
    const newErrors = {
      fullName: !fullName.trim(),
    };

    setErrors(newErrors);

    // If any errors, don't proceed
    if (newErrors.fullName) {
      return;
    }

    const updatedUserData: UserFormData = {
      fullName,
      email, // Giữ nguyên email
      phoneNumber,
      avatar,
      address: {
        street,
        city,
        state,
        country,
        zipCode,
      },
    };
    onSave(updatedUserData);
  };

  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={{ backgroundColor: 'white' }}
    >
      <Dialog.Title>Chỉnh sửa người dùng</Dialog.Title>
      <Dialog.ScrollArea style={{ maxHeight: 450, paddingHorizontal: 0 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <View style={styles.inputRow}>
              <TextInput
                label="Họ tên"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (text.trim()) setErrors({ ...errors, fullName: false });
                }}
                style={styles.input}
                mode="outlined"
                autoCapitalize="words"
                right={<TextInput.Affix text="*" />}
                error={errors.fullName}
              />
              {errors.fullName && (
                <HelperText type="error" visible={errors.fullName}>
                  Vui lòng nhập họ tên
                </HelperText>
              )}
            </View>

            <View style={styles.inputRow}>
              <TextInput
                label="Email"
                value={email}
                // Không có onChangeText để không thể chỉnh sửa
                style={[styles.input, { backgroundColor: '#f0f0f0' }]} // Thêm style để hiển thị trạng thái disabled
                mode="outlined"
                disabled={true} // Thêm disabled để không cho phép chỉnh sửa
                right={<TextInput.Affix text="*" />}
              />
              <HelperText type="info">Email không thể thay đổi</HelperText>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                label="Số điện thoại"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                mode="outlined"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputRow}>
              <TextInput
                label="Avatar URL"
                value={avatar}
                onChangeText={setAvatar}
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                placeholder="https://wallpapers.com/images/high/minimalist..."
              />
            </View>

            <View style={styles.sectionTitle}>
              <Dialog.Title>Địa chỉ</Dialog.Title>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                label="Đường"
                value={street}
                onChangeText={setStreet}
                style={styles.input}
                mode="outlined"
              />
            </View>

            <View style={styles.addressRow}>
              <TextInput
                label="Thành phố"
                value={city}
                onChangeText={setCity}
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                mode="outlined"
              />
              <TextInput
                label="Tỉnh/TP"
                value={state}
                onChangeText={setState}
                style={[styles.input, { flex: 1 }]}
                mode="outlined"
              />
            </View>

            <View style={styles.addressRow}>
              <TextInput
                label="Quốc gia"
                value={country}
                onChangeText={setCountry}
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                mode="outlined"
              />
              <TextInput
                label="Mã bưu điện"
                value={zipCode}
                onChangeText={setZipCode}
                style={[styles.input, { flex: 1 }]}
                mode="outlined"
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>
      </Dialog.ScrollArea>

      <Dialog.Actions>
        <Button onPress={onDismiss}>Hủy</Button>
        <Button mode="contained" onPress={handleSave}>
          Cập nhật
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  formContainer: {
    width: '100%',
  },
  inputRow: {
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
});

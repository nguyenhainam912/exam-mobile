import { StyleSheet, View } from 'react-native';
import { Button, Dialog, IconButton, Text } from 'react-native-paper';

interface DialogSupportProps {
  visible: boolean;
  onDismiss: () => void;
}

export function DialogSupport({ visible, onDismiss }: DialogSupportProps) {
  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={{ backgroundColor: 'white' }}
    >
      <Dialog.Icon icon="headset" size={40} color="#8B5CF6" />
      <Dialog.Title style={{ textAlign: 'center' }}>
        Liên hệ hỗ trợ
      </Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: 'bold' }}>Liên hệ với chúng tôi qua:</Text>
        </Text>

        <View style={styles.contactRow}>
          <IconButton
            icon="phone"
            size={20}
            iconColor="#8B5CF6"
            style={styles.contactIcon}
          />
          <View>
            <Text style={{ fontWeight: 'bold' }}>Hotline:</Text>
            <Text>0123 456 789 (8h-17h30)</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <IconButton
            icon="email"
            size={20}
            iconColor="#8B5CF6"
            style={styles.contactIcon}
          />
          <View>
            <Text style={{ fontWeight: 'bold' }}>Email hỗ trợ:</Text>
            <Text>support@examapp.com</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <IconButton
            icon="facebook"
            size={20}
            iconColor="#8B5CF6"
            style={styles.contactIcon}
          />
          <View>
            <Text style={{ fontWeight: 'bold' }}>Facebook:</Text>
            <Text>fb.com/examapp</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <IconButton
            icon="map-marker"
            size={20}
            iconColor="#8B5CF6"
            style={styles.contactIcon}
          />
          <View>
            <Text style={{ fontWeight: 'bold' }}>Địa chỉ:</Text>
            <Text>912 Vạn Phúc, Hà Nội</Text>
          </View>
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Đóng</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    margin: 0,
    marginRight: 8,
    backgroundColor: '#F3E8FF',
    height: 36,
    width: 36,
  },
});

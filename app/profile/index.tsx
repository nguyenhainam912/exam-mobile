import { CustomHeader } from '@@/components/Header/CustomHeader';
import { ProfileContent } from '@@/components/Profile/ProfileContent';
import { StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <CustomHeader
        showLogo={false}
        backgroundImage={require('../../assets/images/bg-home.jpg')}
        imageOpacity={0.7}
        titleColor="#ffffff"
        showNotification={false}
      />
      <ProfileContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
});

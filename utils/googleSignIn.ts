// Kiểm tra xem GoogleSignin có khả dụng không (native module)
let GoogleSignin: any = null;
let statusCodes: any = null;

try {
  const googleSigninModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSigninModule.GoogleSignin;
  statusCodes = googleSigninModule.statusCodes;
} catch (error) {
  console.warn(
    'Google Sign-In native module not available. This is expected in Expo Go.',
  );
}

// Cấu hình Google Sign-In
export const configureGoogleSignIn = () => {
  if (!GoogleSignin) {
    throw new Error(
      'Google Sign-In native module not available. Use development build.',
    );
  }

  GoogleSignin.configure({
    // Thay thế bằng Web Client ID thực của bạn từ Google Cloud Console
    webClientId:
      '627142212811-4h89op2inn12lnemnji81lcu3r2k83h2.apps.googleusercontent.com',
    // Thay thế bằng iOS Client ID của bạn (nếu có)
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    // Yêu cầu email và thông tin cơ bản (cần thiết cho xác thực)
    scopes: ['profile', 'email'],
    // Có yêu cầu quyền truy cập offline, cung cấp refresh token
    offlineAccess: true,
  });
};

interface GoogleSignInResult {
  success: boolean;
  userInfo?: any;
  idToken?: string;
  accessToken?: string;
  error?: string;
  errorCode?: string;
}

// Đăng nhập với Google
export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  if (!GoogleSignin) {
    return {
      success: false,
      error:
        'Google Sign-In native module not available. Use development build for full functionality.',
      errorCode: 'MODULE_NOT_AVAILABLE',
    };
  }

  try {
    // Kiểm tra Google Play Services
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // THÊM DÒNG NÀY: Sign out trước để bắt buộc chọn tài khoản
    try {
      await GoogleSignin.signOut();
    } catch (signOutError) {
      // Ignore sign out errors (có thể chưa đăng nhập)
      console.log('Sign out before sign in (expected if not signed in):', signOutError);
    }

    // Thực hiện đăng nhập và lấy thông tin người dùng
    const userInfo = await GoogleSignin.signIn();

    // Lấy token ID và access token
    const tokens = await GoogleSignin.getTokens();

    return {
      success: true,
      userInfo,
      idToken: tokens.idToken,
      accessToken: tokens.accessToken,
    };
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    return {
      success: false,
      error: errorMessage,
      errorCode: error.code,
    };
  }
};

// Kiểm tra trạng thái đăng nhập hiện tại
export const getCurrentGoogleUser = async (): Promise<any | null> => {
  if (!GoogleSignin) {
    console.warn('Google Sign-In native module not available');
    return null;
  }

  try {
    // Thử lấy thông tin người dùng hiện tại
    const userInfo = await GoogleSignin.getCurrentUser();
    return userInfo;
  } catch (error) {
    console.log('Error getting current Google user:', error);
    return null;
  }
};

// Đăng xuất khỏi Google
export const signOutFromGoogle = async (): Promise<boolean> => {
  if (!GoogleSignin) {
    console.warn('Google Sign-In native module not available');
    return false;
  }

  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    return true;
  } catch (error) {
    console.log('Error signing out from Google:', error);
    return false;
  }
};

// Hàm trợ giúp xử lý thông báo lỗi
const getErrorMessage = (error: any): string => {
  if (!statusCodes) {
    return (
      error?.message || 'Đăng nhập với Google thất bại. Vui lòng thử lại sau.'
    );
  }

  switch (error.code) {
    case statusCodes.SIGN_IN_CANCELLED:
      return 'Đăng nhập đã bị hủy';
    case statusCodes.IN_PROGRESS:
      return 'Đang xử lý đăng nhập';
    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
      return 'Google Play Services không khả dụng hoặc đã lỗi thời';
    default:
      return (
        error.message || 'Đăng nhập với Google thất bại. Vui lòng thử lại sau.'
      );
  }
};

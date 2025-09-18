import { Portal } from 'react-native-paper';
import { DialogEditProfile, UserFormData } from './Dialogs/DialogEditProfile';
import { DialogHelp } from './Dialogs/DialogHelp';
import { DialogLogout } from './Dialogs/DialogLogout';
import { DialogSupport } from './Dialogs/DialogSupport';
import { DialogTerms } from './Dialogs/DialogTerms';

interface ProfileDialogsProps {
  showLogoutDialog: boolean;
  showHelpDialog: boolean;
  showSupportDialog: boolean;
  showTermsDialog: boolean;
  showEditDialog: boolean;
  setShowLogoutDialog: (show: boolean) => void;
  setShowHelpDialog: (show: boolean) => void;
  setShowSupportDialog: (show: boolean) => void;
  setShowTermsDialog: (show: boolean) => void;
  setShowEditDialog: (show: boolean) => void;
  confirmLogout: () => void;
  userData: any;
  onSaveUserData: (data: UserFormData) => void;
}

export function ProfileDialogs({
  showLogoutDialog,
  showHelpDialog,
  showSupportDialog,
  showTermsDialog,
  showEditDialog,
  setShowLogoutDialog,
  setShowHelpDialog,
  setShowSupportDialog,
  setShowTermsDialog,
  setShowEditDialog,
  confirmLogout,
  userData,
  onSaveUserData,
}: ProfileDialogsProps) {
  return (
    <Portal>
      <DialogLogout
        visible={showLogoutDialog}
        onDismiss={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
      />

      <DialogHelp
        visible={showHelpDialog}
        onDismiss={() => setShowHelpDialog(false)}
      />

      <DialogSupport
        visible={showSupportDialog}
        onDismiss={() => setShowSupportDialog(false)}
      />

      <DialogTerms
        visible={showTermsDialog}
        onDismiss={() => setShowTermsDialog(false)}
      />

      <DialogEditProfile
        visible={showEditDialog}
        onDismiss={() => setShowEditDialog(false)}
        userData={userData}
        onSave={(data) => {
          onSaveUserData(data);
          setShowEditDialog(false);
        }}
      />
    </Portal>
  );
}

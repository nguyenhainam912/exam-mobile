import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  Button,
  Divider,
  List,
  Modal,
  Portal,
  Searchbar,
  Surface,
  Text,
} from 'react-native-paper';

interface SelectItem {
  _id: string;
  name: string;
  code?: string;
}

interface SelectionModalProps {
  visible: boolean;
  title: string;
  data: SelectItem[];
  selectedItem: SelectItem | null;
  searchQuery: string;
  onDismiss: () => void;
  onSearchChange: (query: string) => void;
  onSelectItem: (item: SelectItem) => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  visible,
  title,
  data,
  selectedItem,
  searchQuery,
  onDismiss,
  onSearchChange,
  onSelectItem,
}) => {
  const getFilteredData = () => {
    if (!searchQuery) return data;

    return data.filter(
      (item) =>
        item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item?.code &&
          item.code.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  };

  const filteredData = getFilteredData();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        dismissable={true}
        contentContainerStyle={styles.modalContainer}
      >
        <Surface style={styles.modalSurface} elevation={5}>
          <Text variant="headlineSmall" style={styles.modalTitle}>
            {title}
          </Text>

          <Divider />

          <Searchbar
            placeholder="Tìm kiếm..."
            onChangeText={onSearchChange}
            value={searchQuery}
            style={styles.searchBar}
          />

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item._id}
            style={styles.modalList}
            contentContainerStyle={{ paddingBottom: 24 }}
            extraData={selectedItem}
            renderItem={({ item }) => (
              <List.Item
                title={item.name}
                onPress={() => onSelectItem(item)}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={
                      selectedItem?._id === item._id
                        ? 'check-circle'
                        : 'circle-outline'
                    }
                  />
                )}
                style={selectedItem?._id === item._id && styles.selectedItem}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery ? 'Không tìm thấy kết quả' : 'Không có dữ liệu'}
                </Text>
              </View>
            )}
          />

          <Divider />

          <View style={styles.modalActions}>
            <Button onPress={onDismiss}>Đóng</Button>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalSurface: {
    width: '100%',
    maxWidth: 500,
    minHeight: 400,
    maxHeight: '80%',
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  modalTitle: {
    textAlign: 'center',
    padding: 16,
    fontWeight: 'bold',
  },
  searchBar: {
    margin: 16,
    marginTop: 8,
  },
  modalList: {
    flex: 1,
    minHeight: 200,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
  },
  selectedItem: {
    backgroundColor: '#EDE9FE',
  },
  modalActions: {
    padding: 16,
    alignItems: 'flex-end',
  },
});

export default SelectionModal;

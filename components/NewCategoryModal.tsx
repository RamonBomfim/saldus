import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  showCategoryModal: boolean;
  newCategory: {
    name: string;
    icon: string;
  };
  ioniconNames: string[];
  onChangeText: (text: string) => void;
  onValueChange: (itemValue: string) => void;
  onClose: () => void;
  addCategory: () => Promise<void>;
}

export default function NewCategoryModal({
  showCategoryModal,
  newCategory,
  ioniconNames,
  onChangeText,
  onValueChange,
  onClose,
  addCategory,
}: Props) {
  return (
    <Modal visible={showCategoryModal} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.label}>Nome da nova categoria</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Cartão de crédito"
            placeholderTextColor="#6C757D"
            value={newCategory.name}
            onChangeText={onChangeText}
          />

          <Text style={styles.label}>Ícone</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={newCategory.icon}
              onValueChange={onValueChange}
              style={styles.picker}
              dropdownIconColor="#ADB5BD"
            >
              {ioniconNames.map((iconName) => (
                <Picker.Item key={iconName} label={iconName} value={iconName} />
              ))}
            </Picker>
          </View>
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <Ionicons
              name={newCategory.icon as any}
              size={32}
              color="#F8F9FA"
            />
          </View>

          <Pressable style={styles.button} onPress={addCategory}>
            <Text style={styles.buttonText}>Salvar categoria</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: "#495057", marginTop: 10 },
            ]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 10,
    color: "#ADB5BD",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#343A40",
    borderWidth: 1,
    borderColor: "#495057",
    borderRadius: 5,
    padding: 12,
    marginTop: 5,
    color: "#F8F9FA",
  },
  pickerWrapper: {
    backgroundColor: "#343A40",
    borderWidth: 1,
    borderColor: "#495057",
    borderRadius: 5,
    marginTop: 5,
  },
  picker: {
    color: "#F8F9FA",
  },
  button: {
    backgroundColor: "#6C757D",
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#F8F9FA",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#212529",
    padding: 20,
    borderRadius: 10,
  },
});

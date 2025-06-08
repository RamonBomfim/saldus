import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  Platform,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";

import { auth, db } from "../../firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import NewCategoryModal from "@/components/NewCategoryModal";

const ioniconNames = [
  "home",
  "wallet",
  "card",
  "cart",
  "cash",
  "car",
  "restaurant",
  "fast-food",
  "airplane",
  "bicycle",
  "gift",
  "school",
  "shirt",
  "phone-portrait",
  "game-controller",
  "medical",
  "briefcase",
  "heart",
  "book",
  "fitness",
  "paw",
  "pizza",
  "trending-up",
  "trending-down",
];

export default function AddTrasactions() {
  const AddTransactionSchema = Yup.object().shape({
    type: Yup.string().required("Selecione um tipo"),
    name: Yup.string().required("Nome é obrigatório"),
    date: Yup.date().required("Data é obrigatória"),
    category: Yup.string().required("Categoria é obrigatória"),
    amount: Yup.string()
      .required("Valor é obrigatório")
      .test("is-valid", "Digite um valor maior que zero", (value) => {
        const numericValue = parseFloat(value.replace(/[^\d]/g, "")) / 100;
        return numericValue > 0;
      }),
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "list" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCategories(list);
  };

  const addCategory = async () => {
    if (!newCategory.name.trim()) {
      Alert.alert("Erro", "O nome da categoria é obrigatório");
      return;
    }

    try {
      await addDoc(collection(db, "categories"), newCategory);
      setNewCategory({ name: "", icon: "list" });
      setShowCategoryModal(false);
      loadCategories();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar a categoria");
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const amount = (parseFloat(numericValue) / 100).toFixed(2);
    return `R$ ${amount
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          type: "",
          name: "",
          date: new Date(),
          category: "",
          amount: "",
        }}
        validationSchema={AddTransactionSchema}
        onSubmit={async (values, { resetForm }) => {
          if (isSubmitting) return;

          setIsSubmitting(true);

          const numericAmount =
            parseFloat(values.amount.replace(/[^\d]/g, "")) / 100;

          const transaction = {
            type: values.type,
            name: values.name,
            date: values.date,
            category: values.category,
            value: numericAmount,
          };

          try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error("Usuário não autenticado");

            await addDoc(
              collection(db, "users", userId, "transactions"),
              transaction
            );

            Alert.alert("Sucesso", "Transação adicionada!");
            resetForm();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            Alert.alert("Erro", "Erro ao adicionar transação: " + errorMessage);
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={values.type}
                onValueChange={(itemValue) => setFieldValue("type", itemValue)}
                style={styles.picker}
                dropdownIconColor="#ADB5BD"
              >
                <Picker.Item label="Selecione..." value="" />
                <Picker.Item label="Entrada" value="entrada" />
                <Picker.Item label="Saída" value="saida" />
              </Picker>
            </View>
            {touched.type && errors.type && (
              <Text style={styles.error}>{errors.type}</Text>
            )}

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome"
              placeholderTextColor="#6C757D"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}

            <Text style={styles.label}>Data</Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              <Text style={{ color: values.date ? "#F8F9FA" : "#6C757D" }}>
                {values.date
                  ? format(values.date, "dd/MM/yyyy", { locale: ptBR })
                  : "Selecione a data"}
              </Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={values.date || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFieldValue("date", selectedDate);
                  }
                }}
              />
            )}
            {touched.date && typeof errors.date === "string" && (
              <Text style={styles.error}>{errors.date}</Text>
            )}

            <Text style={styles.label}>Categoria</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={[styles.pickerWrapper, { flex: 1 }]}>
                <Picker
                  selectedValue={values.category}
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                  style={styles.picker}
                  dropdownIconColor="#ADB5BD"
                >
                  <Picker.Item label="Selecione..." value="" />
                  {categories.map((cat) => (
                    <Picker.Item
                      key={cat.id}
                      label={cat.name}
                      value={cat.name}
                    />
                  ))}
                </Picker>
              </View>
              <Pressable
                onPress={() => setShowCategoryModal(true)}
                style={{ marginLeft: 8 }}
              >
                <Ionicons name="add-circle-outline" size={28} color="#F8F9FA" />
              </Pressable>
            </View>
            {touched.category && errors.category && (
              <Text style={styles.error}>{errors.category}</Text>
            )}

            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="R$ 0,00"
              placeholderTextColor="#6C757D"
              onChangeText={(text) => {
                const formatted = formatCurrency(text);
                setFieldValue("amount", formatted);
              }}
              onBlur={handleBlur("amount")}
              value={values.amount}
            />
            {touched.amount && errors.amount && (
              <Text style={styles.error}>{errors.amount}</Text>
            )}

            <Pressable
              onPress={handleSubmit as any}
              style={[styles.button, isSubmitting && { opacity: 0.6 }]}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Text>
            </Pressable>
          </View>
        )}
      </Formik>

      <NewCategoryModal
        addCategory={addCategory}
        ioniconNames={ioniconNames}
        newCategory={newCategory}
        onChangeText={(text) =>
          setNewCategory((prev) => ({ ...prev, name: text }))
        }
        onClose={() => setShowCategoryModal(false)}
        onValueChange={(itemValue) =>
          setNewCategory((prev) => ({ ...prev, icon: itemValue }))
        }
        showCategoryModal={showCategoryModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#212529",
    flex: 1,
  },
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
  error: {
    color: "#FF6B6B",
    marginTop: 5,
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

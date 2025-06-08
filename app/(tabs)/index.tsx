import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { auth, db } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { Formik } from "formik";
import * as Yup from "yup";
import { useFocusEffect } from "expo-router";

type Transaction = {
  id: string;
  name: string;
  value: number;
  category: string;
  date: string;
  type: string;
};

const BalanceSchema = Yup.object().shape({
  balance: Yup.string()
    .required("Saldo é obrigatório")
    .test("is-valid", "Digite um valor maior que zero", (value) => {
      const numericValue = parseFloat(value.replace(/[^\d]/g, "")) / 100;
      return numericValue > 0;
    }),
});

export default function Home() {
  const [showBalance, setShowBalance] = useState(true);
  const [user, setUser] = useState<any>({
    email: "",
    name: "",
    balance: 0,
  });
  const [latestTransactions, setLatestTransactions] = useState<any[]>([]);

  const handleSetBalance = async ({ balance }: { balance: string }) => {
    const sanitized = balance.replace("R$", "").trim();
    const normalized = sanitized.replace(/\./g, "").replace(",", ".");
    const numberValue = parseFloat(normalized);

    try {
      if (!auth.currentUser) {
        throw new Error("Usuário não autenticado.");
      }

      updateDoc(doc(db, "users", auth.currentUser.uid), {
        balance: numberValue,
      }).then((dados) =>
        setUser((prev: any) => ({ ...prev, balance: numberValue }))
      );

      Alert.alert("Sucesso", "Saldo atualizado!");
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível completar a operação. Motivo: " + error
      );
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const amount = (parseFloat(numericValue) / 100).toFixed(2);
    return `R$ ${amount
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const fetchLatestTransactions = async () => {
    try {
      if (!auth.currentUser) return;

      const uid = auth.currentUser.uid;

      const transactionsRef = collection(db, "users", uid, "transactions");
      const q = query(transactionsRef, orderBy("date", "desc"), limit(5));
      const snapshot = await getDocs(q);

      const transactionsData: Transaction[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, "id">),
      }));

      const categoriesRef = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesRef);

      const categoriesMap: Record<string, string> = {};
      categoriesSnapshot.forEach((doc) => {
        const data = doc.data();
        categoriesMap[data.name] = data.icon;
      });

      const enrichedTransactions = transactionsData.map((tx) => ({
        ...tx,
        icon: categoriesMap[tx.category] || "help-circle",
      }));

      setLatestTransactions(enrichedTransactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        getDoc(doc(db, "users", auth.currentUser.uid)).then((dados) =>
          setUser(dados.data())
        );

        fetchLatestTransactions();
      }
    }, [])
  );

  const toggleBalance = () => setShowBalance(!showBalance);

  return (
    <View style={styles.container}>
      {user.balance ? (
        <>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.greeting}>Olá, {user.name}</Text>
              <TouchableOpacity onPress={toggleBalance}>
                <Ionicons
                  name={showBalance ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#DEE2E6"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.date}>
              {format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </Text>
            <Text style={styles.balanceLabel}>Saldo disponível</Text>
            <Text style={styles.balance}>
              {showBalance ? `R$ ${user.balance.toFixed(2)}` : "•••••••••"}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Últimas transações</Text>
            <FlatList
              data={latestTransactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                  <Ionicons
                    name={
                      `${item.icon}-outline` as keyof typeof Ionicons.glyphMap
                    }
                    size={24}
                    color="#DEE2E6"
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.transactionName}>{item.name}</Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: item.value < 0 ? "#f94144" : "#90be6d" },
                    ]}
                  >
                    {item.value < 0 ? "- " : "+ "}R${" "}
                    {Math.abs(item.value).toFixed(2)}
                  </Text>
                </View>
              )}
            />
          </View>
        </>
      ) : (
        <Formik
          initialValues={{
            balance: "",
          }}
          validationSchema={BalanceSchema}
          onSubmit={(values, { resetForm }) => {
            handleSetBalance({ balance: values.balance });
            resetForm();
          }}
        >
          {({
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <Text style={styles.welcome}>
                Seja bem-vindo ao{" "}
                <Text style={{ color: "#F8F9FA" }}>Meu Saldus</Text>,{" "}
                {user.name}!{"\n\n"}
                Antes de prosseguir, nos informe seu saldo atual, por favor.
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="R$ 0,00"
                placeholderTextColor="#6C757D"
                onChangeText={(text) => {
                  const formatted = formatCurrency(text);
                  setFieldValue("balance", formatted);
                }}
                onBlur={handleBlur("balance")}
                value={values.balance}
              />
              {touched.balance && errors.balance && (
                <Text style={styles.error}>{errors.balance}</Text>
              )}

              <Pressable onPress={handleSubmit as any} style={styles.button}>
                <Text style={styles.buttonText}>Salvar saldo</Text>
              </Pressable>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  card: {
    backgroundColor: "#343A40",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
  },
  greeting: {
    color: "#F8F9FA",
    fontSize: 20,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: "#ADB5BD",
    marginTop: 4,
  },
  balanceLabel: {
    color: "#CED4DA",
    marginTop: 16,
  },
  balance: {
    color: "#F8F9FA",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 4,
  },
  sectionTitle: {
    color: "#F8F9FA",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  transactionName: {
    color: "#F8F9FA",
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
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
    width: "100%",
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
    width: "100%",
  },
  buttonText: {
    color: "#F8F9FA",
    fontWeight: "bold",
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#212529",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    width: "100%",
  },
  welcome: {
    color: "#ADB5BD",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 26,
  },
});

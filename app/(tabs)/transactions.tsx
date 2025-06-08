import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { format, subMonths, addMonths, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import {
  getDocs,
  collection,
} from "firebase/firestore";

type Transaction = {
  id: string;
  name: string;
  value: number;
  category: string;
  date: string;
  type: string;
};

const screenWidth = Dimensions.get("window").width;

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color =
    "#" +
    ((hash >> 24) & 0xff).toString(16).padStart(2, "0") +
    ((hash >> 16) & 0xff).toString(16).padStart(2, "0") +
    ((hash >> 8) & 0xff).toString(16).padStart(2, "0");

  return color.length === 7
    ? color
    : "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
}

export default function Transactions() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const pieData = (() => {
    const grouped: Record<string, number> = {};

    filteredTransactions
      .filter((t) => t.type === "saida")
      .forEach((t) => {
        grouped[t.category] = (grouped[t.category] || 0) + Number(t.value);
      });

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5);
    const othersTotal = others.reduce((sum, [, value]) => sum + value, 0);

    const finalData = [...top5];
    if (othersTotal > 0) {
      finalData.push(["Outros", othersTotal]);
    }

    return finalData.map(([name, value]) => ({
      name,
      population: value,
      color: stringToColor(name),
      legendFontColor: "#F8F9FA",
      legendFontSize: 12,
    }));
  })();

  const fetchTransactions = async () => {
    try {
      if (!auth.currentUser) return;

      const uid = auth.currentUser.uid;

      const transactionsRef = collection(db, "users", uid, "transactions");
      const snapshot = await getDocs(transactionsRef);

      const transactionsData: Transaction[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, "id">),
        date: doc.data().date.toDate(),
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

      setTransactions(enrichedTransactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  useEffect(() => {
    const filtered = transactions.filter((transaction) =>
      isSameMonth(transaction.date, selectedDate)
    );
    setFilteredTransactions(filtered);
  }, [selectedDate, transactions]);

  const handlePreviousMonth = () => {
    setSelectedDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    const next = addMonths(selectedDate, 1);
    if (next > new Date()) return;
    setSelectedDate(next);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListHeaderComponent={
          <>
            <View style={styles.monthSelector}>
              <TouchableOpacity onPress={handlePreviousMonth}>
                <Text style={styles.arrow}>{"<"}</Text>
              </TouchableOpacity>

              <Text style={styles.month}>
                {format(selectedDate, "MMMM yyyy", {
                  locale: ptBR,
                }).toUpperCase()}
              </Text>

              <TouchableOpacity
                onPress={handleNextMonth}
                disabled={isSameMonth(selectedDate, new Date())}
              >
                <Text
                  style={[
                    styles.arrow,
                    isSameMonth(selectedDate, new Date()) && { opacity: 0.3 },
                  ]}
                >
                  {">"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              {filteredTransactions.length === 0 ? (
                <Text style={styles.empty}>Nenhuma transação neste mês</Text>
              ) : (
                filteredTransactions.map((item) => (
                  <View key={item.id} style={styles.transactionItem}>
                    <Ionicons
                      name={
                        `${item.icon}-outline` as keyof typeof Ionicons.glyphMap
                      }
                      size={24}
                      color="#DEE2E6"
                    />
                    <Text style={styles.transactionName}>{item.name}</Text>
                    <Text
                      style={[
                        styles.transactionAmount,
                        {
                          color:
                            item.type === "entrada" ? "#4CAF50" : "#E53935",
                        },
                      ]}
                    >
                      {item.type === "entrada" ? "+" : "-"} R$ {item.value}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => router.push("./report")}
                style={styles.chartHeader}
              >
                <View>
                  <Text style={styles.chartTitle}>
                    Gastos de {format(selectedDate, "MMMM", { locale: ptBR })}
                  </Text>

                  <Text style={styles.chartSubtitle}>
                    Total: R${" "}
                    {pieData.reduce(
                      (sum: number, item: any) => sum + item.population,
                      0
                    )}
                  </Text>
                </View>

                <Text style={styles.chartArrow}>{">"}</Text>
              </TouchableOpacity>

              <PieChart
                data={pieData}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  backgroundColor: "#343A40",
                  backgroundGradientFrom: "#343A40",
                  backgroundGradientTo: "#343A40",
                  color: (opacity = 1) => `rgba(248, 249, 250, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
              />
            </View>
          </>
        }
        renderItem={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  arrow: {
    color: "#F8F9FA",
    fontSize: 24,
    fontWeight: "bold",
  },
  month: {
    color: "#F8F9FA",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#343A40",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 300,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  empty: {
    color: "#CED4DA",
    textAlign: "center",
    marginVertical: 12,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chartTitle: {
    color: "#F8F9FA",
    fontSize: 18,
    fontWeight: "bold",
  },
  chartSubtitle: {
    color: "#F8F9FA",
    marginTop: 4,
    fontSize: 16,
  },
  chartArrow: {
    color: "#F8F9FA",
    fontSize: 24,
    fontWeight: "bold",
  },
});

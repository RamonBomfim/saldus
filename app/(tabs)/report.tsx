import { useCallback, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { auth, db } from "../../firebaseConfig";
import {
  getDocs,
  collection,
} from "firebase/firestore";
import { useFocusEffect } from "expo-router";

type Transaction = {
  id: string;
  name: string;
  value: number;
  category: string;
  date: string;
  type: string;
};

const screenWidth = Dimensions.get("window").width;

export default function Report() {
  const [topCategories, setTopCategories] = useState<[string, number][]>([]);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0]);

  const fetchTransactions = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const snapshot = await getDocs(
        collection(db, "users", uid, "transactions")
      );
      const transactions: Transaction[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, "id">),
        date: doc.data().date.toDate(),
      }));

      const expenses = transactions.filter((t) => t.type === "saida");

      const categoryTotals: Record<string, number> = {};
      expenses.forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.value;
      });

      const top = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      setTopCategories(top);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const weekRanges = [0, 0, 0, 0];

      expenses.forEach((t) => {
        const date = new Date(t.date);
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          const day = date.getDate();
          const weekIndex = Math.floor((day - 1) / 7);
          weekRanges[weekIndex] += t.value;
        }
      });

      setWeeklyData(weekRanges);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions()
    }, [])
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#212529" }}>
      <View
        style={{
          backgroundColor: "#343A40",
          margin: 16,
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: "#F8F9FA",
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          Top 3 Categorias
        </Text>
        {topCategories.map(([category, total], index) => (
          <Text key={index} style={{ color: "#F8F9FA" }}>
            {index + 1}. {category} - R$ {total.toFixed(2)}
          </Text>
        ))}
        {topCategories.length === 0 && (
          <Text style={{ color: "#CED4DA" }}>Nenhuma despesa encontrada</Text>
        )}
      </View>

      <View
        style={{
          backgroundColor: "#343A40",
          margin: 16,
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: "#F8F9FA",
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          Gastos Semanais
        </Text>

        <BarChart
          data={{
            labels: ["1-7", "8-14", "15-21", "22-28"],
            datasets: [
              {
                data: weeklyData,
              },
            ],
          }}
          width={screenWidth - 64}
          height={250}
          yAxisLabel="R$ "
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#343A40",
            backgroundGradientFrom: "#343A40",
            backgroundGradientTo: "#343A40",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(248, 249, 250, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(248, 249, 250, ${opacity})`,
            style: {
              borderRadius: 12,
            },
            propsForBackgroundLines: {
              stroke: "#495057",
            },
            propsForLabels: {
              fontSize: 12,
            },
          }}
          verticalLabelRotation={0}
          fromZero
        />
      </View>
    </ScrollView>
  );
}

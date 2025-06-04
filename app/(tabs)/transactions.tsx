import { View, Text, TouchableOpacity, Dimensions, StyleSheet, FlatList } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { format, subMonths, addMonths, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const mockTransactions = [
  { id: '1', name: 'Salário', type: 'entrada', amount: 3000, date: new Date(2025, 5, 2), icon: 'cash' },
  { id: '2', name: 'Aluguel', type: 'saída', amount: 1200, date: new Date(2025, 5, 5), icon: 'home' },
  { id: '3', name: 'Mercado', type: 'saída', amount: 500, date: new Date(2025, 4, 25), icon: 'storefront' },
  { id: '4', name: 'Freelance', type: 'entrada', amount: 1500, date: new Date(2025, 4, 10), icon: 'code-working' },
  { id: '5', name: 'Academia', type: 'saída', amount: 100, date: new Date(2025, 5, 10), icon: 'barbell' },
];

export default function Transactions() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

  const pieData = [
    { name: 'Alimentação', population: 500, color: '#ADB5BD', legendFontColor: '#F8F9FA', legendFontSize: 12 },
    { name: 'Transporte', population: 200, color: '#6C757D', legendFontColor: '#F8F9FA', legendFontSize: 12 },
    { name: 'Lazer', population: 150, color: '#495057', legendFontColor: '#F8F9FA', legendFontSize: 12 },
    { name: 'Saúde', population: 100, color: '#343A40', legendFontColor: '#F8F9FA', legendFontSize: 12 },
  ];

  useEffect(() => {
    const filtered = mockTransactions.filter((transaction) =>
      isSameMonth(transaction.date, selectedDate)
    );
    setFilteredTransactions(filtered);
  }, [selectedDate]);

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
                <Text style={styles.arrow}>{'<'}</Text>
              </TouchableOpacity>

              <Text style={styles.month}>
                {format(selectedDate, 'MMMM yyyy', { locale: ptBR }).toUpperCase()}
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
                  {'>'}
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
                      name={`${item.icon}-outline` as keyof typeof Ionicons.glyphMap}
                      size={24}
                      color="#DEE2E6"
                    />
                    <Text style={styles.transactionName}>{item.name}</Text>
                    <Text
                      style={[
                        styles.transactionAmount,
                        {
                          color: item.type === 'entrada' ? '#4CAF50' : '#E53935',
                        },
                      ]}
                    >
                      {item.type === 'entrada' ? '+' : '-'} R$ {item.amount}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => router.push('./report')}
                style={styles.chartHeader}
              >
                <View>
                  <Text style={styles.chartTitle}>
                    Gastos de {format(selectedDate, 'MMMM', { locale: ptBR })}
                  </Text>
                  <Text style={styles.chartSubtitle}>
                    Total: R$ 950
                  </Text>
                </View>

                <Text style={styles.chartArrow}>{'>'}</Text>
              </TouchableOpacity>

              <PieChart
                data={pieData}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  backgroundColor: '#343A40',
                  backgroundGradientFrom: '#343A40',
                  backgroundGradientTo: '#343A40',
                  color: (opacity = 1) => `rgba(248, 249, 250, ${opacity})`,
                }}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
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
    backgroundColor: '#212529',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrow: {
    color: '#F8F9FA',
    fontSize: 24,
    fontWeight: 'bold',
  },
  month: {
    color: '#F8F9FA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#343A40',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 300,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  transactionName: {
    color: '#F8F9FA',
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    color: '#CED4DA',
    textAlign: 'center',
    marginVertical: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    color: '#F8F9FA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartSubtitle: {
    color: '#F8F9FA',
    marginTop: 4,
    fontSize: 16,
  },
  chartArrow: {
    color: '#F8F9FA',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

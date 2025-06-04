import { View, Text, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function Report() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#212529' }}>
      {/* Card Top 3 Categorias */}
      <View
        style={{
          backgroundColor: '#343A40',
          margin: 16,
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: '#F8F9FA', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          Top 3 Categorias
        </Text>
        <Text style={{ color: '#F8F9FA' }}>1. Alimentação - R$ 500</Text>
        <Text style={{ color: '#F8F9FA' }}>2. Transporte - R$ 200</Text>
        <Text style={{ color: '#F8F9FA' }}>3. Lazer - R$ 150</Text>
      </View>

      {/* Card Gráfico de Barras */}
      <View
        style={{
          backgroundColor: '#343A40',
          margin: 16,
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: '#F8F9FA', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          Gastos Semanais
        </Text>

        <BarChart
          data={{
            labels: ['1-7', '8-14', '15-21', '22-28'],
            datasets: [
              {
                data: [200, 450, 300, 500],
              },
            ],
          }}
          width={screenWidth - 64}
          height={250}
          yAxisLabel="R$ "
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#343A40',
            backgroundGradientFrom: '#343A40',
            backgroundGradientTo: '#343A40',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(248, 249, 250, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(248, 249, 250, ${opacity})`,
            style: {
              borderRadius: 12,
            },
            propsForBackgroundLines: {
              stroke: '#495057',
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

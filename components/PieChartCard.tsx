import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = [
  {
    name: 'Alimentação',
    population: 500,
    color: '#ADB5BD',
    legendFontColor: '#F8F9FA',
    legendFontSize: 12,
  },
  {
    name: 'Transporte',
    population: 200,
    color: '#6C757D',
    legendFontColor: '#F8F9FA',
    legendFontSize: 12,
  },
  {
    name: 'Lazer',
    population: 150,
    color: '#495057',
    legendFontColor: '#F8F9FA',
    legendFontSize: 12,
  },
  {
    name: 'Saúde',
    population: 100,
    color: '#343A40',
    legendFontColor: '#F8F9FA',
    legendFontSize: 12,
  },
];

export default function PieChartCard() {
  return (
    <View
      style={{
        backgroundColor: '#212529',
        margin: 16,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          color: '#F8F9FA',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 12,
        }}
      >
        Gastos de Junho
      </Text>
      <PieChart
        data={data}
        width={screenWidth - 64}
        height={220}
        chartConfig={{
          backgroundColor: '#212529',
          backgroundGradientFrom: '#212529',
          backgroundGradientTo: '#212529',
          color: (opacity = 1) => `rgba(248, 249, 250, ${opacity})`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />
      <Text
        style={{
          color: '#F8F9FA',
          textAlign: 'center',
          marginTop: 8,
          fontSize: 16,
        }}
      >
        Total: R$ 950
      </Text>
    </View>
  );
}

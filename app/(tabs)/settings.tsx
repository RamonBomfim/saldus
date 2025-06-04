import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      setBiometricEnabled(enabled === 'true');
    })();
  }, []);

  const toggleBiometric = async (value: boolean) => {
    setBiometricEnabled(value);
    await AsyncStorage.setItem('biometricEnabled', value ? 'true' : 'false');
    Alert.alert(
      'Configurações',
      value ? 'Biometria ativada com sucesso!' : 'Biometria desativada.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Desbloqueio por biometria</Text>
        <Switch
          value={biometricEnabled}
          onValueChange={toggleBiometric}
          thumbColor={biometricEnabled ? '#6C757D' : '#ADB5BD'}
          trackColor={{ true: '#6C757D', false: '#495057' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    padding: 20,
  },
  title: {
    color: '#F8F9FA',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  optionContainer: {
    backgroundColor: '#343A40',
    borderColor: '#495057',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    color: '#F8F9FA',
    fontSize: 16,
  },
});

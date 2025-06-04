import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  useEffect(() => {
    (async () => {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      if (enabled === 'true') {
        setBiometricEnabled(true);
        setShowBiometricModal(true);
      }
    })();
  }, []);

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        'Biometria não disponível',
        'Configure a biometria no dispositivo'
      );
      setShowBiometricModal(false);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Desbloqueie com biometria',
      cancelLabel: 'Cancelar',
    });

    if (result.success) {
      setShowBiometricModal(false);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Falha na autenticação');
    }
  };

  useEffect(() => {
    if (showBiometricModal) {
      handleBiometricAuth();
    }
  }, [showBiometricModal]);

  const toggleBiometric = async (value: boolean) => {
    setBiometricEnabled(value);
    await AsyncStorage.setItem('biometricEnabled', value ? 'true' : 'false');
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required('O email é obrigatório'),
    password: Yup.string()
      .min(6, 'Mínimo de 6 caracteres')
      .required('A senha é obrigatória'),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    const { email, password } = values;

    await signInWithEmailAndPassword(auth, email, password)
      .then(user => router.replace('/(tabs)'))
      .catch(error => Alert.alert('Erro', 'Login ou senha incorreta!'))
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo-transparent.png')} style={styles.logo} />

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#CED4DA"
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && touched.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              placeholder="Senha"
              placeholderTextColor="#CED4DA"
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit as any}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.biometricContainer}>
              <Text style={styles.signupText}>Usar biometria no próximo acesso</Text>
              <Switch
                value={biometricEnabled}
                onValueChange={toggleBiometric}
                thumbColor={biometricEnabled ? '#6C757D' : '#ADB5BD'}
                trackColor={{ true: '#6C757D', false: '#495057' }}
              />
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Não tem conta?</Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.signupButton}> Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>

      <Modal
        transparent
        animationType="fade"
        visible={showBiometricModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>🔒 Desbloqueie com biometria</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleBiometricAuth}
            >
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#343A40',
    borderColor: '#495057',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#F8F9FA',
    marginBottom: 10,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#6C757D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#F8F9FA',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#ADB5BD',
  },
  signupButton: {
    color: '#F8F9FA',
    fontWeight: 'bold',
  },
  biometricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#343A40',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#495057',
    alignItems: 'center',
  },
  modalText: {
    color: '#F8F9FA',
    fontSize: 18,
    marginBottom: 15,
  },
});

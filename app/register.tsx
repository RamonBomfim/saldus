import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function Register() {
  const router = useRouter();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Nome muito curto')
      .required('O nome é obrigatório'),
    email: Yup.string()
      .email('Email inválido')
      .required('O email é obrigatório'),
    password: Yup.string()
      .min(6, 'Mínimo de 6 caracteres')
      .required('A senha é obrigatória'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'As senhas não coincidem')
      .required('Confirme sua senha'),
  });

  const handleRegister = (values: { name: string; email: string; password: string; confirmPassword: string }) => {
    console.log(values);
    Alert.alert('Cadastro realizado', `Bem-vindo, ${values.name}`);
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo-transparent.png')} style={styles.logo} />

      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              placeholder="Nome"
              placeholderTextColor="#CED4DA"
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {errors.name && touched.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}

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

            <TextInput
              placeholder="Confirmar Senha"
              placeholderTextColor="#CED4DA"
              style={styles.input}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              secureTextEntry
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit as any}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Já tem conta?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.signupButton}> Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212529',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 10,
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
});

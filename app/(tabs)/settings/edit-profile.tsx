import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Informe seu nome'),
  balance: Yup.string()
    .required('Informe seu saldo')
    .matches(/^\d+([,]\d{1,2})?$/, 'Informe um valor válido, ex: 1000,00'),
});

export default function EditProfile() {
  const initialValues = { name: '', balance: '' };
  const router = useRouter()

  const loadUserData = async (setValues: (values: typeof initialValues) => void) => {
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const data = userDoc.data();
      if (data) {
        setValues({
          name: data.name || '',
          balance: data.balance?.toString().replace('.', ',') || '',
        });
      }
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!auth.currentUser) return;

    const sanitizedBalance = values.balance.replace(/\./g, '').replace(',', '.');
    const parsedBalance = parseFloat(sanitizedBalance);

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: values.name,
        balance: parsedBalance,
      });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.push('/')
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar seu perfil.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setValues }) => {
          useEffect(() => {
            loadUserData(setValues);
          }, []);

          return (
            <>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor="#6C757D"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {touched.name && errors.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}

              <Text style={styles.label}>Saldo</Text>
              <TextInput
                style={styles.input}
                placeholder="R$ 0,00"
                placeholderTextColor="#6C757D"
                keyboardType="numeric"
                onChangeText={handleChange('balance')}
                onBlur={handleBlur('balance')}
                value={values.balance}
              />
              {touched.balance && errors.balance && (
                <Text style={styles.error}>{errors.balance}</Text>
              )}

              <Pressable style={styles.button} onPress={() => handleSubmit()}>
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
            </>
          );
        }}
      </Formik>
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
  label: {
    color: '#ADB5BD',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#343A40',
    borderColor: '#495057',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: '#F8F9FA',
  },
  error: {
    color: '#FF6B6B',
    marginTop: 4,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#6C757D',
    padding: 16,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F8F9FA',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

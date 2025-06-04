import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    Pressable,
    Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AddTrasactions() {
    const AddTransactionSchema = Yup.object().shape({
        type: Yup.string().required('Selecione um tipo'),
        name: Yup.string().required('Nome é obrigatório'),
        date: Yup.date().required('Data é obrigatória'),
        category: Yup.string().required('Categoria é obrigatória'),
        amount: Yup.string()
            .required('Valor é obrigatório')
            .test('is-valid', 'Digite um valor maior que zero', (value) => {
                const numericValue = parseFloat(value.replace(/[^\d]/g, '')) / 100;
                return numericValue > 0;
            }),
    });

    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        const amount = (parseFloat(numericValue) / 100).toFixed(2);
        return `R$ ${amount.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    return (
        <Formik
            initialValues={{
                type: '',
                name: '',
                date: new Date(),
                category: '',
                amount: '',
            }}
            validationSchema={AddTransactionSchema}
            onSubmit={(values, { resetForm }) => {
                const numericAmount =
                    parseFloat(values.amount.replace(/[^\d]/g, '')) / 100;

                const formatted = {
                    ...values,
                    amount: numericAmount.toFixed(2),
                    date: format(values.date, 'dd/MM/yyyy'),
                };

                Alert.alert('Transação cadastrada!', JSON.stringify(formatted, null, 2));
                resetForm();
            }}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched,
            }) => (
                <View style={styles.container}>
                    <Text style={styles.label}>Tipo</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={values.type}
                            onValueChange={(itemValue) => setFieldValue('type', itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#ADB5BD"
                        >
                            <Picker.Item label="Selecione..." value="" />
                            <Picker.Item label="Entrada" value="entrada" />
                            <Picker.Item label="Saída" value="saida" />
                        </Picker>
                    </View>
                    {touched.type && errors.type && (
                        <Text style={styles.error}>{errors.type}</Text>
                    )}

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o nome"
                        placeholderTextColor="#6C757D"
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                    />
                    {touched.name && errors.name && (
                        <Text style={styles.error}>{errors.name}</Text>
                    )}

                    <Text style={styles.label}>Data</Text>
                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        style={styles.input}
                    >
                        <Text style={{ color: values.date ? '#F8F9FA' : '#6C757D' }}>
                            {values.date
                                ? format(values.date, 'dd/MM/yyyy', { locale: ptBR })
                                : 'Selecione a data'}
                        </Text>
                    </Pressable>
                    {showDatePicker && (
                        <DateTimePicker
                            value={values.date || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setFieldValue('date', selectedDate);
                                }
                            }}
                        />
                    )}
                    {touched.date && typeof errors.date === 'string' && (
                        <Text style={styles.error}>{errors.date}</Text>
                    )}

                    <Text style={styles.label}>Categoria</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={values.category}
                            onValueChange={(itemValue) =>
                                setFieldValue('category', itemValue)
                            }
                            style={styles.picker}
                            dropdownIconColor="#ADB5BD"
                        >
                            <Picker.Item label="Selecione..." value="" />
                            <Picker.Item label="Alimentação" value="alimentacao" />
                            <Picker.Item label="Transporte" value="transporte" />
                            <Picker.Item label="Saúde" value="saude" />
                            <Picker.Item label="Moradia" value="moradia" />
                            <Picker.Item label="Lazer" value="lazer" />
                            <Picker.Item label="Educação" value="educacao" />
                            <Picker.Item label="Salário" value="salario" />
                            <Picker.Item label="Investimento" value="investimento" />
                        </Picker>
                    </View>
                    {touched.category && errors.category && (
                        <Text style={styles.error}>{errors.category}</Text>
                    )}


                    <Text style={styles.label}>Valor</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="R$ 0,00"
                        placeholderTextColor="#6C757D"
                        onChangeText={(text) => {
                            const formatted = formatCurrency(text);
                            setFieldValue('amount', formatted);
                        }}
                        onBlur={handleBlur('amount')}
                        value={values.amount}
                    />
                    {touched.amount && errors.amount && (
                        <Text style={styles.error}>{errors.amount}</Text>
                    )}

                    <Pressable onPress={handleSubmit as any} style={styles.button}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </Pressable>
                </View>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#212529',
        flex: 1,
    },
    label: {
        marginTop: 10,
        color: '#ADB5BD',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#343A40',
        borderWidth: 1,
        borderColor: '#495057',
        borderRadius: 5,
        padding: 12,
        marginTop: 5,
        color: '#F8F9FA',
    },
    pickerWrapper: {
        backgroundColor: '#343A40',
        borderWidth: 1,
        borderColor: '#495057',
        borderRadius: 5,
        marginTop: 5,
    },
    picker: {
        color: '#F8F9FA',
    },
    error: {
        color: '#FF6B6B',
        marginTop: 5,
    },
    button: {
        backgroundColor: '#6C757D',
        borderRadius: 5,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#F8F9FA',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
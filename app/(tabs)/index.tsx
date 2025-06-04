import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { transactions } from '../../data-mock';

const userName = 'John Doe';
const balance = 1500.75;

export default function Home() {
    const [showBalance, setShowBalance] = useState(true);

    const toggleBalance = () => setShowBalance(!showBalance);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Olá, {userName}</Text>
                    <TouchableOpacity onPress={toggleBalance}>
                        <Ionicons
                            name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                            size={24}
                            color="#DEE2E6"
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.date}>
                    {moment().locale('pt-br').format('LL')}
                </Text>
                <Text style={styles.balanceLabel}>Saldo disponível</Text>
                <Text style={styles.balance}>
                    {showBalance ? `R$ ${balance.toFixed(2)}` : '•••••••••'}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Últimas transações</Text>
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.transactionItem}>
                            <Ionicons
                                name={`${item.icon}-outline` as keyof typeof Ionicons.glyphMap}
                                size={24}
                                color="#DEE2E6"
                                style={{ marginRight: 12 }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.transactionName}>{item.name}</Text>
                            </View>
                            <Text
                                style={[
                                    styles.transactionAmount,
                                    { color: item.amount < 0 ? '#f94144' : '#90be6d' },
                                ]}
                            >
                                {item.amount < 0 ? '- ' : '+ '}R$ {Math.abs(item.amount).toFixed(2)}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212529',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 8,
    },
    card: {
        backgroundColor: '#343A40',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        width: '100%',
    },
    greeting: {
        color: '#F8F9FA',
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        color: '#ADB5BD',
        marginTop: 4,
    },
    balanceLabel: {
        color: '#CED4DA',
        marginTop: 16,
    },
    balance: {
        color: '#F8F9FA',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 4,
    },
    sectionTitle: {
        color: '#F8F9FA',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
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
});
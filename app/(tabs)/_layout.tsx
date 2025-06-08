import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Image } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ADB5BD',
                tabBarInactiveTintColor: '#495057',
                tabBarStyle: {
                    backgroundColor: '#212529',
                    borderTopWidth: 0,
                },
                headerStyle: {
                    backgroundColor: '#212529',
                },
                headerTitle: () => (
                    <Image
                        source={require('../../assets/images/logo-transparent.png')}
                        style={{ width: 120, height: 120, resizeMode: 'contain' }}
                    />
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'Transações',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="receipt-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="add-transaction"
                options={{
                    title: 'Nova transação',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="report"
                options={{
                    title: 'Resumo',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bar-chart-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings/index"
                options={{
                    title: 'Configurações',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings/edit-profile"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    )
}
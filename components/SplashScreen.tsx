import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreenComponent() {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;
    const router = useRouter();

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0.5,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 0.9,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();

        const timeout = setTimeout(() => {
            router.replace('/login');
        }, 6000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Animated.Image
                source={require('../assets/images/logo-transparent.png')}
                style={[
                    styles.logo,
                    {
                        opacity: opacity,
                        transform: [{ scale: scale }],
                    },
                ]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212529',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 250,
    },
});

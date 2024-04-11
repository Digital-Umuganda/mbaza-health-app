import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SkeletonLoader = ({ marginBottom = 64 }) => {
    const [animationFirstLine] = useState(new Animated.Value(0));
    const [animationSecondLine] = useState(new Animated.Value(0));

    useEffect(() => {
        startAnimation();
    }, []);

    const startAnimation = () => {
        Animated.loop(
            Animated.parallel([
                Animated.timing(animationFirstLine, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(animationSecondLine, {
                    toValue: 1,
                    duration: 1400, // Adjust duration for different speed
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const translateXFirstLine = animationFirstLine.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 100], // Adjust these values based on the desired animation distance
    });

    const translateXSecondLine = animationSecondLine.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 100], // Adjust these values based on the desired animation distance
    });

    const opacityFirstLine = animationFirstLine.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1], // Adjust these values based on the desired opacity range
    });

    const opacitySecondLine = animationSecondLine.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1], // Adjust these values based on the desired opacity range
    });


    return (
        <View style={styles.container}>
            {/* First line */}
            <Animated.View
                style={[styles.skeletonLine, { opacity: opacityFirstLine, transform: [{ translateX: translateXFirstLine }] }]}
            />
            {/* Second line */}
            <Animated.View
                style={[
                    styles.skeletonLine,
                    { width: '70%', marginTop: 8, marginBottom, opacity: opacitySecondLine, transform: [{ translateX: translateXSecondLine }] },
                ]}
            />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    skeletonLine: {
        width: '100%',
        height: 20, // Height of each line
        backgroundColor: '#E0E0E0', // Light gray color
        borderRadius: 4,
    },
});

export default SkeletonLoader;
// Filename: index.js
// Combined code from all files

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const CELL_SIZE = 20;
const GRID_WIDTH = Math.floor(width / CELL_SIZE);
const GRID_HEIGHT = Math.floor(height / CELL_SIZE);
const INITIAL_SNAKE = [{ x: 2, y: 2 }];
const INITIAL_FOOD = { x: Math.floor(Math.random() * GRID_WIDTH), y: Math.floor(Math.random() * GRID_HEIGHT) };
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

export default function App() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState(INITIAL_FOOD);
    const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(moveSnake, 100);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isPlaying, snake, direction]);

    const moveSnake = useCallback(() => {
        const newSnake = [...snake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT || newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
            setIsPlaying(false);
            return;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            setFood({ x: Math.floor(Math.random() * GRID_WIDTH), y: Math.floor(Math.random() * GRID_HEIGHT) });
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    }, [snake, direction, food]);

    const handleGesture = ({ nativeEvent }) => {
        const { translationX, translationY } = nativeEvent;

        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0 && direction !== DIRECTIONS.LEFT) setDirection(DIRECTIONS.RIGHT);
            else if (translationX < 0 && direction !== DIRECTIONS.RIGHT) setDirection(DIRECTIONS.LEFT);
        } else {
            if (translationY > 0 && direction !== DIRECTIONS.UP) setDirection(DIRECTIONS.DOWN);
            else if (translationY < 0 && direction !== DIRECTIONS.DOWN) setDirection(DIRECTIONS.UP);
        }
    };

    const startGame = () => {
        setSnake(INITIAL_SNAKE);
        setFood(INITIAL_FOOD);
        setDirection(DIRECTIONS.RIGHT);
        setIsPlaying(true);
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Snake Game</Text>
                </View>
                <View style={styles.gameBoard}>
                    {snake.map((segment, index) => (
                        <View key={index} style={[styles.snakeSegment, { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE }]} />
                    ))}
                    <View style={[styles.food, { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE }]} />
                </View>
                {!isPlaying && (
                    <Button title="Start Game" onPress={startGame} />
                )}
                <PanGestureHandler onGestureEvent={handleGesture}>
                    <View style={StyleSheet.absoluteFill} />
                </PanGestureHandler>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333333',
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    gameBoard: {
        width: GRID_WIDTH * CELL_SIZE,
        height: GRID_HEIGHT * CELL_SIZE,
        backgroundColor: '#000000',
        position: 'relative',
        alignSelf: 'center',
        borderColor: '#FFFFFF',
        borderWidth: 2,
    },
    snakeSegment: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
        position: 'absolute',
    },
});
// Filename: index.js
// Combined code from all files
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://apihub.p.appply.xyz:3300/motd';

export default function App() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [glasses, setGlasses] = useState(0);
    
    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                setMessage(response.data.message);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const addGlass = () => {
        setGlasses(prevGlasses => prevGlasses + 1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={styles.box}>
                        <Text style={styles.title}>{message}</Text>
                    </View>
                )}
                
                <View style={styles.box}>
                    <Text style={styles.title}>Water Drinking Tracker</Text>
                    <Text style={styles.subTitle}>You have drunk {glasses} glass(es) of water today</Text>
                    <Button title="Add a Glass of Water" onPress={addGlass} color="#1E90FF" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
    },
    scrollView: {
        alignItems: 'center',
        padding: 20,
    },
    box: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 15,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 16,
        marginBottom: 20,
    }
});
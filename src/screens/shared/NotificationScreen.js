import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native';

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('https://11c0-105-112-109-177.ngrok-free.app/api/notifications');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const formattedData = data.map(notification => {
                    const parsedData = JSON.parse(notification.data); 
                    return {
                        id: notification.id, 
                        title: parsedData.message.split('\r\n')[0], 
                        description: parsedData.message,
                        time: new Date(notification.created_at).toLocaleString(),
                        createdAt: new Date(notification.created_at), // Store the raw date for sorting
                        isRead: notification.read_at !== null,
                    };
                });

                // Sort notifications by createdAt (latest first)
                const sortedData = formattedData.sort((a, b) => b.createdAt - a.createdAt);
                setNotifications(sortedData); 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const renderNotificationItem = ({ item }) => (
        <View style={[styles.notificationItem, !item.isRead && styles.unread]}>
            <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationDescription}>{item.description}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color="#800080" style={styles.loader} />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <Text>Error fetching notifications: {error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>Notifications</Text>
            <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.notificationList}
                ListEmptyComponent={<Text style={styles.noNotificationsText}>No notifications</Text>}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        marginTop: StatusBar.currentHeight || 0,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        margin: 20,
        color: 'black',
        textAlign: 'center',
    },
    notificationList: {
        paddingBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        borderRadius: 10,
        marginVertical: 8,
        padding: 15,
    },
    unread: {
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        borderLeftWidth: 5,
        borderLeftColor: '#800080'
    },
    notificationTextContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 2,
    },
    notificationDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 3,
    },
    noNotificationsText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
        color: '#666',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NotificationScreen;

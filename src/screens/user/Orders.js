import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";

const OrderScreen = () => {
    // Sample order data
    const orders = [
        { id: '1', orderNumber: '12345', status: 'Delivered', date: '2024-09-01', total: 50000 },
        { id: '2', orderNumber: '12346', status: 'Shipped', date: '2024-09-05', total: 30000 },
        { id: '3', orderNumber: '12347', status: 'Processing', date: '2024-09-10', total: 70000 },
    ];

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <View style={styles.orderDetails}>
                <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
                <Text style={styles.orderDate}>Date: {item.date}</Text>
                <Text style={styles.orderStatus}>Status: {item.status}</Text>
            </View>
            <Text style={styles.orderTotal}>₦{item.total.toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Orders</Text>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.orderList}
                ListEmptyComponent={<Text style={styles.noOrdersText}>You have no orders yet.</Text>}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
        textAlign: 'center',
    },
    orderList: {
        paddingBottom: 20,
    },
    orderItem: {
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDetails: {
        flex: 1,
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
        marginVertical: 2,
    },
    orderStatus: {
        fontSize: 14,
        color: '#666',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    noOrdersText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
});

export default OrderScreen;

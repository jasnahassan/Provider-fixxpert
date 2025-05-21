import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const reviews = [
    { id: '1', user: 'Donna Bins', rating: 4.5, text: 'Great service, quick response!' },
    { id: '2', user: 'Ashutosh Pandey', rating: 4.5, text: 'Very professional and helpful!' },
    { id: '3', user: 'Emily Watson', rating: 4.0, text: 'Good, but can be improved.' },
];

const AllRatingsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Ratings & Reviews</Text>

            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <Text style={styles.reviewUser}>{item.user} - ⭐ {item.rating}</Text>
                        <Text style={styles.reviewText}>{item.text}</Text>
                    </View>
                )}
            />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    reviewItem: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    reviewUser: {
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 14,
        color: '#666',
    },
    backButton: {
        backgroundColor: '#DB3043',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AllRatingsScreen;

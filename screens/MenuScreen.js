import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
// Replace with your actual keys
const JSONBIN_BIN_ID = '6a469720da38895dfe2394c5';  // e.g., '682f1a2b8960c979a5901234'
const JSONBIN_API_KEY = '$2a$10$BVHRZzLe/i3gv6c6U8Q9qOFUnbvQGoEpKZbaV.3rjuzrvaWOIeT4C';  // Your X-Master-Key
const MenuScreen = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    fetchMenu();
  }, []);
  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch from JSONBin.io
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/6a469720da38895dfe2394c5`,
        {
          method: 'GET',
          headers: {
            'X-Master-Key': JSONBIN_API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      const data = await response.json();
      
      // JSONBin wraps data in a "record" property
      setMenu(data.record);
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError('No internet connection. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMenu();
    setRefreshing(false);
  };
  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A7C59" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }
  // Error state
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMenu}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  // Menu list
  return (
    <View style={styles.container}>
      <Text style={styles.header}>☕ Our Menu</Text>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A7C59"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.itemPrice}>₱{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A7C59',
    padding: 20,
    paddingBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#888',
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A7C59',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#4A7C59',
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#4A7C59',
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
export default MenuScreen;
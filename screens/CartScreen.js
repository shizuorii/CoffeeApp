import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const CartScreen = () => {
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [savedNote, setSavedNote] = useState(null);
  // Load saved note when component mounts
  useEffect(() => {
    loadSavedNote();
  }, []);
  const loadSavedNote = async () => {
    try {
      const storedNote = await AsyncStorage.getItem('cartNote');
      if (storedNote !== null) {
        const parsed = JSON.parse(storedNote);
        setSavedNote(parsed);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };
  const saveNote = async () => {
    if (!specialInstructions.trim()) {
      Alert.alert('Empty Note', 'Please enter some instructions before saving.');
      return;
    }
    try {
      const noteData = {
        text: specialInstructions.trim(),
        savedAt: new Date().toLocaleString(),
      };
      // Convert to JSON string and save
      await AsyncStorage.setItem('cartNote', JSON.stringify(noteData));
      setSavedNote(noteData);
      setSpecialInstructions('');
      Alert.alert('Success', 'Your note has been saved!');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };
  const clearNote = async () => {
    try {
      await AsyncStorage.removeItem('cartNote');
      setSavedNote(null);
      Alert.alert('Cleared', 'Your saved note has been removed.');
    } catch (error) {
      console.error('Error clearing note:', error);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>🛒 Cart Screen</Text>
        {/* Special Instructions Input */}
        <View style={styles.section}>
          <Text style={styles.label}>SPECIAL INSTRUCTIONS:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Extra sugar, no ice..."
            placeholderTextColor="#666"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
            <Text style={styles.saveButtonText}>Save Note</Text>
          </TouchableOpacity>
        </View>
        {/* Display Saved Note */}
        {savedNote && (
          <View style={styles.savedNoteContainer}>
            <Text style={styles.label}>LAST SAVED NOTE:</Text>
            <Text style={styles.savedNoteText}>{savedNote.text}</Text>
            <Text style={styles.savedNoteTime}>Saved at {savedNote.savedAt}</Text>
            <TouchableOpacity style={styles.clearButton} onPress={clearNote}>
              <Text style={styles.clearButtonText}>Clear Note</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Order Summary Button */}
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>View Order Summary</Text>
        </TouchableOpacity>
        {/* Info Text */}
        <Text style={styles.infoText}>
          💡 Your special instructions will be saved even if you close the app!
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A7C59',
    marginBottom: 25,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4A7C59',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  savedNoteContainer: {
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  savedNoteText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  savedNoteTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 10,
  },
  clearButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#ff6b6b',
    fontSize: 14,
  },
  orderButton: {
    backgroundColor: '#4A7C59',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 25,
  },
});
export default CartScreen;
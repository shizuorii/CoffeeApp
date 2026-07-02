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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [savedProfile, setSavedProfile] = useState(null);
  // Load saved profile when component mounts
  useEffect(() => {
    loadSavedProfile();
  }, []);
  const loadSavedProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile !== null) {
        const parsed = JSON.parse(storedProfile);
        setSavedProfile(parsed);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Empty Name', 'Please enter your name before saving.');
      return;
    }
    try {
      const profileData = {
        name: name.trim(),
        savedAt: new Date().toLocaleString(),
      };
      // Convert to JSON string and save
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      setSavedProfile(profileData);
      setName('');
      Alert.alert('Success', 'Your profile has been saved!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };
  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setSavedProfile(null);
      Alert.alert('Cleared', 'Your profile has been removed.');
    } catch (error) {
      console.error('Error clearing profile:', error);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.header}>👤 Profile</Text>
        {/* Welcome Message if profile exists */}
        {savedProfile && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{savedProfile.name}!</Text>
            <Text style={styles.savedTime}>
              Profile saved on {savedProfile.savedAt}
            </Text>
          </View>
        )}
        {/* Name Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            {savedProfile ? 'UPDATE YOUR NAME:' : 'YOUR NAME:'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>
              {savedProfile ? 'Update Name' : 'Save Name'}
            </Text>
          </TouchableOpacity>
          {savedProfile && (
            <TouchableOpacity style={styles.clearButton} onPress={clearProfile}>
              <Text style={styles.clearButtonText}>Clear Profile</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Info Text */}
        <Text style={styles.infoText}>
          💡 Your profile name will be saved even if you close the app!
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A7C59',
    marginBottom: 25,
  },
  welcomeContainer: {
    backgroundColor: '#2a2a2a',
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  welcomeText: {
    color: '#888',
    fontSize: 16,
  },
  userName: {
    color: '#4A7C59',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },
  savedTime: {
    color: '#666',
    fontSize: 12,
    marginTop: 10,
  },
  inputSection: {
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
  clearButton: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#ff6b6b',
    fontSize: 14,
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
});
export default ProfileScreen;
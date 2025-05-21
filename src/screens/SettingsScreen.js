import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import { setTheme, setFontSize, savePreferences } from '../redux/themeSlice';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-paper'


const SettingsScreen = () => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.theme.theme);
    const fontSize = useSelector(state => state.theme.fontSize);

    const handleSave = () => {
        dispatch(savePreferences()); 
    };

    return (
        <View style={[styles.container, theme === 'dark' ? styles.darkMode : styles.lightMode]}>

  
            <View style={[styles.card, theme === 'dark' ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.label, { fontSize }, theme === 'dark' ? styles.darkTextShadow : styles.lightText]}>
                    Select Theme:
                </Text>

                <View style={styles.themeButtons}>
                    <TouchableOpacity 
                        style={[styles.themeButton, theme === 'light' && styles.activeButton]}
                        onPress={() => dispatch(setTheme('light'))}
                    >
                       
                        <Text style={[styles.buttonText, { fontSize }]}> ☀️ Light</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.themeButton, theme === 'dark' && styles.activeButton]}
                        onPress={() => dispatch(setTheme('dark'))}
                    >
                        <Icon name="moon" size={24} color="white" />
                        <Text style={[styles.buttonText, { fontSize }, theme === 'dark' ? styles.darkTextShadow : styles.lightText]}> 🌙 Dark</Text>
                    </TouchableOpacity>
                </View>
            </View>

     
            <View style={[styles.card, theme === 'dark' ? styles.darkCard : styles.lightCard, styles.centeredCard]}>
                <Text style={[styles.label, { fontSize }, theme === 'dark' ? styles.darkTextShadow : styles.lightText]}>
                    Adjust Font Size:
                </Text>

                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={12}
                    maximumValue={30}
                    step={1}
                    value={fontSize}
                    onValueChange={(value) => dispatch(setFontSize(value))}
                />

                <Text style={[styles.fontSizeLabel, { fontSize }, theme === 'dark' ? styles.darkTextShadow : styles.lightText]}>
                    Selected Font Size: {fontSize}
                </Text>
            </View>

        
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={[styles.saveButtonText, { fontSize }]}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    darkMode: {
        backgroundColor: '#121212',
    },
    lightMode: {
        backgroundColor: '#f5f5f5',
    },
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    lightCard: {
        backgroundColor: '#fff',
    },
    darkCard: {
        backgroundColor: '#222',
    },
    centeredCard: {
        position: 'absolute',
        top: '40%',
    },
    label: {
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    themeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    themeButton: {
        flex: 1,
        padding: 12,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#007AFF',
        flexDirection: 'row',
        gap: 5,
    },
    activeButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    darkTextShadow: {
        color: 'white',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    lightText: {
        color: '#222',
    },
    fontSizeLabel: {
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 10,
    },
    saveButton: {
        width: '90%',
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SettingsScreen;

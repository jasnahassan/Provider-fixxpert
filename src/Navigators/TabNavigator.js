import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import testscreen from '../screens/testscreen'
import Profile from '../screens/ProfileScreen'
import Gallery from '../screens/Gallery'


const Tab = createBottomTabNavigator()
const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="Gallery" component={Gallery} />
        </Tab.Navigator>
    )
}

export default TabNavigator

const styles = StyleSheet.create({})
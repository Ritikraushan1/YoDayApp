import { View, Text } from 'react-native'
import React from 'react'
import SimpleHeader from '../../components/SimpleHeader'

const Contact = ({ navigation, route }) => {
    return (
        <View>
            <SimpleHeader title="Contact Us" onBack={() => navigation.goBack()} />
        </View>
    )
}

export default Contact
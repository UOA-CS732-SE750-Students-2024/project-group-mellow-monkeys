import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 flex justify-around bg-white">
      {/* title */}
      <View className="space-y-2">
        <Text
          style={{fontSize: wp(10)}}
          className="text-center font-bold text-gray-700">
          BUBO
        </Text>
        <Text
          style={{fontSize: wp(4)}}
          className="text-center tracking-wider font-semibold text-gray-600">
          Powered by OpenAI.
        </Text>
      </View>
      {/* assistant image */}
      <View className="flex-row justify-center">
        <Image
          source={require('../../assets/image/botHI.gif')}
          style={{height: wp(100), width: wp(100)}}
        />
      </View>
      {/* start button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        className="bg-gray-600 mx-5 p-4 rounded-2xl">
        <Text
          style={{fontSize: wp(6)}}
          className="text-center font-bold text-white">
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

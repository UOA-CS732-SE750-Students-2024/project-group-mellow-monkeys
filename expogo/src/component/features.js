import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Features() {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentViewIndex(currentIndex => {
        if (currentIndex < 5) {
          return currentIndex + 1;
        } else {
          clearInterval(intervalId);
          return currentIndex;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{height: hp(4)}}></View>
      <View
        contentContainerStyle={{
          padding: 10,
          width: wp(90),
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {currentViewIndex >= 1 && (
          <View
            style={{
              width: wp(75),
            }}
            className="bg-gray-200 p-2 rounded-xl rounded-tl-none">
            <Text style={{fontSize: wp(4)}}>
              Hi! I am BOBU - Powered by OpenAI. I can understand your speech
              and provide responses...
            </Text>
          </View>
        )}

        {currentViewIndex >= 2 && (
          <View
            style={{
              width: wp(75),
              marginTop: 10,
              alignSelf: 'flex-end',
            }}
            className="bg-emerald-100 p-2 rounded-xl rounded-tr-none">
            <Text style={{fontSize: wp(4), fontWeight: 'bold'}}>
              "You can press the record button and speak."
            </Text>
          </View>
        )}

        {currentViewIndex >= 3 && (
          <View
            style={{
              width: wp(75),
              marginTop: 10,
            }}
            className="bg-gray-200 p-2 rounded-xl rounded-tl-none">
            <Text style={{fontSize: wp(4)}}>
              I respond to your speech with text-based responses.
            </Text>
          </View>
        )}

{currentViewIndex >= 4 && (
          <View
            style={{
              width: wp(75),
              marginTop: 10,
            }}
            className="bg-gray-200 p-2 rounded-xl rounded-tl-none">
            <Text style={{fontSize: wp(4)}}>
              Give a try! Ask me anything.
            </Text>
          </View>
        )}

{currentViewIndex >= 5 && (
          <View
            style={{
              width: wp(25),
              marginTop: 10,
              alignSelf: 'flex-end',
            }}
            className="bg-emerald-100 p-2 rounded-xl rounded-tr-none">
            <Text style={{fontSize: wp(4), fontWeight: 'bold'}}>
              ...
            </Text>
          </View>
        )}
        
      </View>
    </View>
  );
}

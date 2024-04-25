import {
    View,
    Text,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import Features from '../component/features';
  import React, {useEffect, useRef, useState} from 'react';
  // import {dummyMessages} from '../constants';
  import Voice from '@react-native-community/voice';
  import {apiCall} from '../api/openAI';
  import {useNavigation} from '@react-navigation/native';
  
  export default function HomeScreen({}) {
    const [messages, setMessages] = useState([]);
    const [recording, setRecording] = useState(false);
    const [result, setResult] = useState('');
    const scrollViewRef = useRef();
    const [loading, setLoading] = useState(false);
  
    const [isRecording, setIsRecording] = useState(false);
  
    const navigation = useNavigation();
  
    const speechStartHandler = e => {
      console.log('speech start event', e);
    };
    const speechEndHandler = e => {
      setRecording(false);
      console.log('speech stop event', e);
    };
    const speechResultsHandler = e => {
      console.log('speech event: ', e);
      const text = e.value[0];
      setResult(text);
    };
  
    const speechErrorHandler = e => {
      console.log('speech error: ', e);
    };
  
    const startRecording = async () => {
      setRecording(true);
      setIsRecording(true);
      try {
        await Voice.start('en-US');
      } catch (error) {
        console.log('error', error);
      }
    };
  
    const stopRecording = async () => {
      try {
        await Voice.stop();
        setRecording(false);
        setIsRecording(false);
        fetchResponse();
      } catch (error) {
        console.log('error', error);
      }
    };
  
    const clear = () => {
      setLoading(false);
      setMessages([]);
    };
  
    const fetchResponse = async () => {
      if (result.trim().length > 0) {
        let newMessages = [...messages];
        newMessages.push({role: 'user', content: result.trim()});
        setMessages([...newMessages]);
  
        // scroll to the bottom of the view
        updateScrollView();
        setLoading(true);
  
        apiCall(result.trim(), newMessages).then(res => {
          // console.log('got api data: ', res);
          setLoading(false);
  
          if (res.success) {
            setMessages([...res.data]);
            updateScrollView();
  
            setResult('');
          } else {
            Alert.alert('Error', res.msg);
          }
        });
      }
    };
  
    const updateScrollView = () => {
      setTimeout(() => {
        scrollViewRef?.current?.scrollToEnd({animated: true});
      }, 200);
    };
  
    useEffect(() => {
      Voice.onSpeechStart = speechStartHandler;
      Voice.onSpeechEnd = speechEndHandler;
      Voice.onSpeechResults = speechResultsHandler;
      Voice.onSpeechError = speechErrorHandler;
  
      return () => {
        // destroy the voice instance after component unmounts
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []);
  
    // console.log('result', result);
  
    return (
      <View className="flex-1 bg-white">
        {/* <StatusBar barStyle="dark-content" /> */}
        <SafeAreaView className="flex-1 flex mx-5">
          <View className="flex-row justify-center">
            <Image
              source={
                isRecording
                  ? require('../../assets/image/voice.gif')
                  : require('../../assets/image/botHI.gif')
              }
              style={{height: hp(15), width: hp(15)}}
            />
          </View>
  
          {/* features || message history */}
          {messages.length > 0 ? (
            <View className="space-y-2 flex-1">
              <View style={{height: hp(58)}} className=" rounded-3xl p-4">
                <ScrollView
                  ref={scrollViewRef}
                  bounces={false}
                  className="space-y-4"
                  showsVerticalScrollIndicator={false}>
                  {messages.map((message, index) => {
                    if (message.role === 'assistant') {
                      //text response
                      return (
                        <View
                          key={index}
                          style={{width: wp(70)}}
                          className="bg-gray-200 p-2 rounded-xl rounded-tl-none">
                          <Text
                            className="text-neutral-800"
                            style={{fontSize: wp(4)}}>
                            {message.content}
                          </Text>
                        </View>
                      );
                    } else {
                      //user response
                      return (
                        <View key={index} className="flex-row justify-end">
                          <View
                            style={{width: wp(70)}}
                            className="bg-emerald-100 p-2 rounded-xl rounded-tr-none">
                            <Text style={{fontSize: wp(4)}}>
                              {message.content}
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  })}
                </ScrollView>
              </View>
            </View>
          ) : (
            <Features />
          )}
  
          {/* recording, clear and stop buttons */}
          <View className="flex justify-center items-center">
            {loading ? (
              <Image
                source={require('../../assets/image/loading.gif')}
                style={{width: hp(10), height: hp(10)}}
              />
            ) : recording ? (
              <TouchableOpacity onPress={stopRecording}>
                {/* recording stop button */}
                <Image
                  className="rounded-full"
                  source={require('../../assets/image/voiceLoading.gif')}
                  style={{width: hp(10), height: hp(10)}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={startRecording}>
                {/* recording start button */}
                <Image
                  className="rounded-full"
                  source={require('../../assets/image/recordingIcon.png')}
                  style={{width: hp(10), height: hp(10)}}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={clear}
              className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={() => navigation.navigate('Welcome')}
              className="bg-red-400 rounded-3xl p-2 absolute left-10">
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
  
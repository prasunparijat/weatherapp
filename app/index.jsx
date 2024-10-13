import React, { useState, useCallback, useEffect } from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon, CalendarDaysIcon } from 'react-native-heroicons/solid';
import { StatusBar } from 'expo-status-bar';
import { debounce } from 'lodash';
import { fetchLocations, fetchForecast } from '../api/weather';
import { WeatherImageMap } from '@/constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../utils/asyncStorage';

export default function App() {
  const [search, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [currentWeather, setCurrentWeather] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleLocation = async (value) => {
    toggleSearch(false);
    setLocations([]);
    setIsLoading(true);
    const response = await fetchForecast({ cityName: value, days: '7' });
    console.log(response);
    setCurrentWeather(response);
    setIsLoading(false);
    storeData('city', value);
  };
  const handleSearch = async (value) => {
    if (value.length > 2) {
      const response = await fetchLocations({ cityName: value });
      setLocations(response);
    }
  };
  const handleSearchDebounce = useCallback(debounce(handleSearch, 500), []);
  const { current, location } = currentWeather;

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = (await getData('city')) || 'Mumbai';
    const forecastData = await fetchForecast({
      cityName: myCity,
      days: '7',
    });
    setCurrentWeather(forecastData);
    setIsLoading(false);
  };

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        className="absolute h-full w-full"
        blurRadius={70}
        source={require('../assets/images/bg.png')}
      />

      {!isLoading ? (
        <SafeAreaView className="flex flex-1 z-10">
          {/* search section complete */}
          <View className="h-12 mx-4 relative z-50">
            <View
              className="flex-row justify-end items-center rounded-full"
              style={{
                backgroundColor: search ? theme.bgWhite(0.2) : 'transparent',
              }}
            >
              {search && (
                <TextInput
                  onChangeText={handleSearchDebounce}
                  placeholder="Search City"
                  placeholderTextColor={'lightgray'}
                  className="pl-6 pb-1 flex-1 text-base text-white"
                />
              )}
              <TouchableOpacity
                className="rounded-full p-3 m-1"
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                onPress={() => {
                  toggleSearch(!search);
                }}
              >
                <MagnifyingGlassIcon
                  size="20"
                  color="white"
                />
              </TouchableOpacity>
            </View>
            {/* search results dropdown subsection */}
            {locations.length > 0 && search ? (
              <View className="absolute top-14 w-full bg-gray-300 rounded-3xl">
                {locations.map((location, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(location?.name)}
                      key={index}
                      className={`flex-row p-4 px-3 border-0 items-center ${index != locations.length - 1 ? 'border-b border-gray-400' : ''}`}
                    >
                      <MapPinIcon
                        size="20"
                        color="gray"
                      />
                      <Text className="text-base text-black ml-2">
                        {location?.name}, {location?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/* forecast section complete */}
          {/* <KeyboardAvoidingView> */}
          <View className="mx-4 flex-1 justify-around mb-2">
            {/* location */}
            <Text className="text-2xl text-white font-bold text-center">
              {location?.name},{' '}
              <Text className="text-lg font-semibold text-gray-300">
                {location?.country}
              </Text>
            </Text>
            {/* weather image */}
            <View className="flex-row justify-center">
              <Image
                className="h-52 w-52"
                source={WeatherImageMap[current?.condition?.text]}
              />
            </View>

            {/* temperature */}
            <View className="space-y-2">
              <Text className="text-6xl text-white font-bold text-center ml-5">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-xl text-white text-center tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            {/* other stats */}
            <View className="flex-row justify-between mx-4">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../assets/icons/wind.png')}
                  className="w-6 h-6"
                />
                <Text className="text-white text-center">
                  {current?.wind_kph} kph
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../assets/icons/drop.png')}
                  className="w-6 h-6"
                />
                <Text className="text-white text-center">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../assets/icons/sun.png')}
                  className="w-6 h-6"
                />
                <Text className="text-white text-center">
                  {currentWeather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
            {/* forecast for next days */}
            <View className="mb-2 space-y-3">
              <View className="flex-row space-x-2 items-center mx-6">
                <CalendarDaysIcon
                  size="20"
                  color="white"
                />
                <Text className="text-white text-base">Daily Forecast</Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}
              >
                {currentWeather?.forecast?.forecastday.map((item, index) => {
                  const date = new Date(item?.date);
                  const options = { weekday: 'long' };
                  const dayName = date
                    .toLocaleDateString('en-US', options)
                    .split(',')[0];
                  return (
                    <View
                      key={index}
                      className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                      style={{ backgroundColor: theme.bgWhite(0.15) }}
                    >
                      <Image
                        className="w-11 h-11"
                        source={WeatherImageMap[item?.day?.condition?.text]}
                      />
                      <Text className="text-white text-base">{dayName}</Text>
                      <Text className="text-white text-xl font-semibold">
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          {/* </KeyboardAvoidingView> */}
        </SafeAreaView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Progress.CircleSnail
            thickness={10}
            size={140}
            color="#0BB3B2"
          />
        </View>
      )}
    </View>
  );
}

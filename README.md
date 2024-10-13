# This is a weather app ☁️

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npm start // this already has the npm run expo start as the alias
   ```

## Learn more

# - Key takeaways :

- 1. Use native-wind - tailwindcss utility for the react-native
- 2. Environment variables in react native are auto imported by expo if they have the `EXPO_PUBLIC_[KEY_NAME]` as the key in the `.env` file. and can be extracted via `process.end.EXPO_PUBLIC_[KEY_NAME]` - acceessible in all JS parts of the program but not in the native part.
- 3. dotenv does not directly work like in case of nodejs - as here HERMES is used under the hood and - two other trivial ways. 1. react-native-dotenv -- js functions only 2. react-native-config accessible in both js and native parts of the code.

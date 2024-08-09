import {supabase} from '../../utils/supabase';
import dotenv from 'dotenv';

const isStravaTokenExpired = (currentExpirationTime) => {
    const currentEpochTime = Date.now() / 1000;
    if (currentExpirationTime === 'undefined') {
        return `There is an error with the currentEpirationTime, it's value is: ${currentExpirationTime}.`
    }
    return currentEpochTime > currentExpirationTime;
  }
  
  const generateNewToken = async () => {
    console.log('Generating new token...');
    const requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };

    
      let {data, error} = await supabase
      .from('auth')
      .select('client_id, client_secret, refresh_token')
      .eq('user_id', 1)

      if (error) {
        console.log('Error fetching data from Supabase')
        return;
      }


    const requestURL = `https://www.strava.com/api/v3/oauth/token?client_id=${data[0].client_id}&client_secret=${data[0].client_secret}&grant_type=refresh_token&refresh_token=ReplaceWithRefreshToken&refresh_token=${data[0].refresh_token}`;
  
    try {
        let response = await fetch(requestURL, requestOptions);
        response = await response.json(); 
        if (response.message === 'Bad Request') {
          console.log(response);
            return;
        }
        return {
            refreshToken: await response.refresh_token, 
            expirationTime: await response.expires_at,
            accessToken: await response.access_token
        }
    } catch (error) {
        console.log(error);
    }
  
  }
  
  
  
  const persistNewTokenData = async (newTokenData) => {
    // Update the relevant key with the new value
    let { data, error } = await supabase
      .from('auth')
      .update({ expiration_time: newTokenData.expirationTime, refresh_token: newTokenData.refreshToken, access_token: newTokenData.accessToken })
      .eq('user_id', 1)

  };
  
  
  
  const getStravaActivityData = async () => {
    console.log('Requesting activity data from Strava...');
    let myHeaders = new Headers();
    let {data, error} = await supabase
      .from('auth')
      .select('access_token')
      .eq('user_id', 1)


    myHeaders.append("Authorization", `Bearer ${data[0].access_token}`);
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    try {
        const response = await fetch("https://www.strava.com/api/v3/athlete/activities", requestOptions);
        return response.json();
  
    } catch (error) {
        console.log('error', error)
    }   
  }
  
  //check to see if the expiration time has passed
  const executeStravaLogic = async () => {
    let { data, expirationTimeError } = await supabase
      .from('auth')
      .select('expiration_time')
      .eq('user_id', 1)
    
    const isTokenExpired = isStravaTokenExpired(data[0].expiration_time);

    if (typeof isTokenExpired === 'string') {
        console.log('Please resolve the error with the current expiration time stored in the database');
        return;
    } else if (isTokenExpired) {
        console.log('The expiration time has passed. Generating a new token...');
        //if yes - generate a new token
        const newTokenData = await generateNewToken();
        if (!newTokenData.expirationTime) {
            console.log('There was an error getting refresh token data.')
            return;
        } 
        //save the new token info to .env
        persistNewTokenData(newTokenData);
  
    } 
    //make request to Strava activities endpoint
    const stravaActivityData = await getStravaActivityData();
    return stravaActivityData;
  };
  
export default executeStravaLogic;
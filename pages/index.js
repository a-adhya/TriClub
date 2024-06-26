import Head from 'next/head';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import executeStravaLogic from './api/service';
import Nav from './nav';

//Helper functions

//gets start of sunday 12 am of current week
  export const getSundayMidnight = () => {
  const now = new Date()
  const dayOfWeek = now.getDay();
  const diffFromSunday = (dayOfWeek === 0 ? 0 : -dayOfWeek);
  const sundayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffFromSunday);
  sundayMidnight.setHours(0, 0, 0, 0);
  return sundayMidnight;
}

  //gets weekly time doing activities
  export const getWeeklyTime = (activityType, activities) => {
    // const weeklyTime = activities.reduce((acc, activity) => acc + activity.distance, 0);
    // setWeeklyTime(weeklyTime);
    const sundayMidnight = getSundayMidnight()
    const oneWeekActivities = activities ? activities.filter(activity => {
      
      const activityDate = new Date(activity.start_date_local);
      if(activityType === "All"){
        return activityDate > sundayMidnight;
      }
      return activityDate > sundayMidnight && activity.type === activityType ;
    }) : [];
    const weeklyTime = oneWeekActivities.reduce((acc, activity) => acc + activity.moving_time, 0)
    const hours = Math.floor(weeklyTime / 3600);
    const minutes = Math.floor((weeklyTime % 3600) / 60);
    const seconds = weeklyTime % 60;
    return [hours, minutes, seconds]
  }

  //gets weekly distance doing activities
  export const getWeeklyDistance = (activityType, activities) => {
    const oneWeekActivities = activities ? activities.filter(activity => {
      const activityDate = new Date(activity.start_date_local);
      if(activityType === "All"){
        return activityDate > getSundayMidnight();
      }
      return activityDate > getSundayMidnight() && activity.type === activityType;
    }) : [];
    const weeklyDistance = oneWeekActivities.reduce((acc, activity) => acc + activity.distance, 0);
    const metersToMiles = parseFloat(((weeklyDistance / 1000) / 1.6).toFixed(2));
    return metersToMiles;
  }

export default function Home() {
  const [activities, setActivities] = useState(null);
  const [weeklyTime, setWeeklyTime] = useState(null);

   useEffect(() => {
      executeStravaLogic()
      .then(data => {
        setActivities(data);
      })
      .catch(error => console.error('Error fetching activities:', error));
  }, []);
    
  

  //gets weekly time doing activities
  const getWeeklyTime = (activityType) => {
    // const weeklyTime = activities.reduce((acc, activity) => acc + activity.distance, 0);
    // setWeeklyTime(weeklyTime);
    const sundayMidnight = getSundayMidnight()
    const oneWeekActivities = activities ? activities.filter(activity => {
      
      const activityDate = new Date(activity.start_date_local);
      if(activityType === "All"){
        return activityDate > sundayMidnight;
      }
      return activityDate > sundayMidnight && activity.type === activityType ;
    }) : [];
    const weeklyTime = oneWeekActivities.reduce((acc, activity) => acc + activity.moving_time, 0)
    const hours = Math.floor(weeklyTime / 3600);
    const minutes = Math.floor((weeklyTime % 3600) / 60);
    const seconds = weeklyTime % 60;
    return [hours, minutes, seconds]
  }

  //gets weekly distance doing activities
  const getWeeklyDistance = (activityType) => {
    const oneWeekActivities = activities ? activities.filter(activity => {
      const activityDate = new Date(activity.start_date_local);
      if(activityType === "All"){
        return activityDate > getSundayMidnight();
      }
      return activityDate > getSundayMidnight() && activity.type === activityType;
    }) : [];
    const weeklyDistance = oneWeekActivities.reduce((acc, activity) => acc + activity.distance, 0);
    const metersToMiles = parseFloat(((weeklyDistance / 1000) / 1.6).toFixed(2));
    return metersToMiles;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>TriTracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <Nav />
      </nav>
      <main>
        <h1 className={styles.title}>
          Welcome to TriTracker
        </h1>
        <div>
          
        </div>
        
        <div>
          <h2>
            This week you moved {getWeeklyTime("All", activities)[0]} hours, {getWeeklyTime("All", activities)[1]} minutes, and {getWeeklyTime("All", activities)[2]} seconds
          </h2>
          <h2>
            You moved {getWeeklyDistance("All", activities)} miles this week.
          </h2>
          <h2>
            You ran {getWeeklyTime("Run", activities)[0]} hours, {getWeeklyTime("Run", activities)[1]} minutes, and {getWeeklyTime("Run", activities)[2]} seconds
          </h2>
          <h2>
            You ran {getWeeklyDistance("Run", activities)} miles this week.
          </h2>
          <h2>
            You biked {getWeeklyTime("Ride", activities)[0]} hours, {getWeeklyTime("Ride", activities)[1]} minutes, and {getWeeklyTime("Ride", activities)[2]} seconds
          </h2>
          <h2>
            You biked {getWeeklyDistance("Ride", activities)} miles this week.
          </h2>
          <h2>
            You swam {getWeeklyTime("Swim", activities)[0]} hours, {getWeeklyTime("Swim", activities)[1]} minutes, and {getWeeklyTime("Swim", activities)[2]} seconds
          </h2>
          <h2>
            You swam {getWeeklyDistance("Swim", activities)} miles this week.
          </h2>
          {activities ? (
            <ul>
              {activities.map(activity => (
                <li key={activity.id}>{activity.name}</li>
                  
              ))}
            </ul>
          ) : (
            <p>Loading activities...</p>
          )}
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
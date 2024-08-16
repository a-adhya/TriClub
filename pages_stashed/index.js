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
        <div className="flex flex-col items-center px-10 pt-6 pb-11 bg-gray-200 max-md:px-5">
        <div className="flex gap-5 justify-center w-full max-md:flex-wrap max-md:max-w-full">
            <div className="flex flex-col self-end mt-6">
            <div className="shrink-0 h-1.5 bg-neutral-400" />
            <div className="shrink-0 mt-5 bg-neutral-400 h-[7px]" />
            </div>
            <div className="grow justify-center py-2.5 pr-20 pl-24 text-5xl text-center text-white bg-orange-400 rounded-3xl border-4 border-solid border-white border-opacity-0 w-fit max-md:pr-8 max-md:pl-5 max-md:max-w-full max-md:text-4xl">
            welcome...here are your weekly triathlon stats
            </div>
        </div>
        <div className="shrink-0 mt-3 ml-4 h-1.5 bg
        .+-neutral-400 w-[50px] max-md:ml-2.5" />
        <div className="self-stretch mt-20 max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[54%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow items-center mt-3.5 max-md:mt-10 max-md:max-w-full">
                <div className="flex gap-5 self-stretch text-center text-orange-400 max-md:flex-wrap">
                    <div className="flex-auto text-8xl max-md:text-4xl">
                    {getWeeklyDistance("All", activities)} mi
                    </div>
                    <div className="text-5xl">
                    total <br />
                    distance
                    </div>
                </div>
                <div className="self-stretch px-11 py-9 mt-14 bg-orange-400 rounded-3xl border-4 border-solid border-neutral-200 max-md:px-5 max-md:mt-10 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                    <div className="flex flex-col w-[69%] max-md:ml-0 max-md:w-full">
                        <div className="text-8xl text-center text-white underline border border-amber-500 border-solid max-md:mt-10 max-md:text-4xl">
                        {getWeeklyTime("All", activities)[0] === 0 ? "00" : getWeeklyTime("All", activities)[0]}:{getWeeklyTime("All", activities)[1] === 0 ? "00" : getWeeklyTime("All", activities)[1]}:{getWeeklyTime("All", activities)[2] === 0 ? "00" : getWeeklyTime("All", activities)[2]}
                        </div>
                    </div>
                    <div className="flex flex-col ml-5 w-[31%] max-md:ml-0 max-md:w-full">
                        <div className="text-5xl text-center text-gray-200 border border-amber-500 border-solid max-md:mt-10">
                        total <br />
                        time
                        </div>
                    </div>
                    </div>
                </div>
                <div className="justify-center px-5 py-11 mt-9 max-w-full text-5xl text-center text-white rounded-3xl border-4 border-solid bg-orange-400 bg-opacity-60 border-white border-opacity-0 w-[484px] max-md:max-w-full">
                    latest activities...
                </div>
                <div className="shrink-0 mt-9 max-w-full rounded-3xl border-4 border-solid bg-orange-400 bg-opacity-60 border-white border-opacity-0 h-[118px] w-[484px]" />
                <div className="shrink-0 mt-9 max-w-full rounded-3xl border-4 border-solid bg-orange-400 bg-opacity-60 border-white border-opacity-0 h-[118px] w-[484px]" />
                </div>
            </div>
            <div className="flex flex-col ml-5 w-[46%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow text-5xl text-center text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl">
                <div className="items-center px-16 pt-12 pb-24 rounded-3xl border-4 border-gray-200 border-solid bg-green-900 bg-opacity-40 max-md:px-5 max-md:max-w-full max-md:text-4xl">
                    run breakdown
                </div>
                <div className="items-center px-16 pt-12 pb-32 mt-11 rounded-3xl border-4 border-gray-200 border-solid bg-black bg-opacity-40 max-md:px-5 max-md:pb-10 max-md:mt-10 max-md:max-w-full max-md:text-4xl">
                    bike breakdown
                </div>
                <div className="items-center px-16 pt-11 pb-28 mt-11 rounded-3xl border-4 border-gray-200 border-solid bg-blue-300 bg-opacity-40 max-md:px-5 max-md:mt-10 max-md:max-w-full max-md:text-4xl">
                    swim breakdown
                </div>
                </div>
            </div>
            </div>
        </div>
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
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import executeStravaLogic from './api/service';
import { getWeeklyTime, getWeeklyDistance, getSundayMidnight } from './index';
import Nav from './nav';

export default function Run() {
  const [activities, setActivities] = useState(null);
  const [weeklyTime, setWeeklyTime] = useState(null);

   useEffect(() => {
      executeStravaLogic()
      .then(data => {
        setActivities(data);
      })
      .catch(error => console.error('Error fetching activities:', error));
  }, []);
    

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
            You swam {getWeeklyTime("Swim")[0]} hours, {getWeeklyTime("Swim")[1]} minutes, and {getWeeklyTime("Swi,")[2]} seconds
          </h2>
          <h2>
            You swam {getWeeklyDistance("Swim")} miles this week.
          </h2>
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
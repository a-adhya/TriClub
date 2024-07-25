import Head from 'next/head';
import styles from '../styles/Bike.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import executeStravaLogic from './api/service';
import { getWeeklyTime, getWeeklyDistance, getSundayMidnight } from './index';
import Nav from './nav';

export default function Bike() {
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
    <div className={styles.bike}>
      <div className={styles.div}>
        <div className={styles.group}>
          <div className={styles.group2}>
            <div className={styles.rectangle} />
            <div className={styles.rectangle2} />
            <div className={styles.rectangle3} />
          </div>
        </div>
        <div className={styles.overlap}>
          <div className={styles.totalDistance}>
            total <br />
            distance
          </div>
          <div className={styles.textWrapper}>25.50 mi</div>
        </div>
        <div className={styles.overlapGroup}>
          <div className={styles.rectangle4} />
          <div className={styles.totalTime}>
            total <br />
            time
          </div>
          <div className={styles.textWrapper2}>10:00:59</div>
        </div>
        <div className={styles.overlap2}>
          <div className={styles.overlapGroup2}>
            <div className={styles.rectangle5} />
            <div className={styles.rectangle6} />
            <img className={styles.img} alt="Rectangle" src="https://c.animaapp.com/c5lDQwWX/img/rectangle-18.svg" />
            <p className={styles.elementMileBike}>
              4 mile bike
              <br />
              15:26 moving time
            </p>
            <p className={styles.p}>
              4 mile bike
              <br />
              15:26 moving time
            </p>
            <div className={styles.textWrapper3}>all rides this week</div>
            <div className={styles.rectangle7} />
            <div className={styles.textWrapper4}>average pace/ride</div>
            <div className={styles.textWrapper5}>6 min/mi</div>
          </div>
          <div className={styles.divWrapper}>
            <p className={styles.textWrapper6}>Click for more stats ...</p>
          </div>
        </div>
        <div className={styles.overlap3}>
          <div className={styles.rectangle8} />
          <p className={styles.textWrapper7}>at a glance...your weekly rides</p>
        </div>
        <div className={styles.rectangle9} />
      </div>
    </div>
  );
}
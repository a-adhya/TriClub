//import Head from 'next/head';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import styles from '../styles/Home.module.css';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const userId = 1; // Replace with your hard-coded user ID

  useEffect(() => {
    const fetchProfile = async () => {
      let { data: userProfile, error } = await supabase
        .from('User Profile')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>User Profile</h1>
      {/* <img src={profile.profile_picture} alt="Profile Picture" /> */}
      <p>Name: {profile.name}</p>
      <p>Race Training For: {profile.training_for}</p>
      <p>Num Following: {profile.following}</p>
      <p>Num Followers: {profile.followers}</p>
      <p>Based in: {profile.location_city}, {profile.location_state}</p>
      <p>Goal: {profile.goal}</p>
      <h2>Latest Activities</h2>
      {/* <ul>
        {profile.latest_activities.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul> */}
      <a href={`https://www.strava.com/athletes/${profile.strava_id}`} target="_blank" rel="noopener noreferrer">
        <button>Check out Strava</button>
      </a>
    </div>
  );
}
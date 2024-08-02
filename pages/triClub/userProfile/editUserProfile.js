import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import styles from '../styles/Home.module.css';
//import Head from 'next/head';

export default function EditUserProfile() {
  const [profile, setProfile] = useState({
    profile_picture: '',
    name: '',
    race_training_for: '',
    num_following: 0,
    num_followers: 0,
    based_in: '',
    goal: '',
    latest_activities: [],
    strava_id: ''
  });
  const userId = 'hardcoded-user-id'; // Replace with your hard-coded user ID

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(userProfile);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      alert('Profile updated successfully!');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* <Head>
        <title>Edit User Profile</title>
        <meta name="description" content="Edit user profile details" />
      </Head> */}
      <h1>Edit User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Profile Picture URL:</label>
          <input
            type="text"
            name="profile_picture"
            value={profile.profile_picture}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Race Training For:</label>
          <input
            type="text"
            name="race_training_for"
            value={profile.race_training_for}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Num Following:</label>
          <input
            type="number"
            name="num_following"
            value={profile.num_following}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Num Followers:</label>
          <input
            type="number"
            name="num_followers"
            value={profile.num_followers}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Based in:</label>
          <input
            type="text"
            name="based_in"
            value={profile.based_in}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Goal:</label>
          <input
            type="text"
            name="goal"
            value={profile.goal}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Strava ID:</label>
          <input
            type="text"
            name="strava_id"
            value={profile.strava_id}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
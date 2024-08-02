import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import styles from '../styles/Home.module.css';

export default function Followers() {
  const [profile, setProfile] = useState(null);
  const userId = 1; // Replace with your hard-coded user ID

  useEffect(() => {
    const fetchProfile = async () => {
      let { data: followersProfiles, error } = await supabase
        .from('Followers')
        .select(`
          follower_id,
          UserProfile:User Profile (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching followers profiles:', error);
      } else {
        setProfile(followersProfiles);
      }
    };

    fetchProfile();
  }, []);

  const removeFollower = async (followerId) => {
    const { error } = await supabase
      .from('Followers')
      .delete()
      .eq('user_id', userId)
      .eq('follower_id', followerId);

    if (error) {
      console.error('Error removing follower:', error);
    } else {
      setProfile(profile.filter(follower => follower.follower_id !== followerId));
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Followers Profiles</h1>
      <div>
        {profile.map((followerProfile, index) => (
          <div key={index}>
            <h2>{followerProfile.UserProfile.name}</h2>
            <p>Location: {followerProfile.UserProfile.location_city}, {followerProfile.UserProfile.location_state}</p>
            <p>Training For: {followerProfile.UserProfile.training_for}</p>
            <button onClick={() => removeFollower(followerProfile.follower_id)}>Remove Follower</button>
          </div>
        ))}
      </div>
    </div>
  );
}
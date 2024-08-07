import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import styles from '../../styles/Home.module.css';

export default function Followers() {
  const [profile, setProfile] = useState(null);
  const userId = 1; // Replace with your hard-coded user ID

  useEffect(() => {
    const fetchProfile = async () => {
      let { data: followersProfiles, error } = await supabase
        .from('followers')
        .select(`
          follower_id,
          profile!followers_follower_id_fkey (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching followers profiles:', error);
      } else {
        console.log("Profile:", followersProfiles)
        setProfile(followersProfiles);
      }
    };

    fetchProfile();
  }, []);

  const removeFollower = async (followerId) => {
    const { error } = await supabase
      .from('followers')
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
            <h2>{followerProfile.profile.name}</h2>
            <p>Location: {followerProfile.profile.location_city}, {followerProfile.profile.location_state}</p>
            <p>Training For: {followerProfile.profile.training_for}</p>
            <button onClick={() => removeFollower(followerProfile.follower_id)}>Remove Follower</button>
          </div>
        ))}
      </div>
    </div>
  );
}
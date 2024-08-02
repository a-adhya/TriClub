import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import styles from '../styles/Home.module.css';

export default function Following() {
  const [profile, setProfile] = useState(null);
  const userId = 1; // Replace with your hard-coded user ID

  useEffect(() => {
    const fetchProfile = async () => {
      let { data: followingProfiles, error } = await supabase
        .from('Following')
        .select(`
          following_id,
          UserProfile:User Profile (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching following profiles:', error);
      } else {
        setProfile(followingProfiles);
      }
    };

    fetchProfile();
  }, []);

  const unfollow = async (followingId) => {
    const { error } = await supabase
      .from('Following')
      .delete()
      .eq('user_id', userId)
      .eq('following_id', followingId);

    if (error) {
      console.error('Error unfollowing:', error);
    } else {
      setProfile(profile.filter(following => following.following_id !== followingId));
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Following Profiles</h1>
      <div>
        {profile.map((followingProfile, index) => (
          <div key={index}>
            <h2>{followingProfile.UserProfile.name}</h2>
            <p>Location: {followingProfile.UserProfile.location_city}, {followingProfile.UserProfile.location_state}</p>
            <p>Training For: {followingProfile.UserProfile.training_for}</p>
            <button onClick={() => unfollow(followingProfile.following_id)}>Unfollow</button>
          </div>
        ))}
      </div>
    </div>
  );
}
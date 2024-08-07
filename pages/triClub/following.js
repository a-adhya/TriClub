import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import styles from '../../styles/Home.module.css';

export default function Following() {
  const [profile, setProfile] = useState(null);
  const userId = 1; // Replace with your hard-coded user ID

  useEffect(() => {
    const fetchProfile = async () => {
      let { data: followingProfiles, error } = await supabase
        .from('following')
        .select(`
          following_id,
          profile!following_following_id_fkey (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching following profiles:', error);
      } else {
        console.log("Profile:", followingProfiles)
        setProfile(followingProfiles);
      }
    };

    fetchProfile();
  }, []);

  const removeFollowing = async (followingId) => {
    const { error } = await supabase
      .from('following')
      .delete()
      .eq('user_id', userId)
      .eq('following_id', followingId);

    if (error) {
      console.error('Error removing following:', error);
    } else {
      setProfile(profile.filter(following => following.following_id !== followingId));
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>following Profiles</h1>
      <div>
        {profile.map((followingProfile, index) => (
          <div key={index}>
            <h2>{followingProfile.profile.name}</h2>
            <p>Location: {followingProfile.profile.location_city}, {followingProfile.profile.location_state}</p>
            <p>Training For: {followingProfile.profile.training_for}</p>
            <button onClick={() => removeFollowing(followingProfile.following_id)}>Remove Following</button>
          </div>
        ))}
      </div>
    </div>
  );
}
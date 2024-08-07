import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import styles from '../../../styles/Home.module.css';

export default function EditUserProfile() {
  const [profile, setProfile] = useState({
    name: '',
    training_for: '',
    following: 0,
    followers: 0,
    location_city: '',
    goal: '',
    strava_id: ''
  });
  const userId = 1; // Replace with your hard-coded user ID

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userProfile, error } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) {
        console.error('Error fetching profile:', error);
      } else if (userProfile) {
        // Ensure all fields are defined
        setProfile({
          name: userProfile.name || '',
          training_for: userProfile.training_for || '',
          following: userProfile.following || 0,
          followers: userProfile.followers || 0,
          location_city: userProfile.location_city || '',
          goal: userProfile.goal || '',
          strava_id: userProfile.strava_id || ''
        });
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
      .from('User Profile')
      .update(profile)
      .eq('user_id', userId);

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
      <h1>Edit User Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* <div>
          <label>Profile Picture URL:</label>
          <input
            type="text"
            name="profile_picture"
            value={profile.profile_picture}
            onChange={handleChange}
          />
        </div> */}
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
            name="training_for"
            value={profile.training_for}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Num Following:</label>
          <input
            type="number"
            name="following"
            value={profile.following}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Num Followers:</label>
          <input
            type="number"
            name="followers"
            value={profile.followers}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Based in:</label>
          <input
            type="text"
            name="location_city" // Corrected name attribute
            value={profile.location_city}
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
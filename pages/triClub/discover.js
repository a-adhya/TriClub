import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import styles from '../../styles/Home.module.css';
import Geonames from 'geonames.js';

export default function Discover() {
    // Provide same view as the followers page, but name of person, triathlon they are training for, and location
    // Include a button to follow them
    // Make entire view pressable
    // When pressed, redirect to their profile
    const [locationRange, setLocationRange] = useState(10);
    const [location, setLocation] = useState([]);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [nearbyPlaces, setNearbyPlaces] = useState();
    const [nearbyUsers, setNearbyUsers] = useState();

    const geonames = Geonames({
        username: process.env.NEXT_PUBLIC_GEONAMES_USERNAME,
        lan: 'en',
        encoding: 'JSON',
    })

    const userId = 1

    // Get the user's location from Supabase (city, state)
    // Convert user's location to latitude and longitude
    // Get all cities within specified range of user's location given user's specified radius
    // Get all users within specified range of user's location given user's specified radius
    // Display all users within specified range of user's location given user's specified radius

    const milesToKilometers = (miles) => {
        return miles * 1.60934;
    }

    const fetchLocation = async () => {
        const { data: locationData, error } = await supabase
        .from('profile')
        .select('location_city, location_state')
        .eq('user_id', userId)
        .single()
        if (error) {
            console.error('Error fetching user location:', error);
        } else {
            console.log("Location Data:", locationData)
            setLocation([locationData.location_city, locationData.location_state]);
            
          }
    };

    const convertLocationToLatLng = async () => {
        // Convert the location to latitude and longitude
        try {
        const geocode = await fetch(`https://nominatim.openstreetmap.org/search?q=${location[0]},${location[1]},USA&format=json`);
        const geocodeData = await geocode.json();
        console.log("Geocode Data with city: ", location[0], "and state: ", location[1], "is: ", geocodeData);
            setLatitude(parseFloat(geocodeData[0].lat));
            setLongitude(parseFloat(geocodeData[0].lon));
        } catch (error) {
            console.error('Error converting location to latitude and longitude:', error);
        }
    };

    const fetchNearbyPlaces = async () => {
        // Get all places within 5 miles of the user's location
        try {
        const nearbyPlaces = await geonames.findNearbyPlaceName({
            lat: latitude,
            lng: longitude,
            radius: milesToKilometers(locationRange),
        })
        console.log(nearbyPlaces);
        setNearbyPlaces(nearbyPlaces.geonames);
        } catch (error) {
            console.error('Error fetching nearby places:', error);
        }
    };

    const findNearbyUsers = async () => {
        if (!nearbyPlaces || nearbyPlaces.length === 0) return;

        console.log("Nearby Places:", nearbyPlaces)

        let nearbyLocations = [];
        for (const place of nearbyPlaces) {
            nearbyLocations.push(place.toponymName + ", " + place.adminCode1);
        }

        console.log("Nearby Locations:", nearbyLocations)
    
        try {
        const { data: nearbyUsersData, error: nearbyUsersError } = await supabase
        .from('profile')
        .select('name, location_city, location_state, training_for')

        setNearbyUsers(nearbyUsersData.filter(user => nearbyLocations.includes(user.location_city + ", " + user.location_state)));
        console.log("Nearby Users:", nearbyUsers);
        } catch (error) {
            console.error('Error fetching nearby users:', error);
        }


    
        // if (nearbyUsersError) {
        //     console.error('Error fetching nearby users:', nearbyUsersError);
        // } else {
        //     console.log("Nearby Users:", nearbyUsersData);
        //     setNearbyUsers(nearbyUsersData);
        // }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    useEffect(() => {
        if (location.length > 0) {
            convertLocationToLatLng();
        }
    }, [location]);

    useEffect(() => {
        if (latitude !== 0 && longitude !== 0) {
            fetchNearbyPlaces();
        }
    }, [latitude, longitude, locationRange]);

    useEffect(() => {
        if (nearbyPlaces !== undefined) {
            console.log("Nearby Places:", nearbyPlaces)
            findNearbyUsers();
        }
    }, [nearbyPlaces]);

    return(
        <div>
      <h1>Discover Athletes Near You</h1>
      <div>
        {nearbyUsers && nearbyUsers.map((user, index) => (
          <div key={index}>
            <h2>{user.name}</h2>
                <p>Location: {user.location_city}, {user.location_state}</p>
                <p>Training For: {user.training_for}</p>
          </div>
        ))}
      </div>
    </div>
    )


    



}
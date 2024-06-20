import Head from 'next/head';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import executeStravaLogic from './api/service';

export default function Run() {
    return (
        <div>
            <h1>Run</h1>
        </div>
    )
}
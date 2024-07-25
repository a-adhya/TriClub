import Head from 'next/head';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';


export default function Nav() {
    return (
        <ul>
            <li>
                <Link href="/">Home</Link>
            </li>
            <li>
                <Link href="/run">Run</Link>
            </li>
            <li>
                <Link href="/swim">Swim</Link>
            </li>
            <li>
                <Link href="/bike">Bike</Link>
            </li>
            <li>
                <Link href="/trainer">Trainer</Link>
            </li>
            <li>
                <Link href="/dashboard">Dashboard</Link>
            </li>
        </ul>
    )
}
'use client';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Button from '@mui/material/Button';
import {CLIENT_URL} from '@/constants';

export default function Home() {
  const router = useRouter();

  const [visualizedData, setVisualizedData] = useState(<p></p>);

  function handleClick() {
    router.push(
      `https://discord.com/oauth2/authorize?client_id=1289636085810593803&response_type=code&redirect_uri=${CLIENT_URL}&scope=identify`
    );
  }

  async function getData() {
    try {
      const data = await fetch('/api', {
        method: 'GET',
        headers: {
          Authorization: sessionStorage.getItem('access_token') || '',
        },
      });
      const dataJson = await data.json();
      const username = dataJson['username'];
      const avatar = dataJson['avatar'];
      const id = dataJson['id'];
      setVisualizedData(
        <div>
          <p>{username}</p>
          <Image
            src={`https://cdn.discordapp.com/avatars/${id}/${avatar}`}
            width={128}
            height={128}
            alt="No user data"
          />
        </div>
      );
    } catch (error) {
      console.log('Error fetching: ', error);
      setVisualizedData(
        <div>
          <p>No user data</p>
        </div>
      );
    }
  }

  async function getAccessToken(code: string) {
    try {
      const res = await fetch('/api/access-token?code=' + code);
      const data = await res.json();
      sessionStorage.setItem('access_token', data.access_token);
    } catch (error) {
      console.log('Error fetching: ', error);
    }
  }

  useEffect(() => {
    // Check if the code is in the URL and get the access token from the backend.
    // Access query parameters
    const {searchParams} = new URL(window.location.href);
    const code = searchParams.get('code');

    if (code) {
      getAccessToken(code);
    }
  }, []);

  return (
    <div className={styles.container}>
      <Button onClick={handleClick} variant="outlined">
        Login with Discord
      </Button>
      <Button onClick={getData} variant="outlined">
        Get user data
      </Button>
      {visualizedData}
    </div>
  );
}

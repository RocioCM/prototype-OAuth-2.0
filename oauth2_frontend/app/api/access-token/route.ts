import {CLIENT_URL} from '@/constants';
import {NextRequest, NextResponse} from 'next/server';

// This is called from the discord redirect url
export async function GET(request: NextRequest) {
  // Get the code from the query.
  const {searchParams} = new URL(request.url);
  const code = searchParams.get('code');

  // Get access token and request user data
  if (code) {
    try {
      // Getting acess token
      const tokenResponseData = await fetch(
        'https://discord.com/api/oauth2/token',
        {
          method: 'POST',
          body: new URLSearchParams({
            client_id: process.env.CLIENT_ID ?? '',
            client_secret: process.env.CLIENT_SECRET ?? '',
            code,
            grant_type: 'authorization_code',
            redirect_uri: CLIENT_URL,
            scope: 'identify',
          }).toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const oauthData = await tokenResponseData.json();
      console.log('DATA: ', oauthData);

      if (!oauthData.token_type || !oauthData.access_token) {
        return NextResponse.json(
          {message: 'Error fetching access token'},
          {status: 500}
        );
      }

      const accessToken = `${oauthData.token_type} ${oauthData.access_token}`;
      console.log('TOKEN: ', accessToken);

      return NextResponse.json({access_token: accessToken});
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error
      console.error(error);
      return NextResponse.json(
        {message: 'Error fetching access token'},
        {status: 500}
      );
    }
  }
}

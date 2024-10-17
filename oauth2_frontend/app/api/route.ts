import {NextRequest, NextResponse} from 'next/server';

// This is called from the frontend to get the user data with the access token.
export async function GET(request: NextRequest) {
  // Getting the access token from the header
  const accessToken = request.headers.get('Authorization');
  console.log('Access token: ', accessToken);

  if (!accessToken) {
    return NextResponse.json(
      {message: 'No access token provided'},
      {status: 401}
    );
  }

  try {
    // Requesting user data
    const userResult = await fetch('https://discord.com/api/users/@me', {
      headers: {Authorization: accessToken},
    });
    const data = await userResult.json();
    console.log(data['username']);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {message: 'Error fetching user data'},
      {status: 500}
    );
  }
}

import { cookies } from 'next/headers';
import { env } from '@billing/web/env.mjs';
import { jwtVerify } from 'jose';

const INVALID_RESPONSE = new Response('Invalid token', {
  status: 403,
});

export async function GET(request: Request) {
  const secretKeyBuffer = new Uint8Array(
    Buffer.from(env.JWT_SECRET_KEY, 'base64')
  );

  const cookieStore = cookies();
  const token = cookieStore.get('x-auth-token')?.value;

  if (!token) {
    return INVALID_RESPONSE;
  }

  try {
    const { payload } = await jwtVerify(token, secretKeyBuffer);
    console.log('payload', payload);
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error(err);
    return INVALID_RESPONSE;
  }
}

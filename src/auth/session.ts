import { cookies } from 'next/headers'
import { createLoginSession, getLoginSession } from './auth'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'


export default function session({ name, secret, cookie: cookieOpts }: {name: string, secret: string, cookie: any}) {
    console.log('get session method')
  return async (req: any, ctx: {params?: unknown, cookies: any}, next: () => any) => {
    console.log('init session')
    const cookieStore = cookies();
    const token = cookieStore.get(name)
    let unsealed = {}

    if (token) {
      try {
        // the cookie needs to be unsealed using the password `secret`
        unsealed = await getLoginSession(token.value, secret)
      } catch (e) {
        // The cookie is invalid
      }
    }

    req.session = unsealed

    // We are proxying res.end to commit the session cookie
    const cookie: ResponseCookie = {
        name: 'jwt',
        value: await createLoginSession(req.session, secret),
        httpOnly: true,
        maxAge: cookieOpts.maxAge || 60 * 60,
      }
      ctx.cookies = [];
    ctx.cookies.push(cookie)

    next()
  }
}

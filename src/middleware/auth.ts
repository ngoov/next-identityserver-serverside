import { createEdgeRouter, createRouter } from 'next-connect'
import {initializeOpenIdClient} from '../auth/passport'
import session from '../auth/session'
import { Strategy } from 'openid-client'
import passport from 'passport';
import { NextRequest } from 'next/server'

passport.serializeUser(function (user: any, done) {
    // serialize the username into session
    done(null, user.username)
  })

  passport.deserializeUser(function (req: any, id: any, done: (arg0: null, arg1: { username: string }) => void): void {
    // deserialize the username back into user object
    const user = {username: 'from deserialize'}; //findUserByUsername(req, id)
    done(null, user)
  })

const router = createEdgeRouter<NextRequest, {params?: unknown, cookies: any}>()
console.log('init router')
router
.use(async (req, ctx, next) => {
    console.log('getting session method')
    const props = {
        name: 'sess',
        secret: process.env.TOKEN_SECRET ?? 'changemechangemechangemechangemechangemechangemechangemechangemechangemechangemechangemechangemechangeme',
        cookie: {
          maxAge: 60 * 60 * 8, // 8 hours,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
        },
      };
      console.log('props', props)
    await session(props)(req, ctx, next) as any
}

  )
  .use((req: any, res, next) => {
    // Initialize mocked database
    // Remove this after you add your own database
    console.log('initialize mocked db')
    req.session.users = req.session.users || []
    next()
  })
  .use(async () => {
    console.log('get oidc client')
    const oidcClient = await initializeOpenIdClient();
    var client = new oidcClient({
        client_id: 'm2m',
        client_secret: 'secret',
        redirect_uris: ['http://localhost:3000/login/callback'],
        response_types: ['code']
    });
    passport.use('oidc', new Strategy({client, passReqToCallback: true}, (req, tokenSet, userInfo, done)=>
    {
        console.log("tokenSet",tokenSet);
        console.log("userinfo",userInfo);
            // do whatever you want with tokenset and userinfo
            var { session } = req as any;
        session.tokenSet = tokenSet;
        session.userinfo = userInfo;
        return done(null, tokenSet.claims());
    }));
  })
  .use(passport.initialize() as any)
  .use(passport.session());
export default router;

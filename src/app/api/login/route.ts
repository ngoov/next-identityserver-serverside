import { createEdgeRouter } from 'next-connect';
import auth from '../../../middleware/auth';
import passport from 'passport';
import { NextRequest } from 'next/server';


export const logRequest = (
    req: NextRequest,
    params: unknown,
    next: () => void
  ) => {
    console.log(`${req.method} ${req.url}`);
    return next();
  };
const router = createEdgeRouter<NextRequest, { params?: unknown, cookies: any }>();
router.use(logRequest);
router.use(auth);

router.get((req: any, res: any) =>{
    passport.authenticate('oidc');
});
export async function GET(request: NextRequest, ctx: { params?: unknown, cookies: any }) {
    return router.run(request, ctx);
  }

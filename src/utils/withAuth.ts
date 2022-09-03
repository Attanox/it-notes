import { verifyJWT } from "lib/auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

/**
 * alternative to middleware solution
 *
 * @param getServerSidePropsFn : GetServerSideProps<P>
 * @returns GetServerSideProps<P>
 */
export const withAuth =
  <P extends { [key: string]: any }>(
    getServerSidePropsFn: GetServerSideProps<P>
  ): GetServerSideProps<P> =>
  async (ctx: GetServerSidePropsContext) => {
    const token = ctx.req.cookies?.token;

    if (!token) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }

    // if token is invalid, `verify` will throw an error
    const payload = await verifyJWT(token).catch((err) => {
      console.error(err.message);
    });

    if (!payload) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }

    return getServerSidePropsFn(ctx);
  };

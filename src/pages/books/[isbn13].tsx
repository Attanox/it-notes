import React from "react";
import { trpc } from "../../utils/trpc";
import type { GetServerSideProps } from "next";
import { verifyJwt } from "../../utils/jwt";

type LocalProps = {
  authenticated: boolean;
  user?: string;
};

const BookDetail = ({ authenticated }: LocalProps) => {
  if (!authenticated) {
    return <div>cant be here</div>;
  }

  return <div>BookDetail</div>;
};

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<{ props: LocalProps }> => {
  const token = ctx.req.cookies["token"] || "";

  const authSession = verifyJwt<{ name: string }>(token);

  if (!authSession) {
    return {
      props: {
        authenticated: false,
      },
    };
  }

  return {
    props: {
      authenticated: true,
      user: authSession.name,
    },
  };
};

export default BookDetail;

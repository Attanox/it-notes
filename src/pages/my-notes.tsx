import * as React from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";

import Spinner from "components/Spinner";
import BookList from "components/BookList";
import { trpc } from "utils/trpc";
import { verifyJwt } from "utils/jwt";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{
  authenticated: boolean;
}> = async (ctx) => {
  const token = ctx.req.cookies["token"] || "";

  try {
    const authSession = verifyJwt<{ name: string }>(token);

    if (!authSession) {
      return {
        props: {
          authenticated: false,
        },
      };
    }
  } catch (e) {
    return {
      props: {
        authenticated: false,
      },
    };
  }

  return {
    props: {
      authenticated: true,
    },
  };
};

const MyNotes = ({
  authenticated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const myNotesQuery = trpc.useQuery(["books.my-notes"]);

  if (!authenticated)
    return (
      <div className="text-center">
        Please,{" "}
        <Link href="/login">
          <a className="link">login</a>
        </Link>
        , so you can take notes.
      </div>
    );

  return (
    <>
      <Head>
        <title>IT Notes</title>
        <meta name="description" content="Notes taking app for IT books" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col w-full">
        <div className="w-full h-full">
          <div className="w-full h-5" />
          {myNotesQuery.isLoading ? (
            <div className="w-full min-h-full flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <BookList books={myNotesQuery.data || []} />
          )}
        </div>
      </div>
    </>
  );
};

export default MyNotes;

import type { NextPage } from "next";
import Head from "next/head";
import { useContext } from "react";
import PostBox from "../components/PostBox";
import Feed from "../components/Feed";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY_WITH_LIMIT } from "../graphql/queries";
import CommunityRow from "../components/CommunityRow";
import { ChatContext } from "../chatContext";
import { Jelly } from "@uiball/loaders";

const Home: NextPage = () => {
    const context = useContext(ChatContext);
    const { editor } = context;

    const { data } = useQuery(GET_COMMUNITY_WITH_LIMIT, {
        variables: {
            limit: 10,
        },
    });

    const community: Community[] = data?.getCommunityListByLimit;
    if (!community)
        return (
            <div className="flex, w-full items-center justify-center p-10 text-xl">
                <Jelly size={50} color="purple" />
            </div>
        );
    return (
        <div className="my-5 mx-auto max-w-5xl">
            <Head>
                <title>Chit-Chat</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {editor && <PostBox />}

            <div className="flex">
                <Feed />
                <div className="sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
                    <p className="text-md mb-1 p-4 pb-3 font-bold">
                        Top Communities
                    </p>
                    <div>
                        {community?.map((community, i) => (
                            <CommunityRow
                                topic={community.topic}
                                index={i}
                                //key={community.id}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

//// stepzen start

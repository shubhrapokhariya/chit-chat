import React, { useEffect, useState, useContext } from "react";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    ChatAlt2Icon,
    ClipboardCopyIcon,
    BookmarkIcon,
    DotsHorizontalIcon,
    TrashIcon,
    PencilAltIcon,
} from "@heroicons/react/outline";
import { useForm } from "react-hook-form";
import Avatar from "./Avatar";
import TimeAgo from "react-timeago";
import { PossibleFragmentSpreadsRule } from "graphql";
import Link from "next/link";
import { Jelly } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { GET_ALL_VOTES_BY_POST_ID, GET_ALL_POSTS } from "../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import {
    ADD_VOTE,
    DELETE_VOTES,
    DELETE_COMMENTS,
    DELETE_POST,
} from "../graphql/mutations";
import { useRouter } from "next/router";

type Props = {
    post: Post;
};

function Post({ post }: Props) {
    const router = useRouter();
    const [vote, setVote] = useState<boolean>();
    const { data: session } = useSession();
    const [display, setDisplay] = useState(false);

    const { data, loading, error } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
        variables: {
            post_id: post?.id,
        },
    });
    console.log(data);
    const [addVote] = useMutation(ADD_VOTE, {
        refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVotesByPostId"],
    });

    const [removeVotes] = useMutation(DELETE_VOTES);
    const [removeComments] = useMutation(DELETE_COMMENTS);
    const [removePost] = useMutation(DELETE_POST, {
        refetchQueries: [GET_ALL_POSTS, "getPostList"],
    });

    const removingPost = async () => {
        if (!session) {
            toast(" You'll need to sign in to delete a post!");
            return;
        }
        await removeVotes({
            variables: {
                post_id: post.id,
            },
        });
        await removeComments({
            variables: {
                post_id: post.id,
            },
        });
        await removePost({
            variables: {
                id: post?.id,
            },
        });
        router.push(`/`);
    };

    const upVote = async (isUpvote: boolean) => {
        if (!session) {
            toast(" You'll need to sign in to vote!");
            return;
        }
        if (vote && isUpvote) return;
        if (vote === false && !isUpvote) return;
        console.log("voting...", isUpvote);

        await addVote({
            variables: {
                post_id: post.id,
                username: session.user?.name,
                upvote: isUpvote,
            },
        });
    };

    useEffect(() => {
        const votes: Vote[] = data?.getVotesByPostId;
        const vote = votes?.find(
            (vote) => vote.username === session?.user?.name
        )?.upvote;
        setVote(vote);
    }, [data]);

    const displayVotes = (data: any) => {
        const votes: Vote[] = data?.getVotesByPostId;
        const displayNumber = votes?.reduce(
            (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
            0
        );
        if (votes?.length === 0) return 0;
        if (displayNumber === 0) {
            return votes[0]?.upvote ? 1 : -1;
        }
        return displayNumber;
    };

    /// display edit / del btn/

    const clickHandler = () => {
        setDisplay(true);
    };

    if (loading)
        return (
            <div className="flex, w-full items-center justify-center p-10 text-xl">
                <Jelly size={50} color="purple" />
            </div>
        );
    if (error)
        return (
            <div className="flex, w-full items-center justify-center p-10 text-xl">
                {`Submission error! ${error.message}`}
            </div>
        );
    return (
        <Link href={`/post/${post?.id}`}>
            <div className="flex cursor-pointer rounded-md  border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600">
                {/* votes */}
                <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
                    <ArrowUpIcon
                        onClick={() => upVote(true)}
                        className={`voteButtons hover:text-red-400 ${
                            vote && "text-red-400"
                        }`}
                    />
                    <p className="text-xs font-bold text-black">
                        {displayVotes(data)}
                    </p>
                    <ArrowDownIcon
                        onClick={() => upVote(false)}
                        className={`voteButtons hover:text-blue-400 ${
                            vote === false && "text-blue-400"
                        }`}
                    />
                </div>
                <div className="p-3 pb-1">
                    {/* Header */}
                    <div className="relative flex items-center space-x-2">
                        {/* <Avatar seed={post.community[0]?.topic} /> */}
                        <Avatar seed={post.username} />
                        <p className="text-xs text-gray-400">
                            <Link
                                href={`/community/${post.community[0]?.topic}`}
                            >
                                <span className="text-bold font-bold hover:text-blue-400 hover:underline">
                                    {post.community[0]?.topic}
                                </span>
                            </Link>
                            . Posted by
                            {post.username} <TimeAgo date={post.created_at} />
                        </p>
                        {!display ? (
                            <div
                                onClick={clickHandler}
                                className="  absolute top-1 right-0 flex  rounded-md p-2 text-sm hover:bg-gray-100"
                            >
                                <DotsHorizontalIcon className="   h-6 w-6 text-gray-400" />
                                <p className="hidden  sm:inline"></p>
                            </div>
                        ) : (
                            <div className=" absolute top-1 right-0  ">
                                <div className="postButtons text-gray-400">
                                    <PencilAltIcon className="h-6 w-6  " />
                                    edit
                                </div>
                                <div
                                    onClick={removingPost}
                                    className="postButtons text-gray-400"
                                >
                                    <TrashIcon className="h-6 w-6 " />
                                    delete
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Body */}
                    <div className="py-4">
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p className="mt-2 text-sm font-light">{post.body}</p>
                    </div>
                    {/* Image */}
                    <img className="w-full" src={post.image} alt={post.title} />
                    {/* Footer */}
                    <div className="flex space-x-4 text-gray-400">
                        <div className="postButtons">
                            <ChatAlt2Icon className="h-6 w-6" />
                            <p className="">
                                {post.comments.length}{" "}
                                <span className="hidden sm:inline">
                                    Comments
                                </span>
                            </p>
                        </div>

                        <div className="postButtons">
                            <BookmarkIcon className="h-6 w-6" />
                            <p className="hidden sm:inline">Save</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default Post;

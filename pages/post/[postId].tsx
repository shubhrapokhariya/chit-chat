import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GET_POST_BY_POST_ID } from "../../graphql/queries";
import { ADD_COMMENT } from "../../graphql/mutations";
import Post from "../../components/Post";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Avatar from "../../components/Avatar";
import TimeAgo from "react-timeago";
import { Jelly } from "@uiball/loaders";

type FormData = {
    comment: String;
};

const PostPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [addComment] = useMutation(ADD_COMMENT, {
        refetchQueries: [GET_POST_BY_POST_ID, "getPostListByPostId"],
    });
    /// it also return loading and error with data
    const { data, loading, error } = useQuery(GET_POST_BY_POST_ID, {
        variables: { post_id: router.query.postId },
    });
    const post: Post = data?.getPostListByPostId;
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = handleSubmit(async (formData) => {
        const notification = toast.loading("Posting your comment");
        await addComment({
            variables: {
                post_id: router.query.postId,
                username: session?.user?.name,
                text: formData.comment,
            },
        });
        setValue("comment", "");
        toast.success("Comment Successfully Posted!", {
            id: notification,
        });
    });

    return (
        <>
            {loading ? (
                <div className="flex, w-full items-center justify-center p-10 text-xl">
                    <Jelly size={50} color="purple" />
                </div>
            ) : error ? (
                <div className="flex, w-full items-center justify-center p-10 text-xl">
                    {`Submission error! ${error.message}`}
                </div>
            ) : !post ? (
                <div className="p-10 ">
                    <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center space-x-4 bg-purple-50 pb-3 text-xl">
                        <div className="-mt-20 pl-10">
                            <p className="pb-10 text-4xl font-extrabold text-purple-500">
                                404
                            </p>
                            <p className="italic">Oops! </p>
                            <p className="italic">
                                Looks like the page is gone...
                            </p>
                        </div>
                        <div>
                            <img src="https://images.pexels.com/photos/3687957/pexels-photo-3687957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mx-auto my-7 max-w-5xl">
                    <Post post={post} />

                    <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
                        <p>
                            Comment as{" "}
                            <span className="text-pink-500">
                                {session?.user?.name}
                            </span>
                        </p>
                        <form
                            onSubmit={onSubmit}
                            className="flex  flex-col space-y-2"
                        >
                            <textarea
                                {...register("comment")}
                                disabled={!session}
                                className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
                                placeholder={
                                    session
                                        ? `What are your thoughts?`
                                        : `Please sign in to comment`
                                }
                            ></textarea>
                            <button
                                disabled={!session}
                                className="rounded-full bg-pink-500 p-3 font-semibold text-white disabled:bg-gray-200"
                                type="submit"
                            >
                                Comment
                            </button>
                        </form>
                    </div>
                    <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10">
                        <hr className="py-2" />

                        {post?.comments.map((comment) => (
                            <div
                                className="relative flex items-center space-x-2 space-y-5"
                                key={comment.id}
                            >
                                <hr className="absolute top-10 left-7 z-0 h-16 border" />
                                <div className="z-50">
                                    <Avatar seed={comment.username} />
                                </div>
                                <div className="flex flex-col">
                                    <p className="py-2 text-xs text-gray-400">
                                        <span className="font-semibold text-gray-600">
                                            {comment.username}
                                        </span>
                                        <TimeAgo date={comment.created_at} />
                                    </p>
                                    <p className="">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default PostPage;

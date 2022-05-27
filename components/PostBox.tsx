import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Avatar from "./Avatar";
import { PhotographIcon } from "@heroicons/react/outline";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_POST, ADD_COMMUNITY } from "../graphql/mutations";
import { GET_ALL_POSTS, GET_COMMUNITY_LIST_BY_TOPIC } from "../graphql/queries";
import { client } from "../apollo-client";
import toast from "react-hot-toast";

type FormData = {
    postTitle: String;
    postBody: String;
    postImage: String;
    community: String;
};

type Props = {
    community?: string;
};

const PostBox = ({ community }: Props) => {
    const { data: session } = useSession();
    const [addPost] = useMutation(ADD_POST, {
        refetchQueries: [GET_ALL_POSTS, "getPostList"],
    });
    const [addCommunity] = useMutation(ADD_COMMUNITY);

    const [imageBoxOpen, setImageBoxOpen] = useState(false);
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = handleSubmit(async (formData) => {
        const notification = toast.loading("Creating new post...");
        try {
            const {
                data: { getCommunityListByTopic },
            } = await client.query({
                query: GET_COMMUNITY_LIST_BY_TOPIC,
                variables: { topic: community || formData.community },
            });
            const communityExists = getCommunityListByTopic.length > 0;
            if (!communityExists) {
                /// CREATE COMMUNITY

                const {
                    data: { insertCommunity: newCommunity },
                } = await addCommunity({
                    variables: {
                        topic: formData.community,
                    },
                });

                const image = formData.postImage || "";
                const {
                    data: { insertPost: newPost },
                } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        community_id: newCommunity.id,
                        title: formData.postTitle,
                        username: session?.user?.name,
                    },
                });
            } else {
                // use existing community

                const image = formData.postImage || "";

                const {
                    data: { insertPost: newPost },
                } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        community_id: getCommunityListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name,
                    },
                });
            }
            /// after the post has been added
            setValue("postBody", "");
            setValue("postImage", "");
            setValue("postTitle", "");
            setValue("community", "");

            toast.success("New Post Created!", { id: notification });
        } catch (error) {
            toast.error("Whoops something went wrong!", { id: notification });
        }
    });

    return (
        <form
            onSubmit={onSubmit}
            className="sticky top-20 z-50 rounded-md border border-gray-300 bg-white p-2"
        >
            <div className="flex items-center space-x-3">
                <Avatar />
                <input
                    {...register("postTitle", { required: true })}
                    disabled={!session}
                    className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
                    type="text"
                    placeholder={
                        session
                            ? community
                                ? `Create a post in ${community}`
                                : `Create a post by entering a title`
                            : `Signin to post`
                    }
                />

                <PhotographIcon
                    onClick={() => setImageBoxOpen(!imageBoxOpen)}
                    className={`h-6 cursor-pointer text-gray-300 ${
                        imageBoxOpen && `text-blue-300`
                    }`}
                />
            </div>
            {!!watch("postTitle") && (
                <div className="flex flex-col py-2">
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Body</p>
                        <input
                            className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                            {...register("postBody")}
                            type="text"
                            placeholder="Text(optional)"
                        />
                    </div>
                    {!community && (
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Community</p>
                            <input
                                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                                {...register("community", { required: true })}
                                type="text"
                                placeholder="i.e. React Form"
                            />
                        </div>
                    )}

                    {imageBoxOpen && (
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Image URL</p>
                            <input
                                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                                {...register("postImage")}
                                type="text"
                                placeholder="Optional"
                            />
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="space-y-2 p-2 text-red-500">
                            {errors.postTitle && (
                                <p> A Post Title is required</p>
                            )}
                            {errors.community && (
                                <p> A Community is required</p>
                            )}
                        </div>
                    )}

                    {!!watch("postTitle") && (
                        <button
                            type="submit"
                            className="w-full rounded-full bg-blue-400 p-2 text-white"
                        >
                            Create Post
                        </button>
                    )}
                </div>
            )}
        </form>
    );
};

export default PostBox;

import Image from "next/image";
import React, { useState, useContext } from "react";
import { PlusSmIcon } from "@heroicons/react/outline";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ChatContext } from "../chatContext";

const Header = () => {
    const { data: session } = useSession();
    const context = useContext(ChatContext);
    const { AddPostHandler } = context;

    return (
        <div className=" sticky top-0 z-50 flex  items-center bg-white px-4 py-2 shadow-sm">
            <div className="relative h-10 w-20   flex-shrink-0 cursor-pointer">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        layout="fill"
                        objectFit="contain"
                        alt="logo"
                    />
                </Link>
            </div>
            <Link href="/">
                <p className="cursor-pointer font-serif text-xl font-bold italic text-purple-600">
                    {" "}
                    Chit-Chat
                </p>
            </Link>
            <div className="flex-1"></div>

            <div className="  items-center space-x-2 text-gray-500 lg:inline-flex">
                <PlusSmIcon className="icon" onClick={AddPostHandler} />
            </div>

            {session ? (
                <div
                    onClick={() => signOut()}
                    className=" cursor-pointer items-center border border-gray-100 p-2 lg:flex"
                >
                    <div className="relative h-5 w-5 flex-shrink-0">
                        <Image
                            src="https://hashtagcryptoinfo.com/api/image/chit-chat-signin"
                            layout="fill"
                            objectFit="contain"
                            alt="signin"
                        />
                    </div>
                    <div className="flex-1 text-xs">
                        <p className="truncate">Logout</p>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => signIn()}
                    className="hidden cursor-pointer items-center border border-gray-100 p-2 lg:flex"
                >
                    <div className="relative h-5 w-5 flex-shrink-0">
                        <Image
                            src="https://hashtagcryptoinfo.com/api/image/chit-chat-signin"
                            layout="fill"
                            objectFit="contain"
                            alt="signin"
                        />
                    </div>
                    <p className="text-gray-400">Sign In</p>
                </div>
            )}
        </div>
    );
};

export default Header;
///2560*883
// Shubohit@$$99

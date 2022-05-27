import React from "react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import Avatar from "./Avatar";
import Link from "next/link";

type Props = {
    topic: string;
    index: number;
};

const CommunityRow = ({ index, topic }: Props) => {
    return (
        <div className="flex items-center space-x-2 border-t bg-white px-4 py-2 last:rounded-b">
            <p>{index + 1}</p>

            <Avatar seed={`/community/${topic}`} />
            <p className="flex-1 truncate">{topic}</p>
            <Link href={`/community/${topic}`}>
                <div className="cursor-pointer rounded-full bg-purple-500 px-3 text-white">
                    View
                </div>
            </Link>
        </div>
    );
};

export default CommunityRow;

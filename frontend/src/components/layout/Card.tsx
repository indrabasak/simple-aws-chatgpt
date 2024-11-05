import React from 'react';
import useChatStore from "../../store/chat-store";

const Card: React.FC<{ question: string }> = ({question}) => {

    const setRequest = useChatStore((state) => state.setRequest);
    const setProcessing = useChatStore((state) => state.setProcessing);
    const setResponse = useChatStore((state) => state.setResponse);

    function handleClick(question: string) {
        console.log(question);
        setRequest(question);
        setProcessing(true);

        setTimeout(() => {
            setResponse("Lorem,ipsum dolor sit amet consectetur adipisicing elit. facere, laboriosam nemo deleniti voluptas possimus, . Rerum esse ullam debitis fuga assumenda impedit nulla neque libero, totam expedita dolor inventore ad quos labore asperiores at! Beatae impedit nulla quidem dolorem vitae vero, itaque earum nobis, quo tempora tenetur tempore ad ea distinctio deserunt magnam debitis eaque nam perferendis explicabo in. Molestias voluptatum aspernatur facilis dolorum. Eius voluptate minima, recusandae");
        }, 5000);
    }

    return (
        <>
            <div onClick={() => handleClick(question)}
                 className="px-4 pt-4 pb-10 flex flex-col rounded-xl border bg-white border-gray-100 shadow-md hover:scale-110 transition-transform  duration-300 flex-1 cursor-pointer">
                <p className="text-sm font-light"> {question}</p>
            </div>
        </>
    );
}

export default Card;
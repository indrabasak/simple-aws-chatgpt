import React from 'react';

const Card: React.FC<{ question: string }> = ({question}) => {
    return (
        <>
            <div
                //               onClick={() => handleClick(question)}
                className="px-4 pt-4 pb-10 flex flex-col rounded-xl border bg-white border-gray-100 shadow-md hover:scale-110 transition-transform  duration-300 flex-1 cursor-pointer"
            >
                <p className="text-sm font-light"> {question}</p>
            </div>
        </>
    );
}

export default Card;
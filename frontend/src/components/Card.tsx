import React from 'react';
import useChatStore from '../store/chat-store';

interface CardProps {
  question: string;
}

const Card: React.FC<CardProps> = ({ question }) => {
  const setValue = useChatStore((state) => state.setValue);
  const setIsTyping = useChatStore((state) => state.setIsTyping);

  const handleClick = (cardQuestion: string) => {
    setValue(cardQuestion);
    setIsTyping(true);
  };

  return (
    <>
      <div
        onClick={() => handleClick(question)}
        className="px-4 pt-4 pb-10 flex flex-col rounded-xl border bg-gray-200 border-gray-200 flex-1 cursor-pointer hover:bg-white hover:border-white hover:shadow-lg transition-all duration-300"
      >
        <p className="text-sm font-light"> {question}</p>
      </div>
    </>
  );
};

export default Card;

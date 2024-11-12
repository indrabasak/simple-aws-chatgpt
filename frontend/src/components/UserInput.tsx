import React, { ChangeEvent, KeyboardEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faLifeRing } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import useChatStore from '../store/chat-store';

const SearchBar: React.FC = () => {
  const value = useChatStore((state) => state.value);
  const setValue = useChatStore((state) => state.setValue);

  const setIsGeneratingResponse = useChatStore(
    (state) => state.setIsGeneratingResponse,
  );
  const setResponse = useChatStore((state) => state.setResponse);
  const setRequest = useChatStore((state) => state.setRequest);
  const responses = useChatStore((state) => state.responses);
  const hasResponse = useChatStore((state) => state.hasResponse);
  const setHasResponse = useChatStore((state) => state.setHasResponse);
  const isTyping = useChatStore((state) => state.isTyping);
  const setIsTyping = useChatStore((state) => state.setIsTyping);
  const showExamples = useChatStore((state) => state.showExamples);
  const toggleShowExamples = useChatStore((state) => state.toggleShowExamples);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputVal = e.target.value;
    setValue(inputVal);
    setIsTyping(inputVal.length > 0);
  };

  const handleSubmit = async (
    event:
      | KeyboardEvent<HTMLTextAreaElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (
      (event as KeyboardEvent<HTMLTextAreaElement>).key === 'Enter' ||
      (event as React.MouseEvent<HTMLButtonElement>).type === 'click'
    ) {
      event.preventDefault();
      setValue('');
      if (value.trim()) {
        setIsGeneratingResponse(true);
        setIsTyping(false);
        setRequest(value);

        if (showExamples) {
          toggleShowExamples();
        }
        const index = responses.length;

        try {
          const response = await axios.post(
            'https://js3daviy23.execute-api.us-west-2.amazonaws.com/dev/v1/insight',
            {
              question: value,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          console.log('API response:', response);
          setResponse(index, response.data || 'No response from API');
        } catch (error) {
          console.error('Error fetching data:', error);
          setResponse(index, 'Error fetching data');
        } finally {
          setHasResponse(true);
          setIsGeneratingResponse(false);
        }
      }
    }
  };

  return (
    <>
      <div className="flex w-[90%] lg:w-[70%] xl:w-[35%] fixed bottom-0 bg-gray-200 mx-auto items-center justify-center py-2 px-3 mb-10">
        <textarea
          onChange={handleChange}
          onKeyDown={handleSubmit}
          value={value}
          className="w-full bg-transparent outline-none p-2 resize-none h-10"
          placeholder="Type a SAGE question"
        />
        <button
          type="button"
          onClick={toggleShowExamples}
          disabled={!hasResponse}
          data-tooltip-id="tooltip"
          data-tooltip-content={hasResponse ? 'Show Examples' : ''}
          className={`flex cursor-pointer h-10 w-11 justify-center items-center rounded-full transform transition-all duration-300 ease-in-out ${!hasResponse ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <FontAwesomeIcon icon={faLifeRing} />
        </button>
        <div className="border-l border-gray-400 h-6 mx-2"></div>
        <button
          onClick={handleSubmit}
          disabled={!isTyping}
          data-tooltip-id="tooltip"
          data-tooltip-content={isTyping ? ' Send' : ''}
          className={`flex cursor-pointer h-10 w-11 justify-center items-center rounded-full transform transition-all duration-300 ease-in-out ${!isTyping ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        <Tooltip id="tooltip" place="top" />
      </div>
    </>
  );
};

export default SearchBar;

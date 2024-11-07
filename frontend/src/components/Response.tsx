import React from 'react';
import { BarLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import useChatStore from '../store/chat-store';

interface ResponseItem {
  id?: string;
  request: string;
  response: string | null;
}

const Response: React.FC = () => {
  const responses = useChatStore((state) => state.responses as ResponseItem[]);

  return (
    <div className="mt-8 overflow-y-auto h-[77vh]">
      {responses.map((curr, index) => (
        <div key={curr.id || index}>
          <div className="max-w-4xl mx-auto py-3 lg:px-3 flex justify-end">
            <div className="bg-gray-100 p-3 rounded-xl mr-3">
              {curr.request}
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-3 py-3 mt-2 lg:px-3 lg:mt-2 flex gap-2 pb-10 justify-start">
            <div className="text-center">
              <FontAwesomeIcon icon={faRobot} />
            </div>

            <div className="text-justify bg-gray-100 p-6 rounded-xl whitespace-pre-wrap">
              {curr.response ? <>{curr.response}</> : <BarLoader />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Response;

import React, { useState } from 'react';
import Navbar from './Navbar';
import Response from './Response';
import Card from './Card';
import SearchBar from './UserInput';
import logo from '../assets/sage-logo.png';
import useChatStore from '../store/chat-store';

const ChatUI: React.FC = () => {
  const [width, setWidth] = useState<boolean>(false);
  const [openSection, setOpenSection] = useState<number | null>(1);
  const isGeneratingResponse = useChatStore(
    (state) => state.isGeneratingResponse,
  );
  const showExamples = useChatStore((state) => state.showExamples);
  const hasResponse = useChatStore((state) => state.hasResponse);
  const [questions, setQuestions] = useState<string[]>([
    'List the source and destinations of failed events?',
    'How many events are there today?',
    'What is the status of sage id <SAGE-ID>?',
    'How many events of type offering exists in last 7 days?',
    'How many failed events are today?',
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-40 overflow-hidden">
      <Navbar />
      <div className="flex justify-center items-center mt-16">
        {' '}
        <div className="container max-w-[1360px] mx-auto p-4 flex divide-x divide-gray-300/50">
          {/* Sidebar Container */}

          <div className="w-1/5 p-4">
            {/* App Name */}
            <div className="divide-y divide-gray-300/50">
              <div className="pb-4 flex items-center justify-center ext-gray-200">
                <a
                  href="#"
                  onClick={() => window.location.reload()}
                  className="flex gap-2 items-center flex-1"
                >
                  <img src={logo} className="h-10" />
                  <span className="font-medium"></span>
                </a>
              </div>
              {/* Links Section */}
              <div className="mt-4 px-4">
                <div className="flex justify-between items-center pt-8">
                  <span className="text-sm font-sans font-semibold text-gray-500">
                    QUICK LINKS
                  </span>
                </div>
                <div className="flex justify-between items-center pt-6">
                  <a className="text-sm font-sans text-gray-600 cursor-pointer">
                    Sage Overview
                  </a>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <a className="text-sm font-sans text-gray-600 cursor-pointer">
                    Sage Architecture
                  </a>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <a className="text-sm font-sans text-gray-600 cursor-pointer">
                    Sage Event Schema
                  </a>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <a className="text-sm font-sans text-gray-600 cursor-pointer">
                    About Sage Insight
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* App Container */}
          <div className="w-3/4 p-4">
            <div className="h-screen flex flex-col transition-all duration-500 ease-in-out">
              <div className="w-full h-full mx-auto px-6 py-12 mt-2 lg:px-6 overflow-y-hidden">
                {(isGeneratingResponse || hasResponse) && !showExamples ? (
                  <>
                    <Response />
                  </>
                ) : (
                  showExamples && (
                    <div className="flex max-w-7xl mx-auto justify-center mt-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-2xl">
                        {questions.map((question, index) => {
                          return <Card key={index} question={question} />;
                        })}
                      </div>
                    </div>
                  )
                )}
                <div className="flex max-w-7xl mx-auto items-center justify-center w-full sticky bottom-0 z-2">
                  <SearchBar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;

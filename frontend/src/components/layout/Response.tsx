import React from "react";
import TypeWriterEffect from 'react-typewriter-effect';
import useChatStore from "../../store/chat-store";
import {SyncLoader} from "react-spinners";
import logo from '../../assets/autodesk-symbol-white.png';

const Response: React.FC = () => {
    const history = useChatStore((state) => state.history);

    return (
        <div className="overflow-y-auto h-[79vh]  " >
            { history.map((curr, index) => (
                <div key={index} className="flex gap-2 items-center p-4">
                    <div className="max-w-2xl mx-auto py-3 lg:px-3 flex justify-end">
                        <div className="bg-gray-100 p-3 rounded-xl mr-3">
                            {curr.request}
                        </div>
                        <div className="bg-gray-300 rounded-full text-center h-12 w-12 px-2 py-3 flex-shrink-0">
                            U
                        </div>
                    </div>
                    <div className="max-w-2xl mx-auto px-3 py-3 mt-2 lg:px-3 lg:mt-2 flex gap-6 pb-10 justify-start">
                        <div className="rounded-full text-center h-12 w-12 bg-black py-3 px-3 flex-shrink-0">
                            <img src={logo} alt=""/>
                        </div>
                        <div className="mr-6 text-justify bg-gray-100 p-6 rounded-xl ">
                            {curr.response ? (<TypeWriterEffect
                                startDelay={100}
                                cursorColor="black"
                                text={curr.response}
                                typeSpeed={20}
                                hideCursorAfterText={true}/>) : <SyncLoader/>}
                        </div>
                    </div>
                </div>
            ))};
        </div>
    );
}

export default Response;
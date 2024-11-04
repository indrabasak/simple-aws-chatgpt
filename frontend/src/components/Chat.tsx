import React, {useState} from 'react';
import Navbar from './layout/Navbar';
import Card from './layout/Card';

const Chat: React.FC = () => {
    const [width, setWidth] = useState(false);

    const adjustWidth = () => {
        setWidth(!width);
    };

    const [questions, setQuestions] = useState([
        "Explain me Product Delivery Excellence like I am a 5 year old kid?",
        "Can you tell me something about ESAE Services Engineering Team?",
        "Explain me how many teams work under ESAE?",
        "I am a new at Autodesk, Explain me the onboarding steps.",
    ]);
 return (
        <div>
            <Navbar />
            <div className="h-screen flex ">
                <div
                    className={` ${
                        width ? " w-[15%]" : "w-[4%]"
                    } left bg-gray-50 h-full flex flex-col transition-all duration-500 ease-in-out `}
                >
                    <div className="px-4 py-3 text-2xl mt-20">
                        <button onClick={adjustWidth}>
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    </div>
                </div>
                <div
                    className={` ${
                        width ? "w-[85%]" : "w-[96%]"
                    } flex flex-col transition-all duration-500 ease-in-out`}
                >
                    <div
                        className="bg-blue-100 w-[90%] py-4  mx-auto mt-14 border border-blue-300 rounded-lg flex justify-center">
                        <p className="font-medium  font-chat">
                            Disclaimer: Response by Knowledge Centre (KC) is AI Generated & can be incorrect sometimes.
                        </p>
                    </div>
                    <div className="w-full h-full mx-auto px-6 py-1 mt-16 lg:px-6  ">
                        {/*{isGeneratingResponse ? (*/}
                        {/*    <>*/}
                        {/*        <Response/>*/}
                        {/*    </>*/}
                        {/*) : (*/}
                            <>
                                <div className="max-w-7xl mx-auto px-3 py-3 mt-22   justify-center items-center flex  ">
                                    {/*<img src={logo} alt="" className="lg:h-20 h-12"/>*/}
                                </div>

                                {/*<Greeting username="Vishal"/>*/}

                                <div className="flex max-w-7xl mx-auto  justify-center mt-10">
                                    <div className="flex flex-col md:flex-row max-w-2xl gap-3 ">
                                        {questions.map((question, index) => {
                                            return <Card key={index} question={question}/>;
                                        })}
                                    </div>
                                </div>
                            </>
                        {/*)}*/}

                        {/*<div className="flex max-w-7xl mx-auto items-center justify-center w-full sticky bottom-0 z-2 ">*/}
                        {/*    <SearchBar/>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
 );
}

export default Chat;
import { create } from 'zustand';

interface Response {
  request: string;
  response: string | null;
}

interface ChatState {
  value: string;
  setValue: (newValue: string) => void;
  isGeneratingResponse: boolean;
  setIsGeneratingResponse: (newVal: boolean) => void;
  responses: Response[];
  setRequest: (request: string) => void;
  setResponse: (index: number, response: string) => void;
  cardData: string;
  setCardData: (newVal: string) => void;
  isTyping: boolean;
  setIsTyping: (newVal: boolean) => void;
  showExamples: boolean;
  toggleShowExamples: () => void;
  hasResponse: boolean;
  setHasResponse: (newVal: boolean) => void;
}

const useChatStore = create<ChatState>((set) => ({
  value: '',
  setValue: (newValue) => set((state) => ({ value: newValue })),
  isGeneratingResponse: false,
  setIsGeneratingResponse: (newVal) =>
    set(() => ({ isGeneratingResponse: newVal })),
  responses: [],
  setRequest: (request) =>
    set((state) => ({
      responses: [...state.responses, { request: request, response: null }],
    })),
  setResponse: (index, response) =>
    set((state) => {
      const prevData = [...state.responses];
      prevData[index].response = response;
      return { responses: prevData };
    }),
  cardData: '',
  setCardData: (newVal) => set(() => ({ cardData: newVal })),
  isTyping: false,
  setIsTyping: (newVal) => set(() => ({ isTyping: newVal })),
  showExamples: true,
  toggleShowExamples: () =>
    set((state) => ({ showExamples: !state.showExamples })),
  hasResponse: false,
  setHasResponse: (newVal) => set(() => ({ hasResponse: newVal })),
}));

export default useChatStore;

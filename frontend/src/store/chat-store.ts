import { create } from 'zustand'

interface StoreState {
    question: string;
    setQuestion: (newQuestion: string) => void;
    getQuestion: () => string;

    processing: boolean;
    setProcessing: (newProcessing: boolean) => void;
    isProcessing: () => boolean;

    history: ({ request: string; response: string; })[];
    clearHistory: () => void;
    setRequest: (request: string) => void;
    setResponse: (response: string) => void;
}

const useChatStore = create<StoreState>((set, get) => ({
    question: '',
    setQuestion: (newQuestion: string) => set({ question: newQuestion }),
    getQuestion: () => get().question,

    processing: false,
    setProcessing: (newProcessing: boolean) => set({ processing: newProcessing }),
    isProcessing: () => get().processing,

    history: [],
    clearHistory: () => set({ history: [] }),
    setRequest: (request: string) => set((state) => ({ history: [...state.history, { request: request, response: '' }] })),
    setResponse: (response: string) => set((state) => {
        const prevData: any = [...state.history];
        const index: number = prevData.length;
        prevData[index] = { ...prevData[index], response: response };
        return { history: prevData };
    }),
}));

export default useChatStore;

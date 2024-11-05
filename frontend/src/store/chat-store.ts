import { create } from 'zustand'

interface StoreState {
    processing: boolean;
    setProcessing: (newProcessing: boolean) => void;
    isProcessing: () => boolean;

    history: ({ request: string; response: null|string; })[];
    clearHistory: () => void;
    setRequest: (request: string) => void;
    setResponse: (response: string) => void;
}

const useChatStore = create<StoreState>((set, get) => ({
    processing: false,
    setProcessing: (newProcessing: boolean) => set({ processing: newProcessing }),
    isProcessing: () => get().processing,

    history: [],
    clearHistory: () => set({ history: [] }),
    setRequest: (request: string) => set((state) => ({
        history: [...state.history, { request: request, response: null }]
    })),
    setResponse: (response: string) => set((state) => {
        console.log('------------- setResponse --------------');
        const prevData: any = [...state.history];
        const index: number = prevData.length;
        prevData[index - 1] = { ...prevData[index - 1], response: response };
        return { history: prevData };
    }),
}));

export default useChatStore;

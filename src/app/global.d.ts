declare global {
  interface Window {
    addTransactionToast: (title: string, txId: string) => Promise<void>;
  }
}

export {};

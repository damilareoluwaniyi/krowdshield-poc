declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_USE_MOCK_DATA: string;
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

export {};
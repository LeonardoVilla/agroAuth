import 'dotenv/config';

export default () => ({
  expo: {
    name: "MeuApp",
    slug: "meuapp",
    version: "1.0.0",
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  },
});

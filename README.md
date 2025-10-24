# 💬 AI Chat App (Next.js + tRPC + Supabase + Tailwind)

A modern full-stack chat application built with **Next.js 14 (App Router)**, **tRPC**, **Supabase**, and **Tailwind CSS**.  
It features user authentication, model-based AI chat simulation, chat history, timestamps and persistent storage.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 14 + React + Tailwind CSS  
- **Backend:** tRPC + Supabase (PostgreSQL)  
- **Auth:** Supabase Auth (Email & Password only)  
- **Database:** Supabase (Hosted Postgres)  
- **Language:** TypeScript  

---

## 📦 Features

✅ Email/Password Authentication (Supabase Auth)  
✅ Chat Window with message history per model  
✅ “Clear Chat” functionality  
✅ AI responses (echo-based via tRPC)  
✅ Timestamped messages  
✅ Typing/loading animations  
✅ Model switching with filtered history  
✅ Mobile-responsive UI (Light Theme)

---

## 🧰 Prerequisites

Before you begin, make sure you have:

- **Node.js ≥ 18**
- **npm** or **yarn**
- A **Supabase project** (free tier works fine)

---

## ⚙️ 1. Clone & Install

git clone https://github.com/your-username/ai-chat-app.git
cd ai-chat-app
npm install

🔑 2. Environment Variables
Create a .env.local file in the project root and add the following:


NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # optional, if needed for server ops
⚠️ Never commit .env.local — it should stay private.
All secrets are loaded locally and used safely via environment variables.

🗄️ 3. Database Setup
In your Supabase SQL Editor, run the following commands to create the required tables:

🧍‍♂️ models Table
sql
Copy code
create table models (
  id uuid primary key default uuid_generate_v4(),
  tag text not null unique
);
Add some example rows:

sql
Copy code
insert into models (tag) values ('BERT'), ('RoBERTa'), ('DistilBERT');
💬 messages Table
sql
Copy code
create table messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id),
  model_tag text not null,
  role text check (role in ('user', 'ai')) not null,
  content text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
💡 Make sure created_at is of type timestamptz for accurate timezone handling.

🧩 4. Run Supabase Auth (Email Only)
By default, Supabase enables multiple providers (Google, GitHub, etc.).
To allow only Email + Password, go to:

Supabase Dashboard → Authentication → Providers → Disable all others.

🖥️ 5. Start the App
Run the development server:

bash
Copy code
npm run dev
Visit your app:

arduino
Copy code
http://localhost:3000
🧮 6. Project Structure
graphql
Copy code
ai-chat-app/
│
├── src/
│   ├── app/
│   │   ├── auth/                # Auth page (Supabase UI)
│   │   ├── chat/                # Main chat page
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Entry point redirect logic
│   │
│   ├── components/
│   │   ├── ChatWindow.tsx       # Core chat UI
│   │   ├── MessageBubble.tsx    # Single message component
│   │   └── LoadingSpinner.tsx   # Spinner animation
│   │
│   ├── server/
│   │   ├── routers/
│   │   │   ├── chat.ts          # Chat tRPC routes (send, history, clear)
│   │   │   └── models.ts        # Model fetching tRPC route
│   │   └── index.ts             # Main tRPC router
│   │
│   ├── utils/
│   │   └── trpc.ts              # Client setup for tRPC
│   │
│   └── lib/
│       └── supabaseclient.ts    # Supabase client instance
│
└── package.json
🧠 7. Core tRPC Procedures
chat.send → Inserts user & AI messages

chat.history → Loads message history by model

chat.clear → Deletes all user messages

models.getAvailable → Fetches list of available models

🌐 Deployment
When deploying (e.g., Vercel):

Set the same environment variables in Vercel’s Environment Settings.

Supabase keys should only be the public anon key, never your service role key.

Vercel automatically supports Next.js + tRPC SSR routes.

🧹 Scripts
Command	Description
npm run dev	Run development server
npm run build	Build for production
npm run start	Run production build
npm run lint	Check for linting errors

🛠️ Future Enhancements
Integrate real OpenAI responses

Add “time ago” relative timestamps

Add chat model selection dropdown

Improve typing animations

Add dark mode

👨‍💻 Author
Kamran Sarwar
Frontend & Full Stack Developer
Built with ❤️ using Next.js, tRPC & Supabase.

📜 License

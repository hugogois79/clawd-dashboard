# 🦞 Clawd Dashboard

Personal task management dashboard for Clawd AI assistant.

## Features

- **Kanban Board**: Organize tasks in To Do, In Progress, Done, and Archived columns
- **Task Details**: Click on any task to view and edit details
- **Real-time Sync**: Connects to Supabase for persistent storage
- **Priorities**: Low, Medium, High, Urgent task priorities
- **Due Dates**: Set and track task deadlines

## Setup

1. Clone the repository:
```bash
git clone https://github.com/hugogois79/clawd-dashboard.git
cd clawd-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional - defaults are included):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deployment

The dashboard can be deployed to:
- **Vercel**: Connect your GitHub repo
- **Netlify**: Connect your GitHub repo
- **GitHub Pages**: Use the `gh-pages` branch

## Supabase Schema

The dashboard uses the `kanban_cards` table with the following structure:

```sql
CREATE TABLE kanban_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  list_id UUID REFERENCES kanban_lists(id),
  position INTEGER,
  due_date TIMESTAMPTZ,
  priority TEXT,
  tags TEXT[],
  archived BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## License

MIT

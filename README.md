🚀 Groupware: Platformă Colaborativă Modernă cu Suport AI
Acesta este repository-ul oficial pentru proiectul Groupware, o aplicație full-stack modernă, concepută pentru colaborare și productivitate, cu integrare profundă a capabilităților AI.

🎯 Arhitectură și Obiectiv
Proiectul este construit ca un Monorepo și găzduiește atât aplicația Next.js (Frontend & API Backend), cât și utilitarele de indexing și bazele de date, asigurând o sincronizare perfectă a tipurilor și a dependențelor între toate componentele.

Caracteristici Cheie
RAG (Retrieval-Augmented Generation): Suport AI pentru căutare contextuală, rezumate și asistență bazată pe documente.

Sincronizare Real-Time: Utilizarea Socket.IO (opțional, dar recomandat) pentru a gestiona evenimente în timp real, cum ar fi notificări, mesagerie sau actualizări live ale stării documentelor.

Structură Modulară: Bazat pe App Router din Next.js, oferind rutare dinamică și rendering pe server/client optimizat.

📦 Cerințe preliminare
Înainte de a începe, asigurați-vă că aveți instalate următoarele instrumente:

Git – Controlul versiunilor.

Bun – Runtime JavaScript rapid și manager de pachete (recomandat, alternativ se poate folosi Node.js).

PostgreSQL 17 – Baza de date relațională principală.

Redis – Caching, gestionarea sesiunilor și mesagerie real-time (opțional, dar esențial pentru Socket.IO).

Windsurf – AI Assistant pentru coding și sugestii inteligente (instrument de dezvoltare).

🛠 Tool-uri și Librării Folosite
Tool / Librărie

Scop

Documentație

Next.js

Framework full-stack (client & server)

Docs

Tailwind CSS

Styling utility-first

Docs

shadcn/ui

Componente UI accesibile, bazate pe Radix

Docs

ui.aceternity

Componente UI suplimentare și efecte vizuale

Docs

Drizzle ORM

ORM de tip TypeScript-first pentru PostgreSQL

Docs

Zod

Validarea tipurilor și a schemelor de date

Docs

Zustand

Management de state ușor și rapid

Docs

TanStack React Query

Managementul datelor asincrone (query-uri și mutații)

Docs

React Hook Form

Management simplificat al formularelor

Docs

BetterAuth

Soluție de autentificare și autorizare

Docs

Socket.IO

Comunicare bi-direcțională, real-time

Docs

🛡️ Securitate și Gestionarea Secretelor
Pentru a ne asigura că variabilele sensibile de mediu (API Keys, parole DB) nu sunt comise în controlul versiunilor, urmăm practica standard de securitate:

Fișierul Public (.env.example): Acest fișier conține doar cheile variabilelor necesare (fără valori), servind ca șablon pentru ceilalți dezvoltatori. Acest fișier este comitat în Git.

Fișierul Secret (.env): Dezvoltatorii își creează o copie a fișierului _.env.example_ și o denumesc .env. Aici se completează valorile reale ale secretelor. Acest fișier este adăugat la .gitignore și nu părăsește mediul local.

Pentru medii de producție, se recomandă utilizarea unor soluții de gestionare a secretelor de nivel enterprise (ex: AWS Secrets Manager, HashiCorp Vault sau Kubernetes Secrets) în locul fișierelor .env.

⚡ Setup și Instalare

1. Clonarea Repository-ului
   git clone <link-repo>
   cd <nume-proiect>

2. Instalarea Dependențelor
   Folosiți bun pentru instalarea rapidă și consistentă a pachetelor la nivel de monorepo:

bun install

3. Configurarea Variabilelor de Mediu
   Copiați fișierul .env.example și redenumiti-l .env. Completați-l cu detaliile bazei de date și ale serviciilor externe (AI, Auth):

# Database Configuration

DATABASE_URL="postgresql://user:password@host:port/database"

# Redis Configuration (Optional)

REDIS_URL="redis://localhost:6379"

# External Services (Groq/OpenAI, etc.)

GROQ_API_KEY="your-groq-api-key"
GOOGLE_API_KEY="your-google-gemini-key"

# Authentication (BetterAuth)

AUTH_SECRET="your-strong-auth-secret"

# ... alte variabile BetterAuth ...

4. Setup Bază de Date (Drizzle)
   Aplicați migrațiile Drizzle pentru a crea tabelele în baza de date PostgreSQL:

# Rulează migrațiile Drizzle (comandă specifică proiectului dvs.)

bun run db:migrate

5. Rulare Locală
   Porniți serverul de dezvoltare Next.js. Serverul va include automat API-ul de backend și va servi frontend-ul:

bun run dev

Aplicația va fi accesibilă pe http://localhost:3000.

💬 Contribuții și Dezvoltare
Sunteți încurajat să contribuiți la proiect. Vă rugăm să urmați ghidurile de contribuție (dacă există) și să creați o cerere de pull (Pull Request) pentru orice funcționalitate nouă sau remediere de bug-uri.

# Groupware - Platformă Colaborativă

Aceasta este documentația oficială pentru proiectul Groupware, o aplicație full-stack modernă construită pentru materia Groupware, cu suport pentru colaborare în timp real.

## Arhitectură și Obiective

Proiectul este construit ca un Monorepo și cuprinde atât aplicația Next.js (Frontend și API Backend), cât și configurațiile bazelor de date. Această abordare asigură o sincronizare perfectă a tipurilor și dependențelor între toate componentele.

## Caracteristici Principale

- Sincronizare Real-Time: Socket.IO pentru gestionarea evenimentelor în timp real, notificări și mesagerie
- Structură Modulară: App Router din Next.js cu rutare dinamică și rendering optimizat
- Autentificare și Autorizare: BetterAuth pentru gestionarea utilizatorilor
- ORM Type-Safe: Drizzle ORM pentru PostgreSQL cu validare Zod
- State Management: Zustand pentru gestionarea stării aplicației

## Cerințe Preliminare

Înainte de a începe, asigurați-vă că aveți instalate următoarele:

- Git - Controlul versiunilor
- Bun - Runtime JavaScript rapid și manager de pachete (recomandat) sau Node.js 18+
- PostgreSQL 17 - Baza de date relațională principală
- Redis - Caching, gestionarea sesiunilor și mesagerie real-time (opțional)

## Tool-uri și Librării Folosite

| Tool / Librărie      | Scop                                          | Documentație                                                              |
| -------------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| Next.js              | Framework full-stack (client & server)        | https://nextjs.org / https://www.youtube.com/watch?v=ZjAqacIm9iI          |
| Tailwind CSS         | Styling utility-first                         | https://tailwindcss.com / https://www.youtube.com/watch?v=ft30zcMlFbE     |
| shadcn/ui            | Componente UI accesibile, bazate pe Radix     | https://ui.shadcn.com / https://www.youtube.com/watch?v=sIKKpnH1wFc       |
| Drizzle ORM          | ORM de tip TypeScript-first pentru PostgreSQL | https://drizzle.org / https://www.youtube.com/watch?v=d1b_yqj3dVQ         |
| Zod                  | Validarea tipurilor și a schemelor de date    | https://zod.dev / https://www.youtube.com/watch?v=L6BE-V2iiWs             |
| Zustand              | Management de state ușor și rapid             | https://zustand.js.org / https://www.youtube.com/watch?v=RcHlzX0x6Go      |
| TanStack React Query | Managementul datelor asincrone                | https://tanstack.com/query / https://www.youtube.com/watch?v=r8Dg0KVnfMA  |
| React Hook Form      | Management simplificat al formularelor        | https://react-hook-form.com / https://www.youtube.com/watch?v=RkXv4AXXC_4 |
| BetterAuth           | Soluție de autentificare și autorizare        | https://betterauth.dev / https://www.youtube.com/watch?v=eYV5R0oBQiE      |
| Socket.IO            | Comunicare bi-direcțională, real-time         | https://socket.io / https://www.youtube.com/watch?v=1BfCnjr_Vjg           |

## Securitate și Gestionarea Secretelor

Pentru a asigura că variabilele sensibile de mediu (API Keys, parole DB) nu sunt comise în controlul versiunilor, urmăm practica standard de securitate:

- Fișierul Public (.env.example): Acest fișier conține doar cheile variabilelor necesare (fără valori), servind ca șablon pentru ceilalți dezvoltatori. Acesta este comitat în Git.
- Fișierul Secret (.env): Dezvoltatorii creează o copie a .env.example și o denumesc .env. Aici se completează valorile reale. Acesta este adăugat la .gitignore și nu se commitează.

Pentru medii de producție, se recomandă utilizarea unor soluții enterprise de gestionare a secretelor (AWS Secrets Manager, HashiCorp Vault, Kubernetes Secrets).

## Setup și Instalare

### 1. Clonarea Repository-ului

```
git clone <link-repo>
cd <nume-proiect>
```

### 2. Instalarea Dependențelor

Folosiți bun pentru instalarea rapidă a pachetelor:

```
bun install
```

Alternativ, cu npm:

```
npm install
```

### 3. Configurarea Variabilelor de Mediu

Copiați fișierul .env.example și redenumiti-l .env:

```
cp .env.example .env
```

Structura completă a variabilelor de mediu va fi stabilită mai târziu în proiect.

### 4. Configurarea Bazei de Date

Baza de date PostgreSQL poate fi rulată local folosind Docker sau poți folosi o instanță PostgreSQL externă (hosted). Aceasta va fi stabilită mai târziu în proiect.

Odată ce baza de date este configurată, aplicați migrațiile:

```
bun run db:migrate
```

### 5. Rulare Locală

Porniți serverul de dezvoltare:

```
bun run dev
```

Aplicația va fi accesibilă pe http://localhost:3000.

## Contribuții și Dezvoltare

Sunteți încurajat să contribuiți la proiect. Vă rugăm să creați o cerere de pull pentru orice funcționalitate nouă sau remediere de bug-uri.

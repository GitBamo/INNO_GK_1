**Github repository:** https://github.com/GitBamo/INNO_GK_1

# MusiCal — Musikstudie-booking (MVP)

MusiCal er en simpel, innovativ booking-app til musikstudiefællesskaber (typisk 2–6 lejere om samme studie). App’en gør det nemt at se dagskalenderen, oprette sessions i faste rum og undgå overlap — med små “nudges” for fair brug i prime time.

> **Repo-mappe:** 'INNO_GK_1/'  
> **Teknologi:** React Native (Expo), JavaScript, Firebase (Auth + Realtime DB)

---

# Kom i gang

**Forudsætninger**

- Node.js (LTS)
- npm
- Expo CLI (npx expo) eller Expo Go på telefon
- iOS Simulator / Android Emulator (eller fysisk enhed via Expo Go)
- npm install
- npm run start

## Installation & kørsel

**I mappen INNO_GK_1 åben terminal:**

1. npm install

- dernæst 2 **eller** 3

2. npm run start (dernæst tryk i (iOS) eller a (Android) (kræver simulator))
3. ellers → npx expo start

---

## Demo

- **Videodemonstration:** https://youtube.com/shorts/5lsOJpAOnXM?feature=share

---

## Funktioner (MVP)

- **Home (kalender + dagsliste)**

  - Månedskalender (vælg dato) og dagsliste over alle bookinger (alle lejere).
  - **Filtre:** kompakte _chips_ for **Lokale** (Alle / Studie A / Studie B / Live Room) og **Person** (Alle / unikke navne).

- **Ny booking**

  - Login håndteres via `AuthContext`. App'en starter uden en hardcoded demo-bruger; `currentUser` vises når en bruger er logget ind.
  - **Input via kompakte selects:**
    - Lokale: Studie A / Studie B / Live Room.
    - Dato: kalender.
    - Start/Slut: 30-min slots i 24h-format.
  - **Overlap-tjek:** afviser bookinger, der overlapper i samme lokale.
  - **Fair-use nudges:**
    - Varighed > 3t → venlig nudge
    - Prime time (16–22) → venlig nudge (en gang, også ved gentagelser).
  - **Gentag ugentligt** _(MVP)_: opretter samme slot **8 uger** frem (afviser individuelt ved overlap og viser en samlet status).
  - **Tastatur-robust formular:** feltet ruller i fokus, “Done/Go” lukker tastaturet i note-feltet.

- **Mine bookinger**

  - Viser **kun dine** bookinger ('userId'-ejerskab) og tillader sletning.
  - **Slet-bekræftelse:** “Er du sikker på, at du vil slette?”.

- **UI/UX**
  - Mørk header/statusbar, centreret logo i top.
  - Konsistent farvetema via 'colors.js'.
  - Listekort med klare tider og “booket af”.

---

## Kravmatch (ifølge opgaven)

- **≥ 5 screens/views**: Home, Ny booking, Mine bookinger ✅
- **≥ 2 nye knapper (med funktion)**: navigation + slet + nulstil + m.fl. ✅
- **≥ Navigation mellen skærme**: Tab + Stack (via AppNavigator.js)✅
- **Skal kunne gemme eller hente data**: Firebase ✅
- **Styling i separat fil**: 'src/styles/\*' ✅
- **README med video-link**: dette dokument ✅

Øvrige leverancer (brugerinddragelse, refleksion, dokumentation og aflevering) håndteres i den **separate rapport** jf. opgavebeskrivelsen.

---

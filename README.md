**Github repository:** https://github.com/GitBamo/INNO_GK_1

# MusiCal — Musikstudie-booking (MVP)

MusiCal er en simpel, innovativ booking-app til musikstudiefællesskaber (typisk 2–6 lejere om samme studie). App’en gør det nemt at se dagskalenderen, oprette sessions i faste rum og undgå overlap — med små “nudges” for fair brug i prime time.

> **Repo-mappe:** 'INNO_GK_1/'  
> **Teknologi:** React Native (Expo), JavaScript

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

- **Videodemonstration:** https://youtu.be/5TbBG533pXw?si=Ho2dILBEEhTaR3JB

---

## Funktioner (MVP)

- **Home (kalender + dagsliste)**

  - Månedskalender (vælg dato) og dagsliste over alle bookinger (alle lejere).
  - **Filtre:** kompakte _chips_ for **Lokale** (Alle / Studie A / Studie B / Live Room) og **Person** (Alle / unikke navne).
  - **Hurtige genveje:** “+ Opret booking”, “Mine bookinger”, “Nulstil demo-data”.

- **Ny booking**

  - **Fast bruger (mock-login):** “Logget ind som: Bamo” (MVP for senere rigtig auth).
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

- **≥ 3 screens/views**: Home, Ny booking, Mine bookinger ✅
- **≥ 2 knapper (med funktion)**: navigation + slet + nulstil + m.fl. ✅
- **≥ 1 liste**: dagsliste (Home) og “Mine bookinger” ✅
- **Styling i separat fil**: 'src/styles/\*' ✅
- **README med video-link**: dette dokument ✅

Øvrige leverancer (brugerinddragelse, refleksion, dokumentation og aflevering) håndteres i den **separate rapport** jf. opgavebeskrivelsen.

---

## Arkitektur

```plaintext
INNO_GK_1/
├── App.js
├── assets/
│   └── app-logo.png
└── src/
  ├── navigation/
  │   └── AppNavigator.js
  ├── screens/
  │   ├── HomeScreen.js
  │   ├── CreateBookingScreen.js
  │   └── MyBookingsScreen.js
  ├── components/
  │   ├── BookingItem.js
  │   ├── Chip.js
  │   └── SelectModal.js
  ├── state/
  │   ├── AuthContext.js
  │   └── BookingsContext.js
  ├── constants/
  │   └── rooms.js   # ['Studie A','Studie B','Live Room']
  └── styles/
    ├── colors.js
    └── globalStyles.js
```

---

## State management

- AuthContext (mock-bruger: id: u-bamo, name: Bamo). Holder en fast bruger i MVP’en. Bruges til at vise “Logget ind som …” + til at sætte 'by/userId' på nye bookinger og til at filtrere “Mine bookinger”.

- 'BookingsContext' (in-memory):
  - 'tryAddBooking(booking, { showNudge = true })' — validerer (slut > start), tjekker overlap i samme lokale, viser nudges og tilføjer booking, hvis alt er OK.
  - 'removeBooking(id)' — sletter booking (bruges kun på **Mine bookinger**, dvs. kun egne bookinger).
  - 'resetToSeed()' — re-seeder demo-data (udvikler/demobrug).

## Data-model (booking)

Booking objekter indeholder:

- id: string
- room: 'Studie A', 'Studie B' eller 'Live Room'
- start: ISO datostreng
- end: ISO datostreng
- by: string (visningsnavn)
- userId: string (ejerskab)
- note: string (valgfri)
- createdAt: ISO datostreng

---

## Videre arbejde (idéer)

- Rigtig login + members pr. studie.
- Persistent storage.
- Avancerede gentagelser (antal/interval/slutdato).
- Rolle-baseret rettighedsstyring (admin/medlem).
- Delte “house rules” og peak-time kvoter.
- ICS-eksport / kalender-sync.

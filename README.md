# MusiCal (Music + Calendar)

## Kør
i terminalen: 
npm install
npm run start

## Mappestruktur

INNO_GK_1/
├─ App.js
├─ README.md
├─ src/
│ ├─ navigation/
│ │ └─ AppNavigator.js
│ ├─ screens/
│ │ ├─ HomeScreen.js // Liste/kalender-view
│ │ ├─ CreateBookingScreen.js // Opret booking
│ │ └─ MyBookingsScreen.js // Mine bookinger (liste)
│ ├─ components/
│ │ └─ BookingItem.js // Én booking i en liste
│ └─ styles/
│ ├─ colors.js
│ └─ globalStyles.js // separat stylingfil

## Krav-check (INNT Aktivitet 1)

- React Native app med min. 3 screens
- Min. 2 knapper (én navigerer)
- Min. 1 liste (FlatList)
- Styling i separat fil (src/styles/globalStyles.js)
- Brugerinddragelse (2 interviews eller 15+ survey-svar)
- Refleksion over læring (skrives i rapport)
- Demovideo-link (indsættes her)

Se kursus/aktivitetens formalia og læringsmål i udleveret materiale.

## Brugerinddragelse (plan)
Vi sigter mod 2 korte interviews (10–12 min) med musikere i studie-fællesskaber:
- Formål: Forstå booking-vaner, fairness og behov for felter i formularen.
- Spørgsmål (uddrag):
  1) Hvordan planlægger I sessions i dag? Hvad frustrerer mest?
  2) Hvad er “peak time” hos jer? Hvor lang bør en session være i prime time?
  3) Hvilke oplysninger skal altid indtastes, og hvilke kan være valgfrie?
  4) Hvordan håndterer I dobbeltbookinger og aflysninger?

**Artefakt:** Noter 3–5 fund (bullet points) og 2 konkrete UI-ændringer lavet på baggrund af feedback.

## Refleksion (kladde)
- Hvad lærte jeg om brugerbehov ift. fairness?
- Hvilke dele af koden var sværest/nemmest (navigation, formular, validering)?
- Evt. AI-brug: hvad blev genereret, hvad ændrede jeg, og hvorfor?

## Demovideo
- Link: *(indsæt YouTube/GitHub-link)*
- Scope i videoen: Opret booking → nudge ved long/peak → se i “Mine bookinger” → slet
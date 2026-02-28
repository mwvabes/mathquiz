# Quiz Matematyczny

Aplikacja webowa do ćwiczenia działań matematycznych - dodawania, odejmowania, mnożenia i dzielenia.

## Funkcje

- ✓ 4 operatory matematyczne (+, -, ×, ÷)
- ✓ Licznik prawidłowych i błędnych odpowiedzi
- ✓ Śledzenie najlepszej serii poprawnych odpowiedzi
- ✓ Wybór operatorów w ustawieniach
- ✓ Animacje sukcesu/błędu
- ✓ PWA - możliwość instalacji na telefonie
- ✓ Responsywny design dla urządzeń mobilnych

## Uruchomienie lokalnie

```bash
npm install
npm run dev
```

## Deployment na GitHub Pages

```bash
npm run deploy
```

Po wykonaniu komendy aplikacja zostanie automatycznie zbudowana i wrzucona na branch `gh-pages`.

### Pierwsza konfiguracja GitHub Pages

1. Stwórz repozytorium na GitHubie o nazwie `mathquiz`
2. Dodaj remote: `git remote add origin https://github.com/TWOJ_USERNAME/mathquiz.git`
3. Commituj i wypchnij kod: 
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```
4. Uruchom deployment: `npm run deploy`
5. Przejdź do Settings → Pages → wybierz branch `gh-pages` jako źródło
6. Aplikacja będzie dostępna pod: `https://TWOJ_USERNAME.github.io/mathquiz/`

## Technologie

- React 19
- Vite 7
- CSS3 (animations, flexbox, grid)
- Service Worker (offline support)


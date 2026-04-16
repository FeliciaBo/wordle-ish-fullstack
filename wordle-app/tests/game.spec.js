import { test, expect } from '@playwright/test';
 
/* Testning:

(test från tidigare uppgift:
- logik för feedback (correct, misplaced, incorrect, samt felhantering
- Logic för chooseWord (välja ut ord utifrån filter, samt felhantering) 
)

Spel:

1. Innan spel:
(- Sidan startas upp utan fel)
 - Default-filtrering är korrekt, men kan ändras: 
   - Val av antal bokstäver 
   - Val av duplicate eller inte
 - Startknapp startar spelet och hämtar ett ord 

 2. Under spel: 
 - Spelaren gissar genom att skriva i input-rutan och klicka på submit-knappen
 - Feedback på gissning (grön/correct, gul/misplaced, röd/incorrect)
 - Om fel gissining: möjlighet att gissa igen
 - Om rätt gissning: spelet är slut (nästa steg)

3. Spel slut:
 - "Du vann"-text
 - Spelresultat visas:  
    - antal gissningar
    - tid (från backend)
    - rätt ord

 - Knapp och input för att skicka in resultat till highscore
 - Knapp för att starta nytt spel
   - Fungerar efter att skicka in till highscore
   - Fungerat utan att skicka in till hioghscore

4. Highscore:
 - Om skickat: Spelresultatet finns i highscore-listan


  Mockord:
   - "melon" (default: ingen duplicate, 5 bokstäver)
   - "bär" (ingen duplicate, 3 bokstäver)
   -  "banana" (duplicate tillåten, 6 bokstäver)


Tester:
- A: Rätt gissning direkt (default filtrering)
  - testar även uppstart av spelet och default filtrering 
  - inga felmeddelanden dyker upp
  - rätt saker visas när spelet är slut

- B: Fel gissning, följt av rätt gissning (default filtrering)
  - testar att man får ett nytt försök 
  - feedback: correct, misplaced och incorrect visas
  - antal gissningar går upp 

- C: Ord med 3 bokstäver
  - testar även att det går att starta ett nytt spel

- D: Ord med flera av samma bokstav
  - testar även att det går att skicka in resultat till highscore
    och syns i highscore-listan
  - testar att filtreringen av highscores fungerar (ord-längd och duplicate)

*/

test('A: Default game settings and immediate win (word: "melon")', async ({ page }) => {
await page.goto('/');

await expect(page.getByText(/^Error:/)).toHaveCount(0);
await expect(page.getByRole("heading", { name: "Wordle Game" })).toBeVisible();

await expect(page.getByLabel("Word length:")).toHaveValue("5");
await expect(page.getByLabel("Include repeated letters:")).not.toBeChecked();

await page.getByRole("button", { name: "Start game" }).click();

await expect(page.getByText(/^Error:/)).toHaveCount(0);
await page.getByLabel("Your guess:").fill("melon");

await page.getByRole("button", { name: "Guess" }).click();

await expect(page.getByText(/^Error:/)).toHaveCount(0);
await expect(page.getByText("You won!")).toBeVisible();
await expect(page.getByText(/Guesses: 1/)).toBeVisible();
await expect(page.getByText(/Final time:/)).toBeVisible();

  //"melon" visas
  const winRow = page.locator(".row").last();

 await expect(winRow.locator(".tile")).toHaveCount(5);

 await expect(winRow.locator(".tile").nth(0)).toHaveText("m");
 await expect(winRow.locator(".tile").nth(1)).toHaveText("e");
 await expect(winRow.locator(".tile").nth(2)).toHaveText("l");
 await expect(winRow.locator(".tile").nth(3)).toHaveText("o");
 await expect(winRow.locator(".tile").nth(4)).toHaveText("n");

  const winningTiles = page.locator(".tile.correct");
  await expect(winningTiles).toHaveCount(5);

});

test('B: Incorrect guess followed by correct guess', async ({ page }) => {
  await page.goto('/');

  await page.getByRole("button", { name: "Start game" }).click();

  await page.getByLabel("Your guess:").fill("pämon");
  await page.getByRole("button", { name: "Guess" }).click();

  const firstRow = page.locator(".row").first();

  await expect(firstRow.locator(".tile")).toHaveCount(5);
  await expect(firstRow.locator(".correct")).toHaveCount(2);
  await expect(firstRow.locator(".incorrect")).toHaveCount(2);
  await expect(firstRow.locator(".misplaced")).toHaveCount(1);
    await expect(page.getByText("You won!")).not.toBeVisible();

  await page.getByLabel("Your guess:").fill("melon");
  await page.getByRole("button", { name: "Guess" }).click();

  await expect(page.getByText("You won!")).toBeVisible();
  await expect(page.getByText(/Guesses: 2/)).toBeVisible();
  await expect(page.getByText(/Final time:/)).toBeVisible();

});

test('C: 3-letter word + start new game', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel("Word length:").fill("3");
  await page.getByRole("button", { name: "Start game" }).click();

  await page.getByLabel("Your guess:").fill("bär");
  await page.getByRole("button", { name: "Guess" }).click();

  await expect(page.getByText("You won!")).toBeVisible();

  await page.getByRole("button", { name: "Start new game" }).click();

  await expect(page.getByText("You won!")).not.toBeVisible(); 

  await expect(page.getByLabel("Word length:")).toBeVisible();
  await expect(page.getByLabel("Include repeated letters:")).toBeVisible();

  await page.getByRole("button", { name: "Start game" }).click();
  await expect(page.getByLabel("Your guess:")).toHaveCount(0);

});


test('D: Duplicate letter word + shows up in highscores, with filter', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel("Word length:").fill("6");
  await page.getByLabel("Include repeated letters:").check();
  await page.getByRole("button", { name: "Start game" }).click();

  await page.getByLabel("Your guess:").fill("banana");
  await page.getByRole("button", { name: "Guess" }).click();
  await expect(page.getByText("You won!")).toBeVisible();

  const playerName = `TestPlayer-${Date.now()}`;
  await page.getByLabel("Your name:").fill(playerName);

  await page.getByRole("button", { name: "Save score" }).click();

  await expect(page.getByText("Score saved!")).toBeVisible();

  await page.goto("/highscores?length=6&unique=false");

  const row = page.getByRole("row", { name: playerName });

 await expect(row).toBeVisible();
 await expect(row).toContainText("6");
 await expect(row).toContainText("No");  

});
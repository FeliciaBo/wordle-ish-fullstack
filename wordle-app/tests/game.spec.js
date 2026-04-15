import { test, expect } from '@playwright/test';
 
/* Testning:

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
   -  "banan" (duplicate tillåten, 5 bokstäver)
   - "bär" (ingen duplicate, 3 bokstäver)


Tester:
- A: Rätt gissning direkt (default filtrering)
  - testar även uppstart av spelet och default filtrering 

- B: Fel gissning, följt av rätt gissning (default filtrering)
  - testar att man får ett nytt försök 
  - feedbakc: correct, misplaced och incorrect visas
  - antal gissningar går upp 

*/

test('A: Default game settings and immediate win', async ({ page }) => {
await page.goto('/');

await expect(page.getByRole("heading", { name: "Wordle Game" })).toBeVisible();

await expect(page.getByLabel("Word length:")).toHaveValue("5");
await expect(page.getByLabel("Include repeated letters:")).not.toBeChecked();

await page.getByRole("button", { name: "Start game" }).click();

await page.getByLabel("Your guess:").fill("melon");
await page.getByRole("button", { name: "Guess" }).click();

  await expect(page.getByText("You won!")).toBeVisible();
  await expect(page.getByText(/Guesses: 1/)).toBeVisible();
  await expect(page.getByText(/Final time:/)).toBeVisible();

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
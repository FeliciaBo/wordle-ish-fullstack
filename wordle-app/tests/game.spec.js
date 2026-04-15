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
    - tid (från backend)
    - antal gissningar
    - rätt ord
    - Valda filter:
      - antal bokstäver
      - unique eller ej

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

   
*/
/* Testning:

Spel:

-Innan spel:
 - Filtrering: 
   - Val av antal bokstäver 
   - Val av duplicate eller inte
 - Startknapp

 -Under spel: 
 - Gissning
 - Feedback på gissning (grön/correct, gul/misplaced, röd/incorrect)

 - Spel slut:
 - tid (från backend)
 - antal gissningar
 - Valda filter: antal bokstäver, unique

 Highscore:
- Spelresultatet finns i highscore-listan



Mockord: 

   Lista med mockord: "melon, banan, bär" (en för respektive inställning)
   - "melon" (default: ingen duplicate, 5 bokstäver)
   -  "banan" (duplicate tillåten, 5 bokstäver)
   - "bär" (ingen duplicate, 3 bokstäver)


 Tester:

   Gissningar:
   - Rätt gissning direkt:
     - Alla bokstäver är gröna = spelet är över

   - Fel gissning: 
     - Några bokstäver är gröna, några gula, några röda
     - möjlighet att gissa igen
   
   Spel slut:
   - rätt spelresultat hämtas från backend
   - möjlighet att starta nytt spel
   - skicka spelresultat till highscores eller inte

   Highscore:
   - Om skickat: Resultatet finns i listan
  
*/
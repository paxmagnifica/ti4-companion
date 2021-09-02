# ti4-companion

This is supposed to be a companion app for a session of [Twilight Imperium 4th Edition](https://twilight-imperium.fandom.com/wiki/Twilight_Imperium_Wiki#Fourth_Edition) board game.

It's supposed to be an easy way to share game state between players.
Each player should be able to input and access the game state of the current session on their phone.

This should help with tracking the objectives, laws and directives in play and, later, technologies developed by each race.

A way of sharing the game state in read-only state that would show the big picture on a big screen (or people who are interested in the game but are not sitting together).

## Features

- [x] Creating a _local_ Game Session with a list of factions in play with easy access to Faction Info.
- [x] Randomising the order of factions playing the game.
- [ ] persisting and sharing the Game Session.
- [ ] Amount of Victory Points accumulated by each faction.
- [ ] List of public Objectives with indication which faction reached which objective already.
- [ ] List of technologies researched by each faction in the game.
- [ ] A big picture view of the game (factions, victory points, public objectives, laws).

# development

## extracting faction images from codex pdf

last used pdf: [https://images-cdn.fantasyflightgames.com/filer_public/ff/5c/ff5cc986-344a-4460-a0cb-41d40a3446ed/ti_codex_2_cards_web.pdf](https://images-cdn.fantasyflightgames.com/filer_public/ff/5c/ff5cc986-344a-4460-a0cb-41d40a3446ed/ti_codex_2_cards_web.pdf)

you need imagemagick or something like this (the thing in unix that installs `convert` and `pdftoppm` programs)

1. download a codex pdf like the one above
1. pray that the 24 factions are in the same order on the same pages
1. if on different pages, update script to extract from correct pages
1. if not in the same order as in the script - update the script with names which are lowercase of `FACTION` enum keys in `client/src/gameInfo/factions.js` (so `The_Universities_of_Jol__Nar` becomes `the_universities_of_jol__nar.png`)
1. run `./extract-images-from-pdf.sh <name_of_the_pdf_file>`

# Welcome to release notes of TI4 companion

You will find here a log of features introduced in the app.
Bear in mind that release notes before 2022-08-14 were compiled post-factum and should not be considered accurate.


## 2022-07-21
- [feat] If nobody selects speaker during draft, it is assigned randomly, excluding the last person who was picking and didn't select speaker. [PR](https://github.com/paxmagnifica/ti4-companion/pull/261)
- [fix] Fixed Timeline - included Speaker Pick in the timeline and correctly assigns speaker based on pick [PR](https://github.com/paxmagnifica/ti4-companion/pull/263)

## 2022-07-14
- [feat] Added the ability to select speaker position in addition to faction and table position when drafting. [PR](https://github.com/paxmagnifica/ti4-companion/pull/255)
- [feat] Added release notes and link to them in the app footer. [PR](https://github.com/paxmagnifica/ti4-companion/pull/256)
- [fix] Fixed player order stepper on draft to not break layout and to scroll active picking player into view [issue](https://github.com/paxmagnifica/ti4-companion/issues/257)
- [feat] Added full search to objective selector - you can now type part of the objective text to have it sorted in the dropdown [issue](https://github.com/paxmagnifica/ti4-companion/issues/124)

## 2022-07-12
- [feat] Added game version configuration when starting a session. Data on cheatsheets and in Knowledge Base is now contextual to the selected version (base, PoK, C2, C3). [PR](https://github.com/paxmagnifica/ti4-companion/pull/252)

## 2022-07-01
- [fix] Fixed faction color coding on Victory Point tracker and session main view cheatsheets. [PR](https://github.com/paxmagnifica/ti4-companion/pull/250)

## 2022-06-22
- [fix] Fixed bug which caused players to be reordered after each ban round if banning in multiple rounds [PR](https://github.com/paxmagnifica/ti4-companion/pull/246)

## 2022-06-12
- [feat] Added keleres to available factions [PR](https://github.com/paxmagnifica/ti4-companion/pull/244)

## 2022-04-26
- [feat] Added panic page on application crashes [PR](https://github.com/paxmagnifica/ti4-companion/pull/242)
- [fix] Fixed objective selector crash [PR](https://github.com/paxmagnifica/ti4-companion/pull/241)

## 2022-04-17
- [feat] Added Victory Points helper, which allows assigning context to VP gained by factions (i.e. Custodian/Mecatol/SFT etc.) [PR](https://github.com/paxmagnifica/ti4-companion/pull/236)

## 2022-03-24
- [feat] Added player ban/picks on player stepper during draft [PR](https://github.com/paxmagnifica/ti4-companion/pull/214)

## 2022-02-25
- [fix] Correctly use last selected speaker instead of the first, when multiple speaker assignments were made before committing draft [PR](https://github.com/paxmagnifica/ti4-companion/pull/208)

## 2022-01-23
- [feat] Added password protection to sessions [PR](https://github.com/paxmagnifica/ti4-companion/pull/186)

## 2022-01-07
- [feat] Added ability to set faction colors [issue](https://github.com/paxmagnifica/ti4-companion/issues/121)

...

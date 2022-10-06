# Welcome to release notes of TI4 companion

You will find here a log of features introduced in the app.
Bear in mind that release notes before 2022-08-14 were compiled post-factum and should not be considered accurate.

## 2022-10-06
- [feat] point deltas (+1 / +2 / -1) are now shown on Timeline and in the Victory Point Source helper: <a href="https://user-images.githubusercontent.com/9142942/194423603-5cd115a8-3035-429a-813f-01d312b72fd8.png" target="blank"><img src="https://user-images.githubusercontent.com/9142942/194423603-5cd115a8-3035-429a-813f-01d312b72fd8.png" alt="timeline deltas" height="400px"/></a><a href="https://user-images.githubusercontent.com/9142942/194423642-b65bae6d-7871-46a3-8b08-829478b3731e.png" target="_blank"><img src="https://user-images.githubusercontent.com/9142942/194423642-b65bae6d-7871-46a3-8b08-829478b3731e.png" alt="victory point source deltas" height="400px"/></a>
- [fix] page title now shows the same session description as session overview

## 2022-10-01
- [feat] when searching for objectives - objective condition is shown and text you are searching for is highlighted (on both the objective name and condition) ![highlighted objective selector](https://user-images.githubusercontent.com/9142942/193400253-4a487857-d840-48c7-b5f0-2c3eea3a9c3d.png)
- [improvement] when adding objectives, stage I, stage II and secret objectives are now exclusive categories

## 2022-09-26
- [improvement] hide "victory points source" button in fullscreen
- [improvement] hide "victory points source" and "points control" sections when session is locked

## 2022-09-24
- [feat] Added new way of adding points to factions. Instead of clicking flags or dragging them, there is a grid of factions flags with "+1" and "-1". ![points control](https://user-images.githubusercontent.com/9142942/192339505-a9dc4c86-742e-454c-aba0-dead3e12b052.png)

## 2022-07-21
- [feat] If nobody selects speaker during draft, it is assigned randomly, excluding the last person who was picking and didn't select speaker. [PR](https://github.com/paxmagnifica/ti4-companion/pull/261)
- [fix] Fixed Timeline - included Speaker Pick in the timeline and correctly assigns speaker based on pick [PR](https://github.com/paxmagnifica/ti4-companion/pull/263)
- [feat] Added minimal tech tree to Knowledge Base - just an image of all the techs until we implement our own searchable tech library [PR](https://github.com/paxmagnifica/ti4-companion/pull/264)

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

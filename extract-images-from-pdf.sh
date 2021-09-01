#!/bin/bash

inputFile=$1

rm -rf faction-images-output
mkdir faction-images-output
rm -rf client/public/factionCheatsheets
mkdir client/public/factionCheatsheets

pdftoppm $inputFile faction-images-output/page -png -r 300 -scale-to-x 2550 -progress -o
echo "pdf converted to pngs"

width=1092
height=790
leftColumnOffset=118
rightColumnOffset=1340
firstRowOffset=350
secondRowOffset=1260
thirdRowOffset=2170

convert faction-images-output/page-07.png -crop ${width}x${height}+${leftColumnOffset}+${firstRowOffset} client/public/factionCheatsheets/the_arborec.png
echo "1/24"
convert faction-images-output/page-07.png -crop ${width}x${height}+${rightColumnOffset}+${firstRowOffset}  client/public/factionCheatsheets/the_argent_flight.png
echo "2/24"
convert faction-images-output/page-07.png -crop ${width}x${height}+${leftColumnOffset}+${secondRowOffset}  client/public/factionCheatsheets/the_vuilraith_cabal.png
echo "3/24"
convert faction-images-output/page-07.png -crop ${width}x${height}+${rightColumnOffset}+${secondRowOffset} client/public/factionCheatsheets/the_embers_of_muaat.png
echo "4/24"
convert faction-images-output/page-07.png -crop ${width}x${height}+${leftColumnOffset}+${thirdRowOffset}  client/public/factionCheatsheets/the_empyrean.png
echo "5/24"
convert faction-images-output/page-07.png -crop ${width}x${height}+${rightColumnOffset}+${thirdRowOffset} client/public/factionCheatsheets/the_ghosts_of_creuss.png
echo "6/24"

convert faction-images-output/page-09.png -crop ${width}x${height}+${leftColumnOffset}+${firstRowOffset} client/public/factionCheatsheets/the_emirates_of_hacan.png
echo "7/24"
convert faction-images-output/page-09.png -crop ${width}x${height}+${rightColumnOffset}+${firstRowOffset}  client/public/factionCheatsheets/the_universities_of_jol__nar.png
echo "8/24"
convert faction-images-output/page-09.png -crop ${width}x${height}+${leftColumnOffset}+${secondRowOffset}  client/public/factionCheatsheets/the_l1z1x_mindnet.png
echo "9/24"
convert faction-images-output/page-09.png -crop ${width}x${height}+${rightColumnOffset}+${secondRowOffset} client/public/factionCheatsheets/the_barony_of_letnev.png
echo "10/24"
convert faction-images-output/page-09.png -crop ${width}x${height}+${leftColumnOffset}+${thirdRowOffset}  client/public/factionCheatsheets/the_mahact_gene__sorcerers.png
echo "11/24"
convert faction-images-output/page-09.png -crop ${width}x${height}+${rightColumnOffset}+${thirdRowOffset} client/public/factionCheatsheets/the_mentak_coalition.png
echo "12/24"

convert faction-images-output/page-11.png -crop ${width}x${height}+${leftColumnOffset}+${firstRowOffset} client/public/factionCheatsheets/the_naalu_collective.png
echo "13/24"
convert faction-images-output/page-11.png -crop ${width}x${height}+${rightColumnOffset}+${firstRowOffset}  client/public/factionCheatsheets/the_naaz__rokha_alliance.png
echo "14/24"
convert faction-images-output/page-11.png -crop ${width}x${height}+${leftColumnOffset}+${secondRowOffset}  client/public/factionCheatsheets/the_nekro_virus.png
echo "15/24"
convert faction-images-output/page-11.png -crop ${width}x${height}+${rightColumnOffset}+${secondRowOffset} client/public/factionCheatsheets/the_nomad.png
echo "16/24"
convert faction-images-output/page-11.png -crop ${width}x${height}+${leftColumnOffset}+${thirdRowOffset}  client/public/factionCheatsheets/the_clan_of_saar.png
echo "17/24"
convert faction-images-output/page-11.png -crop ${width}x${height}+${rightColumnOffset}+${thirdRowOffset} client/public/factionCheatsheets/sardakk_norr.png
echo "18/24"

convert faction-images-output/page-13.png -crop ${width}x${height}+${leftColumnOffset}+${firstRowOffset} client/public/factionCheatsheets/the_federation_of_sol.png
echo "19/24"
convert faction-images-output/page-13.png -crop ${width}x${height}+${rightColumnOffset}+${firstRowOffset}  client/public/factionCheatsheets/the_titans_of_ul.png
echo "20/24"
convert faction-images-output/page-13.png -crop ${width}x${height}+${leftColumnOffset}+${secondRowOffset}  client/public/factionCheatsheets/the_winnu.png
echo "21/24"
convert faction-images-output/page-13.png -crop ${width}x${height}+${rightColumnOffset}+${secondRowOffset} client/public/factionCheatsheets/the_xxcha_kingdom.png
echo "22/24"
convert faction-images-output/page-13.png -crop ${width}x${height}+${leftColumnOffset}+${thirdRowOffset}  client/public/factionCheatsheets/the_yin_brotherhood.png
echo "23/24"
convert faction-images-output/page-13.png -crop ${width}x${height}+${rightColumnOffset}+${thirdRowOffset} client/public/factionCheatsheets/the_yssaril_tribes.png
echo "24/24"

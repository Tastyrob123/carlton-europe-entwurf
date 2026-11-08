#!/bin/zsh
# Alle Läufe nacheinander (nie zwei Browser zugleich): drei Motoren × drei Grössen gegen den Prüfserver (LIVRE_KI=0).
cd "$(dirname $0)/../../.."
for m in chromium webkit firefox; do for g in 1440x900 1366x650 390x844; do
  [ -n "$NUR" ] && [[ "$NUR" != *"$m-$g"* ]] && continue
  BASIS=${BASIS:-http://localhost:8966/} node _werkzeuge/livre/pruefung/funktionen.js carlton $m $g > _werkzeuge/livre/pruefung/ergebnisse/lauf-$m-$g.txt 2>&1
  echo "$m $g: $(grep -o 'Summe:.*' _werkzeuge/livre/pruefung/ergebnisse/lauf-$m-$g.txt || echo ABBRUCH)"
done; done

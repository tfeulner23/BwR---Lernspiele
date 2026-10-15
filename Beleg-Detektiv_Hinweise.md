# Beleg-Detektiv

Interaktives Lernspiel für BwR 7 (II), bayerische Realschule. Fünf Fälle und ein Bonusfall, geplant für etwa 5–10 Minuten; beim ersten Einsatz je nach Lernstand mehr Zeit einräumen.

## Spielen

`index.html` im Browser öffnen. Die Datei funktioniert auch offline; es werden keine Bibliotheken, Schriftarten oder anderen Dateien aus dem Internet nachgeladen. Über GitHub Pages kann dieselbe Datei als Website bereitgestellt werden.

Es gibt keine Anmeldung, keine Werbung, keine Analysewerkzeuge und keine Übertragung der Antworten durch das Spiel. Der Spielstand bleibt ausschließlich im Arbeitsspeicher des geöffneten Tabs und geht beim Neuladen verloren. Bei Online-Nutzung verarbeitet der jeweilige Hosting-Anbieter die üblichen Verbindungsdaten.

## Lernziel und Voraussetzungen

Belege erschließen, zwei betroffene Bestandskonten und ihre Veränderungen bestimmen, einen Buchungssatz bilden und die daraus entstehenden Konteneinträge nachvollziehen. Aktive und passive Bestandskonten sowie Soll und Haben sollten bereits eingeführt sein.

Pro Fall: Geschäftsvorfall auswählen → Konten und Bestandsveränderungen bestimmen → Sollkonto, Habenkonto und Betrag eingeben. Anschließend zeigt das Spiel beide T-Konten mit Betrag, Gegenkonto und Belegverweis. Der Konteneintrag wird gezeigt, nicht als zusätzliche Eingabe geprüft.

Das Material ist ein Übungsspiel, keine vollständige Unterrichtsstunde.

## Didaktische Vereinfachungen

- Alle Belege, Nachrichten, Geschäftspartner und Beträge sind fiktive Übungsdaten. Keine neuen verbindlichen Unternehmensstammdaten.
- Courtline stellt ausschließlich eigene Fertigerzeugnisse her. Es werden keine Handelswaren eingeführt.
- Der Druckerkauf wird ausdrücklich ohne Berücksichtigung der Umsatzsteuer behandelt. Keine steuerrechtliche Musterrechnung.
- Beim Kunden- und Lieferantenausgleich gelten die ursprünglichen Rechnungen bereits als vollständig gebucht. Nur die Zahlung wird erfasst.
- Keine Gebühren, Zinsen, Skonti oder anderen Preisnachlässe.
- Die Belege sind vereinfachte Ausschnitte, keine vollständigen Bankauszüge. Bei Zahlungsvorgängen werden ausreichendes Bankguthaben bzw. ausreichender Kassenbestand und passende offene Posten vorausgesetzt. Es werden keine Kontenabschlüsse berechnet.
- Der Bonus vermittelt den Grundsatz „Keine Buchung ohne Beleg“: fehlende Unterlagen beschaffen bzw. den Vorgang nachvollziehbar belegen, nicht schätzen oder dauerhaft weglassen.

## Lösungen

| Fall | Vorgang | Soll | Haben | Betrag |
| --- | --- | --- | --- | --- |
| ER-101 | Druckerkauf mit sofortiger Bankzahlung | 0860 BM | 2800 BK | 1.250,00 € |
| EB-102 | Bareinzahlung aus der betrieblichen Kasse | 2800 BK | 2880 KA | 600,00 € |
| BA-103 | Kunde bezahlt bereits gebuchte Rechnung | 2800 BK | 2400 FO | 1.500,00 € |
| BA-104 | Zahlung einer bereits gebuchten Lieferantenrechnung | 4400 VE | 2800 BK | 1.200,00 € |
| BA-105 | Auszahlung eines Bankkredits mit sechs Jahren Laufzeit | 2800 BK | 4250 LBKV | 10.000,00 € |

## Rückmeldung und Punkte

Je Schritt 2 Punkte beim ersten richtigen Versuch, 1 Punkt nach falscher Antwort oder Fall-Tipp, 0 Punkte beim Aufdecken der Lösung. „Lösung zeigen“ erscheint nach zwei falschen Antworten im jeweiligen Schritt. Leere bzw. unvollständige Eingaben und die allgemeine Buchungshilfe kosten keine Punkte. Der Bonus gibt 2 Punkte beim ersten richtigen Versuch, ansonsten 1 Punkt. Höchstwert: 32 Punkte.

Schwierige Fälle (mindestens ein Schritt unter 2 Punkten) lassen sich als eigene Runde wiederholen. Wiederholungen haben einen eigenen Punktestand. Ergebnisse sind Lernrückmeldungen, keine standardisierte Leistungsbewertung.

Beträge werden im deutschen Format angezeigt. Eingaben wie `1250` oder `1250,00` werden akzeptiert und nach richtiger Buchung als `1.250,00` dargestellt. Eine englische Eingabe wie `1,250.00` wird nicht akzeptiert.

## Fachliche Grundlage

- Von der Lehrkraft bereitgestellter LehrplanPLUS Bayern, Realschule, BwR 7 (II), PDF-Seite 1, Lernbereich 3 „Einführung in die Geschäftsbuchführung“, insbesondere beleggestützte Bestandsbuchungen, Konteneinträge und GoB. Export vom 06.10.2026.
- Vorgegebener Kontenplan nach dem IKR für bayerische Realschulen, LehrplanPLUS/ISB, PDF-Seite 1: 0860 BM, 0870 BGA, 2400 FO, 2800 BK, 2880 KA, 4250 LBKV, 4400 VE. 0870 BGA dient auch als plausible falsche Antwort.
- Bestätigte Courtline-Daten: Name, Rechtsformzusatz, Anschrift sowie Anna Keller (Finanzen/Personal/Ausbildung) und Mia Schuster (Auszubildende).

Original-PDFs und sonstige Unterrichtsunterlagen werden nicht mitveröffentlicht.

## Technik

Eine eigenständige HTML-Datei mit eingebettetem CSS und JavaScript. Keine Installation oder zusätzlichen Pakete nötig. Auswahlfelder statt zwingendem Drag-and-drop; Bedienung per Tastatur und Touch. Responsive Darstellung und reduzierte Animation bei entsprechender Systemeinstellung.

Version 1 · 14.10.2026

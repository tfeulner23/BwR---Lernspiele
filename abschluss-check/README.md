# Abschluss-Check · BwR 7 (II)

Digitale Lernzielkontrolle zu Abschlussbuchungen, ausgelegt auf etwa 10–15 Minuten selbstständige Bearbeitung. Keine automatische Zeitbegrenzung, damit eine begonnene Aufgabe als Hausaufgabe fortgesetzt werden kann.

**Anwendung:** https://tfeulner23.github.io/BwR---Lernspiele/abschluss-check/

## Aktueller Stand

Die zentrale Supabase-Anbindung ist nach ausdrücklicher Freigabe der Lehrkraft am 16.10.2026 aktiviert. Persönliche Schülercodes und Abgabenübersicht stehen nach Einrichtung des Lehrerzugangs zur Verfügung. Die zusätzliche Proberunde speichert weiterhin nur im eigenen Browser.

## Aufbau

1. Vier Erfolgskonten über 8020 GUV abschließen.
2. Aufwendungen und Erträge summieren, Gewinn/Verlust berechnen, GuV über 3000 EK abschließen und das Eigenkapital fortschreiben.
3. Sieben Bestandskonten über 8010 SBK abschließen und die SBK-Summen bestimmen.

Das digitale GuV- bzw. SBK-Konto zeigt die eigenen Eintragungen. Vor der Abgabe gibt es keine automatische Korrektur. Die Konteneinträge ergeben sich aus den selbst gebildeten Buchungssätzen, ohne dass die Schüler dieselben Beträge zusätzlich erneut in die T-Konten tippen müssen.

Voraussetzungen: aktive/passive Bestandskonten, Aufwands-/Ertragskonten, Soll/Haben und Abschlussregeln wurden bereits behandelt. Der Kontenplan darf benutzt werden. Die Zeitplanung ist eine didaktische Schätzung und muss mit der tatsächlichen Lerngruppe überprüft werden.

## Lösungen

Aufwendungen: 38.000,00 € + 12.000,00 € + 5.000,00 € = **55.000,00 €**.
Erträge: **68.000,00 €**. Gewinn: **13.000,00 €**.
Eigenkapital vor Ergebnisübernahme: **40.000,00 €**. Eigenkapital danach: **53.000,00 €**.

| Buchung | Betrag |
| --- | --- |
| 8020 GUV an 6000 AWR | 38.000,00 € |
| 8020 GUV an 6010 AWF | 12.000,00 € |
| 8020 GUV an 6020 AWH | 5.000,00 € |
| 5000 UEFE an 8020 GUV | 68.000,00 € |
| 8020 GUV an 3000 EK | 13.000,00 € |
| 8010 SBK an 0700 MA | 70.000,00 € |
| 8010 SBK an 0870 BGA | 10.000,00 € |
| 8010 SBK an 2800 BK | 22.000,00 € |
| 8010 SBK an 2880 KA | 3.000,00 € |
| 4250 LBKV an 8010 SBK | 40.000,00 € |
| 4400 VE an 8010 SBK | 12.000,00 € |
| 3000 EK an 8010 SBK | 53.000,00 € |

SBK-Summe Soll = SBK-Summe Haben = **105.000,00 €**.

Je richtigem Feld ein Punkt; insgesamt 43 Punkte (12 / 8 / 23). Ein falsch berechnetes Ergebnis kann bei seiner korrekten Weiterführung im GuV-Abschluss, Eigenkapital und SBK als Folgefehler anerkannt werden. Angezeigt wird zusätzlich immer die rechnerisch richtige Lösung. Die Punkte sind eine Lernrückmeldung, kein standardisierter Notenschlüssel.

## Speichern

- **Proberunde:** automatische Speicherung auf diesem Gerät im verwendeten Browser; Wiederaufnahme nach Neuladen; herunterladbare JSON-Sicherung und Import. Die Proberunde wird nicht an die Lehrkraft abgegeben.
- **Zentraler Arbeitsstand:** persönliche, zufällig erzeugte Zugangscodes; automatische zentrale Speicherung; Fortsetzen auf einem anderen Gerät; bewusste Abgabe mit Auswertung und anschließender Überarbeitung. Die letzte Abgabe bleibt bis zur nächsten ausdrücklichen Abgabe bestehen.
- Der Lehrerbereich ist über `#lehrkraft` erreichbar. Er zeigt die vergebenen Plätze einschließlich noch nicht begonnener Aufgaben, Zwischenstände, Abgaben, Zeitpunkte und Punktzahlen. CSV-Export ist vorbereitet.
- Namen und E-Mail-Adressen der Schüler werden nicht abgefragt. Die Zuordnung von Platz zu Schüler behält die Lehrkraft außerhalb der Anwendung.
- Die geheimen Schülercodes werden nur bei ihrer Erstellung angezeigt und müssen von der Lehrkraft gesichert werden. Sie sind persönliche Zugangsdaten.

## Technischer Schutz der zentralen Fassung

Die Supabase-Tabellen haben aktivierte Row Level Security und erlauben keinen direkten Tabellenzugriff für anonyme oder gewöhnlich angemeldete Browsernutzer. Eine Edge Function authentifiziert die Schüler durch ihren persönlichen Vier-Zeichen-Code; gespeichert wird nur dessen SHA-256-Hash. Die Anmeldung ist dauerhaft pro Netzwerkadresse auf 90 Versuche je Minute begrenzt. Nach der Anmeldung verwenden Speichern und Abgeben eine serverseitig signierte Sitzung. Kurze Codes bieten weniger Schutz vor Erraten als die früheren langen Codes; keine Namen oder sensiblen Schülerdaten erfassen. Bestehende lange Codes bleiben gültig; vierstellige Alias-Codes können ergänzend vergeben werden. Für die Datenbank-Erweiterung siehe `supabase/short-codes.sql`. Lehrkräfte melden sich über Supabase Auth an und müssen zusätzlich als Lehrkraft freigeschaltet sein. Die Freischaltung erfolgt über einen einmaligen, zeitlich begrenzten privaten Einrichtungscode.

Der Datenbank-Serviceschlüssel bleibt ausschließlich in der Serverumgebung. `config.js` darf nur die öffentliche Projektadresse, den öffentlichen Publishable-Key und die API-Adresse enthalten. Keine Bearbeitungen, Codes, Passwörter oder privaten Einrichtungsschlüssel in GitHub hochladen.

Serverseitige Bewertung; Entwürfe und letzte Abgaben werden getrennt gespeichert. Automatische Speicherung überschreibt weder Punkte noch Antworten der letzten Abgabe. Nur student.submit ersetzt die Abgabe atomar; wiederholte identische Übertragungen sind idempotent. Datenbank-Erweiterung: supabase/resubmission.sql. Revisionsprüfung schützt vor stillem Überschreiben bei paralleler Bearbeitung. Die einfache Ratenbegrenzung im Funktionsprozess ist nur ein zusätzlicher Schutz; Plattformgrenzen sind weiterhin relevant. Im öffentlichen Repository sind Aufgaben und Bewertungslogik einsehbar. Die Anwendung dient der formativen Lernzielkontrolle, nicht einer technisch abgesicherten Prüfung.

## Fachliche Grundlage

LehrplanPLUS Bayern, Realschule, BwR 7 (II), Lernbereich 5 „Strukturierung der Geschäftsbuchführung“, bereitgestellter Export vom 06.10.2026, PDF-Seite 1. Vorgegebener Kontenplan nach dem IKR / LehrplanPLUS / ISB, PDF-Seite 1. Die von der Lehrkraft am 16.10.2026 bereitgestellten Arbeitsheftseiten 36–37 (Aufgabe 1/14, Verlag/Ausgabe unbekannt) dienen ausschließlich als lokale Referenz. Keine Arbeitsheftfotos wurden veröffentlicht.

Die Werte sind eigens erstellte Aufgabendaten und werden nicht als neue verbindliche Courtline-Stammdaten übernommen. Keine Bestandsveränderungen von Erzeugnissen, Privatvorgänge, Steuern oder weiteren Abschlusskorrekturen innerhalb dieses vereinfachten Falls. Courtline verkauft ausschließlich eigene Fertigerzeugnisse.

Version 1 · 16.10.2026

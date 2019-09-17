# Domain-Driven Design (DDD), Event-Sourcing und CQRS

## DDD

Domain = Fachlichkeit, Fachgebiet, ...
"Language Gap"

DDD: Bessere Kommunikation mit einer gemeinsamen Sprache für interdisziplinäre Teams

"Domain-Driven Design: Tackling Complexity at the Heart of Software"
(Blue Book)

"Implementing Domain-Driven Design"
(Red Book)

## Der Kern von DDD

Domain

  Bounded Context
  - Sprachliche Grenze
  - Verlaufsform
  - "Ubiquitous Language"

    Aggregate

                    State
                    - Zustand
                    - Daten

        Command                 Event
        - Intention             - Fakt
        - Imperativ             - Präteritum
        - Verb + Substantiv     - Substantiv + Verb

### Beispiel

  Never Completed Game

    Spielen

      Spiel

        Eröffne Spiel           Spiel eröffnet            Aktuelles Level
        Äußere Vermutung        Vermutung geäußert        Aktuelle Rätsel
                                Level bestanden           Richtige Lösung
                                Level nicht bestanden
                                Spiel beendet


  Never Completed Game

    Playing

      Game

        Open game               Game opened               Current level
        Make guess              Guess made                Current riddle
                                Level succeeded           Correct solution
                                Level failed
                                Game completed

## Event-Sourcing

CREATE      POST                Unproblematisch + konstruktiv
READ        GET                 Unproblematisch
UPDATE      PUT                 Problematisch + destruktiv
DELETE      DELETE              Problematisch + destruktiv

Users: Login, Password, LastPassword, LastPwdChang, LastPwd2, LastPwd3, LastPwd4, LastPwd5, LastPwd6, Value1, Value2, ..., Value400

Event-Sourcing ist ein anderer Mechanismus, um Daten zu speichern: Statt den Status Quo zu speichern, speichert man die Änderungen, die zum Status Quo geführt haben.

01.03.2019        Konto eröffnet                        |
01.03.2019        Gutschrift erhalten           +50     |
05.03.2019        Gehalt eingegangen          +5000     |
                                                      5050 (Snapshot)
06.03.2019        Miete abgebucht             -4500     |
07.03.2019        Lotto gespielt                -10     | Replay
08.03.2019        Lotto gewonnen                 +5     |
                                                       545 (Snapshot)
11.03.2019        Essen eingegangen            -200     |
15.03.2019        Ebay verkauft                +150     |
17.03.2019        Lebensmittel gekauft          -50     |
                                                       445 (Snapshot)
18.03.2019        Gutschrift wg fehlhft Bchng +0,01

Append-Only-Log, "Event-Store"
CREATE, READ

## CQRS

CQS = Command Query Separation

stack.push(42);     // => Bewirkt Veränderung, keine Rückgabe: Command
stack.top();        // => Bewirkt nichts, gibt etwas zurück:   Query
stack.pop();        // => FEHLER: Command + Query gleichzeitig

CQRS = CQS auf Anwendungsebene

Command Query Responsibility Segregation
Ausgesprochen als "cars" ("Did you mean Cars?")


     API (Commands): Write - Datenbank (Write: Normalisiert)
   /                             |
UI                               | Message-Queue
   \                             v
      API (Queries): Read -- Datenbank (Read: Denormalisiert)

### CAP-Theorem

          Consistency
        /   \
      A ----- Partition
Availability

CP => Consistency over Availability
AP => Availability over Consistency

"Eventual Consistency"

## All together now ;-)


                DDD
               API (Write) - Event - Eventstore
             /                 |
     Command (POST => 200)     |
   /                           |
UI  ---------------------------+
   \                           |
     Query (GET)          Projection
           \                   v
            -- API (Read) - Viewstore

## Shell-Kommandos

### Anwendung starten

```shell
$ node app.js
```

### Command ausführen

```shell
$ curl -i -X POST -H "content-type:application/json" -d '{"context":{"name":"playing"},"aggregate":{"name":"game","id":"8eca4f01-c86f-452a-9cfe-37a82042e071"},"name":"open","id":"d5e90fe5-b065-4ce5-9560-1943026bc4e7"}' http://localhost:3000/api/v1/command
```

### Events abonnieren

```shell
$ curl -i http://localhost:3000/api/v1/events
```

### Query ausführen

```shell
$ curl -i http://localhost:3000/api/v1/query/games
```

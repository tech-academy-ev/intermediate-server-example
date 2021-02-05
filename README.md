# Der Server

## Vorbereitungen

Um von Null mit dem Thema Server zu beginnen, bietet es sich an, zunächst mal in das [Grundlagenbeispiel](https://github.com/BenLucht/basic-server-example) zu schauen. Um einfach loszulegen, brauchen wir zunächst ein mal nur [NodeJS](https://nodejs.org/en/).

## Vor dem Start

Bevor wir zum Server kommen, betrachten wir uns zunächst, mit was für einer Internetseite wir es zu tun haben. Stellen wir uns vor, TechAcademy hätte einen Tracker dafür, wie viele Stunden die Teilnehmer im Semester Programmieren gelernt haben. Also haben wir ein angedeutetes TA-Design, einen Input-Bereich und die Bestenliste. Im Input kann/muss man seinen Namen eingeben (kein Name, keine Funktinoalität, aber das sagt einem auch ein kleiner Hinweis) und danach kann man Stunden hinzufügen (oder abziehen, wenn man zu schnell geklickt hat). Bevor wir tiefer in die Serverfunktinoalität einsteigen, werden für den Moment nur ein paar Beispieldaten geladen, zu denen die Eingabe hinzugefügt wird. Lädt man die Seite neu, sind die Eingaben verloren. Da sind wir schon an einem der ersten interessanten Punkte angekommen. Später werden wir die nötige Funktinoalität für die Persistenz von Daten schaffen!

Mehr Inhalt kommt bald!

## Eine statische Webseite bereitstellen - Anfang

Um eine Internetseite für einen Nutzer bereitzustellen, bedarf es wenig. Bei der Entwicklung auf dem eigenen Rechner reicht es aus, auf die Basis-HTML-Seite im Browser zu öffnen (im Allgemeinen funktioniert das, im Zuge von Sicherheitsvorkehrungen gibt es jedoch ein paar [Limitationen](https://textslashplain.com/2019/10/09/navigating-to-file-urls/)). Stellt man also einem Nutzer die nötigen Dateien zur Verfügung, kann auch dieser die Webseite benutzen. Diese Praxis ist allerdings gleichzeitig unpraktisch und bietet auch zu wenig Funktionen. Die Idee, die nötigen Dateien an den Nutzer zu senden, lässt sich aber genauso über einen Server ermöglichen (und noch viel mehr).

Im [Grundlagenbeispiel](https://github.com/tech-academy-ev/basic-server-example) haben wir gesehen, wie man auf eine Anfrage an den Server Daten zurücksenden kann. Am Prinzip ändert sich zunächst einmal nichts, nur müssen wir jetzt genauer hinsehen, was angefragt wird und was wir zurücksenden.Bevor wir einsteigen können, müssen wir aber einen kleinen Umweg nehmen.

## Eine statische Webseite bereitstellen - Dateien lesen

Wie im [Grundlagenbeispiel](https://github.com/tech-academy-ev/basic-server-example) verwenden wir auch hier erst mal nur Module/Packages, die in Node gleich eingebaut sind. Zusätzlich zum ```http```-Modul benötigen wir jetzt auch noch das ```fs```-Modul, um auf das ```filesystem```, das Dateisystem des Computers, zuzugreifen. Das geht, weil Node auf dem Computer läuft und diese Funktinoalität eingebaut ist, im Browser funktinoniert das aus Sicherheitsgründen nicht - es wäre viel zu gefährlich, einer Internetseite, die von einem in der Regel unbekannten Menschen stammt, Zugriff auf das Dateisystem zu erlauben. 

Natürlich gibt es auch hier, wie immer, Ausnahmen, wie z.B. die Installation von Extensions oder die Verwendung von extra dafür entwickelten Schnittstellen, die die Verwendung von Websites so möchtig machen sollen, wie native Applikationen. In diesem Fall wird aber zunächst immer der Nutzer gefragt. Ein Beispiel für eine ähnliche Schnittstelle ist, wenn der Browser fragt, ob man 'Location Services' erlauben möchte. Exkurs vorbei, zurück zum Server!


Um etwas darzustellen, muss dem Browser etwas zugesendet werden. Das kann man ganz direkt tun

```javascript
var http = require('http');

http.createServer(function (request, response) {

  response.end(`
    <html>
      <body>
        <h1 style="color: red;">
          This is a HTML response!
        </h1>
      </body>
    </html>
  `);

}).listen(1337);
```

indem man als Antwort auf die Anfrage einen String zurücksendet. Moderne Browser sind intelligent genug programmiert, um das als HTML zu erkennen und dementsprechend zu rendern. In der Praxis wäre es allerdings extrem unpraktisch entweder direkt im Server zu programmieren, oder in separaten Dateien zu programmieren und dann die Inhalte zu kopieren. Außerdem wäre so die Separation von Markup, Styling und JavaScript nicht sinnvoll möglich.

Wir brauchen also eine Methode, durch die wir wie gehabt in separaten Dateien entwickeln und dann diese über den Server versenden. Hier kommt das Modul ```fs``` ins Spiel, das es ermöglicht Dateiinhalte auszulesen und in JavaScript zu benutzen. Machen wir uns zunächst ein mal damit vertraut.

```javascript
var fs = require('fs');

fs.readFile("relative/file.path", function (error, fileContent) {

  if (error) {
    console.error(error);
  } else {
    console.log(fileContent.toString('utf8'))
  };
});
```

Wie immer gibt es auch hier mehrere Möglichkeiten Dateien einzulesen. Die am weitesten verbreitete ist vermutlich die hier gezeigte asynchrone Variante (vielleicht kommt dazu später noch ein Exkurs, aber für den Moment reicht es aus zu wissen, dass das günstig ist, wenn z.B. große Dateien gelesen werden sollen - und die Handhabung ist praktisch). Aus der Entfernung betrachtet, sieht die ```readFile```-Funktion ein bisschen ähnlich aus, wie unser Server. Auch hier gibt es wieder eine "äußere" und eine "innere" Funktion. Die äußere Funktion stellt dabei die Argumente für die innere Funktion zur Verfügung, um damit seine eigene Logik verwenden zu können. Vor der inneren Funkktion benötigt ```readFile``` aber noch den Pfad, unter welchem die einzulesende Datei abgelegt ist. Der Pfad kann dabei relativ zur Datei angegeben werden, in der man sich befindet. 

Die Datei wird also eingelesen und dabei entstehen zwei Möglichkeiten: entweder ein Fehler (wenn die Datei nicht existiert, oder beschädigt ist, oder bei der Ausführung etwas schiefgeht) oder die eingelesenen Daten stehen zur Verfügung. Das sind genau die beiden Argumente, die die innere Funktion konsumieren kann.

Wenn nur der Dateipfad und die Callbackfunktion gegeben sind, dann kann man innerhalb dieser inneren (Callback-) Funktion auf einen sogenannten "Buffer" zugreifen. Ohne zu tief in das Thema einzusteigen: die Funktion heißt ```readFile```, weil sie Dateien lesen kann. NodeJS und die Funktion können dabei nicht wissen, was für eine Datei das ist. Mögilch ist alles von Bildern über Musikdateien oder kompilierter Maschinencode oder sonstige Formate, die es gibt bis hin zu Textdateien und selbst dann muss unser Programm noch wissen, welche Textformatierung vorliegt, um den Text auch korrekt einlesen zu können. Im Beispiel oben wurde eine Textdatei eingelesen und um diese in der Konsole ausgeben zu können, wurde sie in einen String umgewandelt, wobei die ```toString```-Funktion die Formatierung als Argument erhalten hat, ```.toString('utf8')```. Ohne die Konvertierung, hätte unser Code eine Repräsentation des Buffers (in etwa ```<Buffer 3c 21 44 4f 43 54 ...>```) ausgegeben. Weiß man im Vorhinein, welche Art von Datei man etwartet, kann man ```readFile``` auch als zweites Argument nach dem Dateipfad Optionen mitgeben. Will man wie oben eine Textdatei im "utf8"-Format einlesen, wäre das 

```javascript
fs.readFile('relative/file.path', 'utf8', function(error, fileContent) { ... })
```

was in sich wiederum eine Kurzschreibweise für 

```javascript
fs.readFile('relative/file.path', { encoding: 'utf8' }, function(error, fileContent) { ... })
```

darstellt. In diesem Optionsobjekt können auch weitere Optionen angegeben werden, mehr dazu in der [Dokumentation](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback).

## Eine statische Webseite bereitstellen - Jetzt aber wirklich

Im Grunde geht jetzt alles ganz schnell. Wollen wir auf eine Anfrage an den Server eine Datei zurücksenden brauchen wir nur ein paar Elemente: den Server, die Datei und die Anfrage. Der einfachste Server sähe in dem Fall in etwa so aus:

```javascript
var server = http.createServer(function (request, response) {

  fs.readFile("public/index.html", function (error, fileContent) {

    if (error) {
      // we have to handle the error, else the server would break and stop
      response.writeHead(404); // famous 404 error
      response.write('File not found.');
    
    } else {
      // simply send over the buffer as is
      response.write(fileContent);
    }
    // connection needs to be closed
    response.end();
  });
});
```

Diese grob acht Zeilen sinnvoller Inhalt (ohne Leerzeilen etc.) sollten ausreichen, um die gewünschte Datei zurückzugeben.  Es gibt allerdings ein paar Punkte, die noch Arbeit gebrauchen könnten: wie wir die Anfrage verarbeiten und was wir genau zurückschicken. 

Betrachten wir erst die Anfrage. Im aktuellen Zustand senden wir immer unsere Datei zurück, egal was gefragt wird. Bei ```localhost:port/``` wird das selbe zurückgesendet wie bei ```localhost:port/something/else```. Haben wir nur eine einzige Seite in der Style und JavaScript direkt enthalten sind, ohne weitere benötigte Anfragen für den Inhalt, dann ist das vollkommen ausreichend. Die Realität steht uns dabei allerdings im Weg. Wollen wir HTML, CSS und JS beispielsweise in mehrere Dateien aufspalten, müssen wir uns etwas neues einfallen lassen.

Was passiert, wenn ein Browser unsere Daten erhält? Moderne Browser sind intelligent genug programmiert um zu erkennen, dass der Datenstrom, den wir übersenden Text enthält und da er mit dem ```<!DOCTYPE html>``` beginnt, ist es eine HTML-Datei. Um sicher zu gehen, können wir das dem Browser auch in einem sogenannten "Header" vorher mitteilen.

```javascript
...
  // tell the status is ok and the content is of type html
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(fileContent);
...
```

Für die üblichen Dateitypen ist das mitsenden des "Content-Type"-Headers nicht notwendig, manche Arten von Datenübertragungen benötigen ihn allerdings schon. Es bietet sich also eigentlich immer an es zu tun, da es nie schadet. Wie oben schon einmal gesehen, können wir auch gleich noch einen [Statuscode](https://developer.mozilla.org/de/docs/Web/HTTP/Status) mitsenden, in diesem Fall ist es einfach "OK". 

Dieser kleine Umweg hilft dabei zu verstehen, was danach passiert. Erhält der Browser eine HTML-Datei, wird der Inhalt geparst, konvertiert und ein Strukturbaum der Datei aufgebaut (das sogenannte Document Object Model, kurz DOM). Verschiedene Arten von Elementen werden dabei unterschiedlich behandelt, aber im Prinzip liest der Browser die Datei von oben nach unten durch. Kommt er an die Stelle in der auf ein Stylesheet verlinkt wird, sieht er nach, ob er die Datei an dem angegebenen Pfad schon hat und wenn nicht, dann sendet er an den Server eine Anfrage zu genau diesem Pfad (außer es ist eine vollständige URI, dann fragt er diese an). Was heißt das für uns? Wir müssen herausfinden, was genau die Anfragen an unseren Server sind.

Die innere Funktion unseres Servers erhält immer zwei Argumente, ```request``` und ```response```. Mit der Antwort, ```response``` haben wir ja schon gearbeitet, aber mit der Anfrage, ```request``` noch nicht. Die Anfrage enthält extrem viele Informationen: über den Anfragenden, die Laufzeitumgebung, das System, die Verbindung, was als Antwort erwartet wird, mitgesendete Daten - es ist [faszinierend](https://nodejs.org/api/http.html#http_class_http_incomingmessage). Wir wollen aber für den Moment nur eins wissen: welche URL wollte der Anfragensteller aufrufen? Als wäre es absicht, steht genau diese Eigenschaft zur Verfügung und kann von uns direkt genutzt werden:

```javascript
var server = http.createServer(function (request, response) {

  if (req.url === '/') {
    // send back index.html
  }

});
```

Wird bei der Anfrage kein Pfad angegeben, dann wird das im Server immer interpretiert als eine Anfrage an ```localhost:port/```, also mit einem Slash am Ende, die sogenannte "root request". Gibt der Anfragende nichts an, sollten wir unsere ```index.html```-Seite zurücksenden. Danach geht der oben beschriebene Prozess los, erst mal wird die Style-Datei angefragt, also müssen wir das erwarten:

```javascript
var server = http.createServer(function (request, response) {

  if (req.url === '/') {
    // send back index.html
  } else if (req.url === "/styles.css") {
    fs.readFile("public/styles.css", function (error, fileContent) {
      if (error) {
        ...
      } else {
        // small difference here: this file is not html, it is css
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(fileContent);
    }

    res.end();
    });
  }

});
```

Das war zu einem gewissen Grad absehbar. In der HTML-Datei ist ```<link rel="stylesheet" href="styles.css">``` angegeben, das heißt also relativ zur HTML-Datei ist der Pfad zur CSS-Datei im selben Ordner, nur mit anderem Namen. Das Prinzip bleibt auch dann erhalten, wenn die Datei an einem anderen Ort liegt. In unserem Projekt haben wir unter anderem auch eine Logo-Datei, die in einem Ordner liegt. In unserem HTML wird das Bild eingebunden durch ```<img src="assets/logo.png" alt="TechAcademy" />```. Wollen wir, dass das Bild auf Anfrage gesendet wird, erweitern wir unsere Logik entsprechend:

```javascript
var server = http.createServer(function (request, response) {

  if (req.url === '/') {
    // send back index.html
  } else if (req.url === "/styles.css") {
    // send back styles.css
    });
  } else if (req.url === "/assets/logo.png") {
    fs.readFile("public/assets/logo.png", function (error, fileContent) {
      if (error) {
        ...
      } else {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.write(fileContent);
      }
        
      res.end();
    });
  }

});
```

Auch auf die Gefahr hin, dass es langsam langweilig wird: das Prinzip hält auch dann, wenn man beispielsweise innerhalb einer verbundenen Datei, hier der CSS-Datei, auf einen anderen Inhalt verweist. Bei uns ist das eine Schriftart. Um den Text nicht noch mehr in die Länge zu ziehen, verweise ich hier einfach mal auf den Code (```http-server.js```).

## Daten senden und empfangen



## ExpressJS

## Eine statische Webseite bereitstellen mit ExpressJS

## Dynamische Inhalte

## Ein hauch von Persistenz

## CRUD Grundlagen

## Datenbank Grundlagen

## Fazit

# TODOs
- [ ] Inhalte ergänzen
- [ ] Dateien ergänzen
- [ ] Quellen finden und hinzufügen
- [ ] Weiterführende Links funden und hinzufügen
- [ ] Englische Version schreiben

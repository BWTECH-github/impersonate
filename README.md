# Als Benutzer anmelden

Erlaubt Administratoren und Gruppen-Administratoren, sich vorübergehend als ein
anderer Konto anzumelden — um zu sehen, was dieses Konto sieht. Nützlich bei
Support-Anfragen, bei denen die Beschreibung nicht weiterhilft.

## Wie es benutzt wird

Nach der Installation erscheint in der Benutzerverwaltung eine zusätzliche
Spalte. Ein Klick auf das Symbol neben einem Konto meldet Sie als dieses Konto
an. Ihre eigene Sitzung bleibt in der Zwischenzeit bestehen; oben auf der Seite
steht durchgehend ein Hinweis, dass Sie gerade in fremdem Namen unterwegs sind.
Abmelden bringt Sie in Ihre eigene Sitzung zurück.

## Was das bedeutet

Wer ein Konto übernimmt, sieht dessen Dateien, Freigaben und Einstellungen und
kann darin handeln — Aktionen erscheinen im Protokoll unter dem übernommenen
Konto. Das ist ein weitreichendes Recht. Setzen Sie es sparsam ein, und
begrenzen Sie es (siehe unten), wo es geht.

Nicht übernehmen lässt sich ein Konto mit Administratorrechten durch einen
Gruppen-Administrator.

## Voraussetzungen

* owncloud.online 11.x
* PHP 8.4

## Installation

Über den Market, oder von Hand:

```bash
cd /var/www/owncloud.online/apps
git clone https://github.com/BWTECH-github/impersonate.git
chown -R www-data:www-data impersonate
sudo -u www-data php8.4 ../occ app:enable impersonate
```

## Einstellungen

Einstellungen → Benutzerauthentifizierung. Dort lässt sich die Übernahme auf
bestimmte Gruppen begrenzen: Ist die Einschränkung aktiv, darf ein
Gruppen-Administrator nur Mitglieder der eigenen Gruppe übernehmen.

## Bekannte Grenze

Ein Konto, das sich **noch nie angemeldet hat**, lässt sich nicht übernehmen:
Das Dateisystem dieses Kontos wird erst bei der ersten echten Anmeldung
angelegt. Sie landen dann auf einer Fehlerseite und kommen nur durch Löschen des
Sitzungscookies wieder heraus. Lassen Sie das Konto sich einmal selbst anmelden.

## Entwicklung

```bash
make build-dep     # Abhängigkeiten
make js-templates  # Handlebars-Vorlagen übersetzen
make dist          # Paket bauen
```

## Herkunft

Fork der gleichnamigen ownCloud-App, gepflegt von der BW-Tech GmbH für
owncloud.online und PHP 8.4. Lizenz: AGPLv3.

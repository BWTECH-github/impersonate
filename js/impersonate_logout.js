/**
 * Hinweisleiste, solange jemand als anderer Benutzer angemeldet ist: unter der Kopfleiste,
 * auf jeder Seite der Schale. „Zurück zu meinem Konto“ ist die Abmeldung – die App fängt sie
 * ab und kehrt zum eigenen Konto zurück (controller/logoutcontroller.php).
 */
(function () {
	'use strict';

	function leiste() {
		if (document.getElementById('impersonate-leiste')) {
			return;
		}
		var nutzer = OC.getCurrentUser();
		var bar = document.createElement('div');
		bar.id = 'impersonate-leiste';
		bar.className = 'impersonate-leiste';
		var text = document.createElement('p');
		// escape:false – textContent maskiert selbst
		text.textContent = t('impersonate', 'Logged in as {currentUser}', {currentUser: nutzer.displayName || nutzer.uid}, null, {escape: false});
		bar.appendChild(text);
		var abmelden = document.getElementById('logout');
		if (abmelden && abmelden.getAttribute('href')) {
			var zurueck = document.createElement('a');
			zurueck.href = abmelden.getAttribute('href');
			zurueck.textContent = t('impersonate', 'Back to my account');
			bar.appendChild(zurueck);
		}
		// In der Schale ist die Hauptspalte eine Spalte aus Kopfleiste und Inhalt: die Leiste
		// steht dazwischen und nimmt dem Inhalt ihre Höhe, statt ihn zu verdecken.
		var kopf = document.querySelector('.oco-main > header[role="banner"]');
		if (kopf) {
			kopf.parentNode.insertBefore(bar, kopf.nextSibling);
		} else {
			document.body.insertBefore(bar, document.body.firstChild);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', leiste);
	} else {
		leiste();
	}
})();

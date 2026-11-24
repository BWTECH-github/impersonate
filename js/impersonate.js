/**
 * Als Benutzer anmelden: Eintrag im Zeilenmenü („…“) der Benutzerverwaltung.
 *
 * Die Benutzerliste des Redesigns hat keine Spalte mehr für Aktionen dieser Art; Aktionen
 * für ein Konto stehen im Zeilenmenü (MASSSTAB 2.2/3.5). Das Menü baut der Kern
 * (core/js/owncloud-online-screens.js, userRowMenu) und füllt es bei jedem Öffnen neu; der
 * Eintrag hier wird deshalb nach dem Füllen ans Ende gesetzt. Gestaltung und Leertaste
 * liefert der Kern (a.oco-row-menu-action mit role="menuitem").
 *
 * Ob der Eintrag erscheint, entscheidet dieselbe Regel wie am Server
 * (controller/settingscontroller.php); der Server prüft ohnehin selbst.
 */
(function () {
	'use strict';

	var KLASSE = 'impersonate-aktion';
	var daten = $.get(OC.generateUrl('apps/impersonate/getimpersonatedata')).promise();

	function wahr(wert) {
		return wert === true || $.trim(String(wert)) === 'true';
	}

	function liste(wert) {
		try {
			var gruppen = JSON.parse(wert);
			return _.isArray(gruppen) ? gruppen : [];
		} catch (e) {
			return [];
		}
	}

	function gruppenDerZeile($tr) {
		var gruppen = $tr.find('.groups').data('groups');
		return _.isArray(gruppen) ? gruppen : _.keys(gruppen || {});
	}

	// Ein Gruppenadministrator sieht in der Gruppenliste links nur die Gruppen, die er verwaltet.
	function eigeneGruppen() {
		return $('#usergrouplist li[data-gid]').map(function () {
			return $(this).attr('data-gid');
		}).get().filter(function (gid) {
			return gid !== '_everyone';
		});
	}

	/**
	 * @param {Array} antwort [freigegebene Gruppen, Einschränkung auf Gruppen an, alle
	 *        Gruppenadministratoren, ist Administrator, ist Gruppenadministrator]
	 */
	function darf(antwort, $tr) {
		if (String($tr.data('uid')) === OC.getCurrentUser().uid) {
			return false;
		}
		if (wahr(antwort[3])) {
			return true;
		}
		if (!wahr(antwort[4])) {
			return false;
		}
		if (wahr(antwort[2])) {
			return true;
		}
		// Nur für die freigegebenen Gruppen, die dieser Gruppenadministrator auch verwaltet
		if (!wahr(antwort[1])) {
			return false;
		}
		var zeile = gruppenDerZeile($tr);
		var eigene = eigeneGruppen();
		return liste(antwort[0]).some(function (gid) {
			gid = $.trim(gid);
			return zeile.indexOf(gid) !== -1 && eigene.indexOf(gid) !== -1;
		});
	}

	function eintrag(tr) {
		var wer = String($(tr).data('uid'));
		var a = document.createElement('a');
		a.href = '#';
		a.className = 'oco-row-menu-action ' + KLASSE;
		a.setAttribute('role', 'menuitem');
		a.setAttribute('aria-label', t('impersonate', 'Impersonate') + ': ' + wer);
		var bild = document.createElement('img');
		bild.className = 'oco-icon';
		bild.alt = '';
		bild.src = OC.imagePath('core', 'actions/user');
		var text = document.createElement('span');
		text.textContent = t('impersonate', 'Impersonate');
		a.appendChild(bild);
		a.appendChild(text);
		return a;
	}

	// Setzt den Eintrag ans Ende des Zeilenmenüs, sobald es den Kern gibt
	function ergaenzen(tr) {
		var menue = tr && tr.querySelector('.oco-row-menu');
		if (!menue) {
			return;
		}
		var vorhanden = menue.querySelector('.' + KLASSE);
		if (tr.getAttribute('data-impersonate') !== '1') {
			if (vorhanden) {
				vorhanden.parentNode.removeChild(vorhanden);
			}
			return;
		}
		if (!vorhanden) {
			vorhanden = eintrag(tr);
		}
		if (menue.lastElementChild !== vorhanden) {
			menue.appendChild(vorhanden);
		}
		// „Keine Einträge“ setzt der Kern, wenn er selbst nichts hineinlegt
		var leer = menue.querySelector('.oco-row-menu-empty');
		if (leer) {
			leer.parentNode.removeChild(leer);
		}
	}

	function alleErgaenzen() {
		var zeilen = document.querySelectorAll('#userlist tbody tr[data-impersonate]');
		for (var i = 0; i < zeilen.length; i++) {
			ergaenzen(zeilen[i]);
		}
	}

	OC.Plugins.register('OC.Settings.UserList', {
		attach: function (userList) {
			var add = userList.add;
			userList.add = function (user) {
				var $tr = add.apply(this, arguments);
				if ($tr) {
					// Ein Konto, das sich nie angemeldet hat, hat noch kein Dateisystem – der Server
					// lehnt ab, also gar nicht erst anbieten
					var nie = user && user.lastLogin === 0;
					daten.then(function (antwort) {
						$tr.attr('data-impersonate', !nie && darf(antwort, $tr) ? '1' : '0');
						ergaenzen($tr[0]);
					});
				}
				return $tr;
			};
		}
	});

	function impersonate(target) {
		$.post(OC.generateUrl('apps/impersonate/user'), {target: target})
			.done(function () {
				OC.redirect(OC.generateUrl(''));
			})
			.fail(function (antwort) {
				var json = antwort.responseJSON || {};
				OC.dialogs.alert(json.message || t('impersonate', 'Unexpected error occurred'), t('impersonate', 'Error'));
			});
	}

	$(document).ready(function () {
		var $liste = $('#userlist');
		if (!$liste.length) {
			return;
		}
		// Der Kern füllt das Menü bei jedem Öffnen neu (auch per Tastatur: Enter und
		// Leertaste lösen am Knopf einen Klick aus). Danach den Eintrag ans Ende setzen.
		$liste[0].addEventListener('click', function (e) {
			var knopf = e.target.closest && e.target.closest('.oco-row-more');
			if (knopf) {
				window.setTimeout(function () {
					ergaenzen(knopf.closest('tr'));
				}, 0);
			}
		}, true);
		if (typeof MutationObserver !== 'undefined') {
			var geplant = false;
			new MutationObserver(function () {
				if (geplant) {
					return;
				}
				geplant = true;
				window.requestAnimationFrame(function () {
					geplant = false;
					alleErgaenzen();
				});
			}).observe($liste[0], {childList: true, subtree: true});
		}
		$liste.on('click', '.' + KLASSE, function (e) {
			e.preventDefault();
			var $tr = $(this).closest('tr');
			var menue = this.closest('.oco-row-menu');
			if (menue) {
				menue.hidden = true;
				$tr.find('.oco-row-more').attr('aria-expanded', 'false');
			}
			impersonate(String($tr.data('uid')));
		});
	});
})();

/**
 * Karte „Als Benutzer anmelden“ (Verwaltung › Nutzer-Authentifizierung): Die Wahl wirkt sofort,
 * die Rückmeldung gibt der Kern (OC.AppConfig). Die Gruppenliste gilt nur bei der dritten Wahl;
 * bei den anderen steht am Server eine leere Liste, damit nichts Altes weiterwirkt.
 */
$(document).ready(function () {
	var $gruppen = $('#includedGroups');
	var $block = $('#selectIncludedGroups');

	function setzen(schluessel, wert) {
		OC.AppConfig.setValue('impersonate', schluessel, wert);
	}

	function gewaehlteGruppen() {
		var wert = $gruppen.val();
		return wert ? wert.split('|') : [];
	}

	$('#impersonateNoGroupAdmins').on('change', function () {
		$block.addClass('hidden');
		setzen('impersonate_all_groupadmins', 'false');
		setzen('impersonate_include_groups', 'false');
		setzen('impersonate_include_groups_list', JSON.stringify([]));
	});

	$('#impersonateAllGroupAdmins').on('change', function () {
		$block.addClass('hidden');
		setzen('impersonate_all_groupadmins', 'true');
		setzen('impersonate_include_groups', 'false');
		setzen('impersonate_include_groups_list', JSON.stringify([]));
	});

	// Die Auswahl bleibt im Feld stehen; zurück bei dieser Wahl gilt sie wieder
	$('#impersonateIncludeGroups').on('change', function () {
		$block.removeClass('hidden');
		setzen('impersonate_all_groupadmins', 'false');
		setzen('impersonate_include_groups', 'true');
		setzen('impersonate_include_groups_list', JSON.stringify(gewaehlteGruppen()));
	});

	OC.Settings.setupGroupsSelect($gruppen);
	$gruppen.on('change', function (ev) {
		setzen('impersonate_include_groups_list', JSON.stringify(ev.val || []));
	});
});

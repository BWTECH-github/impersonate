<?php
/** @var array $_ */
/** @var \OCP\IL10N $l */
script('impersonate', 'settings-admin');
style('impersonate', 'settings-admin');
?>
<div class="section" id="impersonate-einstellungen">
	<h2 class="app-name"><?php p($l->t('Impersonate')); ?></h2>

	<?php /* Wirkt sofort beim Wählen (js/settings-admin.js), deshalb kein Speichern-Knopf. */ ?>
	<fieldset class="oco-optionsgruppe">
		<legend><?php p($l->t('Who may log in as another user')); ?></legend>
		<p>
			<input type="radio" name="groupadmins" id="impersonateNoGroupAdmins" class="radio" value="admins"<?php if ($_['mode'] === 'admins') {
				print_unescaped(' checked="checked"');
			} ?>>
			<label for="impersonateNoGroupAdmins"><?php p($l->t('Only an administrator is allowed to impersonate users')); ?></label>
		</p>
		<p>
			<input type="radio" name="groupadmins" id="impersonateAllGroupAdmins" class="radio" value="all"<?php if ($_['mode'] === 'all') {
				print_unescaped(' checked="checked"');
			} ?>>
			<label for="impersonateAllGroupAdmins"><?php p($l->t('Allow all group admins to impersonate users within the groups they are admins of')); ?></label>
		</p>
		<p>
			<input type="radio" name="groupadmins" id="impersonateIncludeGroups" class="radio" value="groups"<?php if ($_['mode'] === 'groups') {
				print_unescaped(' checked="checked"');
			} ?>>
			<label for="impersonateIncludeGroups"><?php p($l->t('Allow group admins of specific groups to impersonate the users within those groups')); ?></label>
		</p>
	</fieldset>

	<?php /* Hängt an der dritten Wahl: eingerückt (Kern: .section > p.indent) und nur dann sichtbar.
		Die Beschriftung nennt select2 den Namen des Suchfelds; sichtbar beschriftet die Wahl darüber. */ ?>
	<p id="selectIncludedGroups" class="indent<?php if ($_['mode'] !== 'groups') {
		p(' hidden');
	} ?>">
		<label for="includedGroups" class="hidden-visually"><?php p($l->t('Groups')); ?></label>
		<input type="hidden" name="impersonate_include_groups_list" id="includedGroups" value="<?php p($_['groups']); ?>">
	</p>
</div>

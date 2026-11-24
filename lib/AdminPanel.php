<?php
/**
 * @author Sujith Haridasan <sharidasan@owncloud.com>
 *
 * @copyright Copyright (c) 2017, ownCloud GmbH
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

namespace OCA\Impersonate;

use OCP\IConfig;
use OCP\Settings\ISettings;
use OCP\Template;

class AdminPanel implements ISettings {
	/** @var IConfig */
	private $config;

	public function __construct(IConfig $config) {
		$this->config = $config;
	}

	public function getPanel() {
		// Reihenfolge wie im Server (controller/settingscontroller.php): „alle Gruppenadministratoren“
		// geht der Gruppenliste vor
		$alle = $this->config->getAppValue('impersonate', 'impersonate_all_groupadmins', 'false') !== 'false';
		$gruppen = $this->config->getAppValue('impersonate', 'impersonate_include_groups', 'false') !== 'false';
		$liste = \json_decode($this->config->getAppValue('impersonate', 'impersonate_include_groups_list', '[]'), true);

		$t = new Template('impersonate', 'settings-admin');
		$t->assign('mode', $alle ? 'all' : ($gruppen ? 'groups' : 'admins'));
		$t->assign('groups', \is_array($liste) ? \implode('|', $liste) : '');
		return $t;
	}

	public function getSectionID() {
		return 'authentication';
	}

	public function getPriority() {
		return 0;
	}
}

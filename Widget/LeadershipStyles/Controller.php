<?php

namespace Plugin\PrismAssessment\Widget\LeadershipStyles;

class Controller extends \Ip\WidgetController {


	public function getTitle() {
		return 'Leadership Styles';
	}

	public function generateHtml($revisionId, $widgetId, $data, $skin) {
		$data['revisionId'] = $revisionId;
        ipAddJs('assets/application.js');
		return parent::generateHtml($revisionId, $widgetId, $data, $skin);
	}
}

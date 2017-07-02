<?php

namespace Plugin\PrismAssessment\Widget\ResultsChart;

class Controller extends \Ip\WidgetController {


	public function getTitle() {
		return 'Result Chart';
	}

	public function generateHtml($revisionId, $widgetId, $data, $skin) {
		return parent::generateHtml($revisionId, $widgetId, $data, $skin);
	}
}

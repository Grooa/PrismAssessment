<?php

namespace Plugin\PrismAssessment;


class Event
{
    public static function ipBeforeController()
    {
        //Add CSS, JS, set block content
        ipAddCss('assets/application.css');
        ipAddJs('assets/application.js');

		ipAddJsVariable(
			'prismAssessmentResultPage',
			ipGetOption('PrismAssessment.resultPage', '')
		);
    }

}

<?php
namespace Plugin\PrismAssessment;

use Ip\Exception;
use \Ip\Internal\Plugins\Service as PluginService;

class Worker {

    public function activate() {
        $plugins = PluginService::getActivePluginNames();

        if (!in_array('Mailchimp', $plugins)) {
            throw new Exception("PrismAssessment requires MailChimp Plugin from Grooa, to function properly");
        }
    }
}
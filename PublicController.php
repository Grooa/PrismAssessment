<?php


namespace Plugin\PrismAssessment;

use \Ip\Form\Validator\Email as EmailValidator;
use \Ip\Form;


class PublicController extends \Ip\Controller
{


	/**
	 * Register a test result with a corresponding e-mail.
	 */
	public function registerTestResult() {
		$request = ipRequest();
		$data = $request->getPost();

		if (!$request->isPost()) {
			return new \Ip\Response("Method not allowed", null, 405);
		}

		// Verify
		if (
			empty($data['fname']) ||
			empty($data['lname']) ||
			empty($data['email']) ||
			!preg_match('/^[^@\/]+@[^@\/]+\.[a-z]+$/i', $data['email'])
		) {
			return new \Ip\Response(null, null, 422);
		}

		$recipient = ipGetOption('PrismAssessment.recipientEmail', 'truls@grooa.com');

		// Send mail to admin
		ipSendEmail(
			ipGetOptionLang('Config.websiteEmail'),
			ipGetOptionLang('Config.websiteTitle'),
			$recipient,
			$recipient,
			'New Test Results',
			"Hi!\r\nSomeone has taken the test at The Clear Mindset. Here are the details:\r\n" .
			"First name: " . esc($data['fname']) . "\r\n" .
			"Last name: " . esc($data['lname']) . "\r\n" .
			"Email: " . esc($data['email']) . "\r\n" .
			"Newsletters: " . (isset($data['allow_newsletters']) ? 'yes' : 'no'),
			true, // Urgent
			false // HTML
		);

		// Send mail to user
		ipSendEmail(
			ipGetOptionLang('Config.websiteEmail'),
			ipGetOptionLang('Config.websiteTitle'),
			$data['email'],
			$data['email'],
			'CAP Test Results',
			"Hi!\r\nThanks for trying our CAP test. " .
			"Here is a link for your results:\r\n" . $data['link'] .
			"\r\n\r\nRemember to book your 20 minutes free debrief call at " .
			"https://goo.gl/forms/g3FlDUNAUaoVXOHM2" .
			"\r\n\r\nThe C.L.E.A.R. Mindset",
			true, // Urgent
			false // HTML
		);


		// Register data
		return new \Ip\Response(null, null, 204);
	}


}

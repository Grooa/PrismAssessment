<?php


namespace Plugin\PrismAssessment;

use Mailgun\Exception\HttpClientException;
use \Plugin\Mailgun\Model as Mailgun;
use \Plugin\Mailchimp\Model as MailChimp;

class PublicController extends \Ip\Controller
{


    /**
     * Register a test result with a corresponding e-mail.
     */
    public function registerTestResult()
    {
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

        try {
            self::sendMessageToUser($data['email'], $data['fname'], $data['link']);
        } catch(HttpClientException $e) {
            ipLog()->error('[Fatal Error] CAP-test: ' . $e->getMessage(), [
                'code' => $e->getCode(),
                'message' => $e->getMessage()
            ]);

            return new \Ip\Response(json_encode([
                'error' => "Something went wrong when trying to deliver the email to you"
            ]), null, 400);
        }

        try {
            self::sendMessageToAdmin($data, $data['allow_newsletters']);
        } catch(HttpClientException $e) { // This isn't critical for the user, and can therefore fail silently
            ipLog()->error('[Fatal Error] CAP-test. Could not notify Admin: ' . $e->getMessage(), [
                'code' => $e->getCode(),
                'message' => $e->getMessage()
            ]);
        }

        if (isset($data['allow_newsletters']) && $data['allow_newsletters'] == true) {
            $member = [
                'email' => $data['email'],
                'fname' => $data['fname'],
                'lname' => $data['lname'],
                'interests' => ['626ca3f0eb', '6855f22992'] // InterestIds (get them from MailChimp API Playground)
            ];

            try {
                MailChimp::addMemberToList($member);
            } catch (\Exception $e) {
                // Exceptions thrown aren't fatal. Logging it is enough.
                ipLog()->error(
                    "[PrismAssessment Subscription Error] \n" . $e->getMessage(),
                    $member
                );
            }
        }

        // Register data
        return new \Ip\Response(null, null, 204);
    }

    /**
     * Sends the notification to the Admin, when a user has taken the CAP test
     * @param mixed $user
     * @param boolean $subscribed
     */
    private static function sendMessageToAdmin($user, $subscribed) {
        $to = ipGetOption('PrismAssessment.recipientEmail', 'webmaster@grooa.com');
        $plain_body = self::buildAdminMessageBody($user, $subscribed);

        ipLog()->info("[Email] CAP Test, sending notification to admin: $to");

        $mg = new Mailgun('webmaster@grooa.com', '[The CLEAR Mindset] CAP new tests results', $to);
        $mg
            ->setToName('')
            ->setFromName("The CLEAR Mindset")
            ->setReplyTo('webmaster@grooa.com')
            ->setPlain($plain_body);

        try {
            $mg
                ->addTag('cap')
                ->addTag('admin-notification');
        } catch(\Exception $e) {
            // Ignore
        }

        $mg->send();

        ipLog()->info('[Email] Notification sent');
    }

    private static function buildAdminMessageBody($user, $subscribed = false) {
        return sprintf(
            "Hi!\r\nSomeone has taken the test at The Clear Mindset. Here are the details:\r\n"
                . "First name: %s\r\n"
                . "Last name: %s\r\n"
                . "Email: %s\r\n"
                . "Subscribed to newsletter: %s",
            $user['fname'],
            $user['lname'],
            $user['email'],
            $subscribed ? 'YES' : 'NO'
        );
    }

    /***
     * @param string $to Address to the recipient
     * @param string $to_name Name of the recipient
     * @param string $link Link to the CAP results
     */
    private static function sendMessageToUser($to, $to_name, $link) {
        $from = ipGetOption('PrismAssessment.recipientEmail', 'webmaster@grooa.com');
        $plain_body = self::buildMessageBody($link);

        ipLog()->info("[Email] sending to $from");

        $mg = new Mailgun($from, '[The CLEAR Mindset] CAP Test Results', $to);
        $mg
            ->setToName($to_name)
            ->setFromName("Laura Lozza")
            ->setReplyTo($from)
            ->setPlain($plain_body)
            ->addTag('cap')
            ->addTag('results')
            ->send();

        ipLog()->info('[Email] message sent');
    }

    private static function buildMessageBody($results_link) {
        $debrief_link = "https://goo.gl/forms/g3FlDUNAUaoVXOHM2";

        return sprintf(
            "Hi!\nThanks for trying our CAP test. You cna find your results here:\r\n\r\n"
                . "%s"
                . "\r\n\r\nRemember to book your 20 minutes free debrief call at %s"
                . "\r\n\r\nBest Regards\r\nThe C.L.E.A.R. Mindset",
            $results_link,
            $debrief_link
        );
    }

}

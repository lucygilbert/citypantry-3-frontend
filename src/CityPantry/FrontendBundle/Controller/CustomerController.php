<?php

namespace CityPantry\FrontendBundle\Controller;

use CityPantry\ApiClient;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\RedirectResponse;

class CustomerController extends BaseController
{
    /**
     * @Route("/customer/account")
     * @Template()
     */
    public function customerPersonalInformationAction()
    {
        $api = $this->getApiClient();

        if (!$api->isLoggedIn()) {
            throw $this->createNotFoundException();
        }

        return [
            'isLoggedIn' => true,
            'user' => $api->getAuthenticatedUser()->json(),
        ];
    }

    /**
     * @Route("/customer/password")
     * @Template()
     */
    public function customerPasswordAction()
    {
        $api = $this->getApiClient();

        if (!$api->isLoggedIn()) {
            throw $this->createNotFoundException();
        }

        return [
            'isLoggedIn' => true,
            'user' => $api->getAuthenticatedUser()->json(),
        ];
    }
}

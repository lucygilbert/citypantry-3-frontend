<?php

namespace CityPantry\FrontendBundle\Controller;

use CityPantry\ApiClient;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\RedirectResponse;

class AdminController extends BaseController
{
    /**
     * @Route("/admin/order")
     * @Template()
     */
    public function ordersAction()
    {
        $api = $this->getApiClient();

        $user = $api->getAuthenticatedUser()->json();
        if (!$user || $user['group']['name'] !== 'staff') {
            throw $this->createNotFoundException();
        }

        return [
            'isLoggedIn' => true,
            'user' => $user,
        ];
    }
}

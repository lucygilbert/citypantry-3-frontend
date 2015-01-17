<?php

namespace CityPantry\FrontendBundle\Controller;

use CityPantry\ApiClient;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\RedirectResponse;

class DefaultController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        $api = $this->getApiClient();

        return [
            'isLoggedIn' => $api->isLoggedIn(),
            'user' => $api->getAuthenticatedUser()->json(),
        ];
    }

    /**
     * @Route("/login")
     * @Template()
     */
    public function loginAction()
    {
        $api = $this->getApiClient();

        if ($api->isLoggedIn()) {
            return new RedirectResponse('/');
        }

        return [];
    }

    /**
     * @Route("/logout")
     * @Template()
     */
    public function logoutAction()
    {
        $response = new RedirectResponse('/');
        $response->headers->clearCookie('userId');
        $response->headers->clearCookie('salt');

        return $response;
    }

    private function getApiClient()
    {
        return ApiClient::createClientFromRequestCookies(
            $this->getRequest(),
            $this->container->getParameter('citypantry_api_endpoint')
        );
    }
}

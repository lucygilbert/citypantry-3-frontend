<?php

namespace CityPantry\FrontendBundle\Controller;

use CityPantry\ApiClient;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\RedirectResponse;

class DefaultController extends BaseController
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
     * @Route("/faq")
     * @Template()
     */
    public function faqAction()
    {
        $api = $this->getApiClient();

        return [
            'isLoggedIn' => $api->isLoggedIn(),
            'user' => $api->getAuthenticatedUser()->json(),
        ];
    }

    /**
     * @Route("/about")
     * @Template()
     */
    public function aboutAction()
    {
        $api = $this->getApiClient();

        return [
            'isLoggedIn' => $api->isLoggedIn(),
            'user' => $api->getAuthenticatedUser()->json(),
        ];
    }

    /**
     * @Route("/contact")
     * @Template()
     */
    public function contactAction()
    {
        $api = $this->getApiClient();

        return [
            'isLoggedIn' => $api->isLoggedIn(),
            'user' => $api->getAuthenticatedUser()->json(),
        ];
    }

    /**
     * @Route("/terms")
     * @Template()
     */
    public function termsAction()
    {
        $api = $this->getApiClient();

        return [
            'isLoggedIn' => $api->isLoggedIn(),
            'user' => $api->getAuthenticatedUser()->json(),
        ];
    }

    /**
     * @Route("/privacy")
     * @Template()
     */
    public function privacyAction()
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
}

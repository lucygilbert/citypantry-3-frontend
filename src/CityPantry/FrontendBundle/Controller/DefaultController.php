<?php

namespace CityPantry\FrontendBundle\Controller;

use CityPantry\ApiClient;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

class DefaultController extends BaseController
{
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

    /**
     * @Route("/{anything}",
     *     requirements={"anything": ".*"}
     * )
     * @Template("angular.html.twig")
     */
    public function angularPagesAction(Request $request)
    {
        $api = $this->getApiClient();

        $includeRegistrationTrackingCode = $request->query->get('includeRegistrationTrackingCode') === '1';

        return [
            'isLoggedIn' => $api->isLoggedIn(),
            'user' => $api->getAuthenticatedUser()->json(),
            'includeRegistrationTrackingCode' => $includeRegistrationTrackingCode,
        ];
    }
}

<?php

namespace CityPantry\FrontendBundle\Controller;

use CityPantry\ApiClient;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class BaseController extends Controller
{
    protected function getApiClient()
    {
        return ApiClient::createClientFromRequestCookies(
            $this->getRequest(),
            $this->container->getParameter('citypantry_api_endpoint')
        );
    }
}

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
     * @Route("/admin/customers")
     * @Template()
     */
    public function customersAction()
    {
        $api = $this->getApiClient();

        $user = $api->getAuthenticatedUser()->json();
        if (!$user || $user['user']['group']['name'] !== 'staff') {
            throw $this->createNotFoundException();
        }

        return [
            'isLoggedIn' => true,
            'user' => $user,
        ];
    }
    
    /**
     * @Route("/admin/customer/{id}")
     * @Template()
     */
    public function customerAction($id)
    {
        $api = $this->getApiClient();

        $user = $api->getAuthenticatedUser()->json();
        if (!$user || $user['user']['group']['name'] !== 'staff') {
            throw $this->createNotFoundException();
        }
        
        $response = $api->request('GET', '/customers/' . $id);
        if ($response->getStatusCode() === 404) {
            throw $this->createNotFoundException('No customer for this ID (' .
                $id . ') exists');
        }
        $customer = json_decode($response->getBody());
        
        return [
            'customer' => $customer,
            'isLoggedIn' => true,
            'user' => $user,
        ];
    }
    
    /**
     * @Route("/admin/orders")
     * @Template()
     */
    public function ordersAction()
    {
        $api = $this->getApiClient();

        // @todo – Refactor authentication to constructor.
        $user = $api->getAuthenticatedUser()->json();
        if (!$user || $user['user']['group']['name'] !== 'staff') {
            throw $this->createNotFoundException();
        }

        return [
            'isLoggedIn' => true,
            'user' => $user,
        ];
    }
    
    /**
     * @Route("/admin/order/{id}")
     * @Template()
     */
    public function orderAction($id)
    {
        $api = $this->getApiClient();

        $user = $api->getAuthenticatedUser()->json();
        if (!$user || $user['user']['group']['name'] !== 'staff') {
            throw $this->createNotFoundException();
        }
        
        $response = $api->request('GET', '/orders/' . $id);
        if ($response->getStatusCode() === 404) {
            throw $this->createNotFoundException('No order for this ID (' .
                $id . ') exists');
        }
        $order = json_decode($response->getBody());
        
        return [
            'isLoggedIn' => true,
            'order' => $order,
            'user' => $user,
        ];
    }
    
    /**
     * @Route("/admin/packages")
     * @Template()
     */
    public function packagesAction()
    {
        $api = $this->getApiClient();

        $user = $api->getAuthenticatedUser()->json();
        if (!$user || $user['user']['group']['name'] !== 'staff') {
            throw $this->createNotFoundException();
        }

        return [
            'isLoggedIn' => true,
            'user' => $user,
        ];
    }
    
    /**
     * @Route("/admin/package/{id}")
     * @Template()
     */
    public function packageAction($id)
    {
        $api = $this->getApiClient();

        $user = $api->getAuthenticatedUser()->json();
        if (!$user || $user['user']['group']['name'] !== 'staff') {
            throw $this->createNotFoundException();
        }
        
        $response = $api->request('GET', '/packages/' . $id);
        if ($response->getStatusCode() === 404) {
            throw $this->createNotFoundException('No package for this ID (' .
                $id . ') exists');
        }
        $package = json_decode($response->getBody());
        
        return [
            'isLoggedIn' => true,
            'package' => $package,
            'user' => $user,
        ];
    }
    
    /**
     * @Route("/admin/vendors")
     * @Template()
     */
    public function vendorsAction()
    {
        $api = $this->getApiClient();

        $user = $api->getAuthenticatedUser()->json();
        if (!$user || $user['user']['group']['name'] !== 'staff') {
            throw $this->createNotFoundException();
        }

        return [
            'isLoggedIn' => true,
            'user' => $user,
        ];
    }
    
    /**
     * @Route("/admin/vendor/{id}")
     * @Template()
     */
    public function vendorAction($id)
    {
        $api = $this->getApiClient();

        $user = $api->getAuthenticatedUser()->json();
        if (!$user || $user['user']['group']['name'] !== 'staff') {
            throw $this->createNotFoundException();
        }
        
        $response = $api->request('GET', '/vendors/' . $id);
        if ($response->getStatusCode() === 404) {
            throw $this->createNotFoundException('No vendor for this ID (' .
                $id . ') exists');
        }
        $vendor = json_decode($response->getBody());
        
        return [
            'isLoggedIn' => true,
            'user' => $user,
            'vendor' => $vendor,
        ];
    }
}

<?php
/**
 * Short description of class goes here
 *
 * Long description (if any)
 *
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Controller
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */
require_once 'Mage/Checkout/controllers/CartController.php';
class Oggetto_AjaxCart_CartController extends Mage_Checkout_CartController //Mage_Core_Controller_Front_Action
{

    /**
     * Overload
     * Add product to shopping cart action
     */
    public function addAction()
    {
        if(!$this->getRequest()->getParam('ajaxcart')){
            parent::addAction();
            return;
        }
        $result['error'] = 'false';
//        if ($this->getRequest()->getParam('ptype') == "configurable"){
//            //$result['redirect'] = $redirectUrl;
//
//        }

        $cart   = $this->_getCart();
        $params = $this->getRequest()->getParams();
        try {

            if (isset($params['qty'])) {
                $filter = new Zend_Filter_LocalizedToNormalized(
                    array('locale' => Mage::app()->getLocale()->getLocaleCode())
                );
                $params['qty'] = $filter->filter($params['qty']);
            }
            $product = $this->_initProduct();
            $related = $this->getRequest()->getParam('related_product');

             /**
             * Check product availability
             */
            if (!$product) {
                return false;
                //$this->_goBack();
                //return;
            }
            $cart->addProduct($product, $params);

            if (!empty($related)) {
                $cart->addProductsByIds(explode(',', $related));
            }
            $cart->save();

            $this->_getSession()->setCartWasUpdated(true);

            $result['error'] = 'success';
        }
        catch (Mage_Core_Exception $e) {
            if ($this->_getSession()->getUseNotice(true)) {
                $this->_getSession()->addNotice($e->getMessage());
            } else {
                $messages = array_unique(explode("\n", $e->getMessage()));
                foreach ($messages as $message) {
                    $this->_getSession()->addError($message);
                }
            }

            $url = $this->_getSession()->getRedirectUrl(true);

            $result['redirect'] = $url;
            if ($this->getRequest()->getParam('ptype') != "simple"){
                $result['redirect'] .= '?options=cart';
                $result['redirect'] .= '&ptype='.$this->getRequest()->getParam('ptype');
            }
        }
        catch (Exception $e) {
            $this->_getSession()->addException($e, $this->__('Cannot add the item to shopping cart.'));
            $this->_goBack();
        }

        switch ($this->getRequest()->getParam('ptype')){
            case 'simple':{
                    
                }
                break;
            case 'configurable':{
                }
                break;
            default:{
                    //$result['error'] = 'false';
                    $result['redirect'] = $url;
                }
                break;
        }

        if (isset($params['in_cart']) || $this->getRequest()->getParam('in_cart')) {
            $result['block'] = $this->getBlockCart();
        } else {
            $result['block'] = $this->getBlockSidebar();
        }

        $result['links'] = $this->getCountItem();
        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($result));

    }

    protected function getCountItem(){
        $count = Mage::helper('checkout/cart')->getSummaryCount();

        if( $count == 1 ) {
            $text = $this->__('My Cart (%s item)', $count);
        } elseif( $count > 0 ) {
            $text = $this->__('My Cart (%s items)', $count);
        } else {
            $text = $this->__('My Cart');
        }
        return $text;
    }

    protected function getBlockCart(){
        $this->loadLayout();
        if (Mage::helper('checkout/cart')->getSummaryCount() < 1){
            $block = $this->getLayout()->createBlock('checkout/cart')->setTemplate('checkout/cart/noItems.phtml');
            return $block->toHtml();
        }
        return $this->getLayout()->getBlock('checkout.cart')->toHtml();
    }

    protected function getBlockSidebar(){
        $this->loadLayout();
        //$block = $this->getLayout()->createBlock('checkout/cart_sidebar')->setTemplate('checkout/cart/sidebar.phtml');
        $block = $this->getLayout()->getBlock('cart_sidebar');
        return $block->toHtml();
    }

    /**
     * Delete shoping cart item action
     */
    public function deleteAction()
    {
        if(!$this->getRequest()->getParam('ajaxcart')){
            parent::deleteAction();
            return;
        }

        $params = $this->getRequest()->getParams();
        $result['error'] = 'success';
        $id = (int) $this->getRequest()->getParam('id');
        if ($id) {
            try {
                $this->_getCart()->removeItem($id)
                  ->save();
            } catch (Exception $e) {
                //exit('1');
                $this->_getSession()->addError($this->__('Cannot remove the item.'));
            }
        }
        if (isset($params['item'])) {
            $result['block'] = $this->getBlockCart();
        } else {
            $result['block'] = $this->getBlockSidebar();
        }
        $result['links'] = $this->getCountItem();
        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($result));
    }


}
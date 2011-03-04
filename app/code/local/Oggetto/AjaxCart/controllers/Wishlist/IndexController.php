<?php
/**
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Controller
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */
require_once 'Mage/Wishlist/controllers/IndexController.php';
class Oggetto_AjaxCart_Wishlist_IndexController extends Mage_Wishlist_IndexController
{
    /**
     * Add wishlist item to shopping cart and remove from wishlist
     *
     * If Product has required options - item removed from wishlist and redirect
     * to product view page with message about needed defined required options
     *
     */
    public function cartAction()
    {
        if(!$this->getRequest()->getParam('ajaxcart')){
            return parent::cartAction();
        }
        $result['error'] = 'success';

        $wishlist   = $this->_getWishlist();
//        if (!$wishlist) {
//            //return $this->_redirect('*/*');
//            return false;
//        }

        $itemId     = (int)$this->getRequest()->getParam('item');
        /* @var $item Mage_Wishlist_Model_Item */
        $item       = Mage::getModel('wishlist/item')->load($itemId);

//        if (!$item->getId() || $item->getWishlistId() != $wishlist->getId()) {
//            //return $this->_redirect('*/*');
//             return false;
//        }

        /* @var $session Mage_Wishlist_Model_Session */
        $session    = Mage::getSingleton('wishlist/session');
        $cart       = Mage::getSingleton('checkout/cart');

        $redirectUrl = Mage::getUrl('*/*');
        $result['error'] = 'success';
        try {
            $item->addToCart($cart, true);
            $cart->save()-> getQuote()->collectTotals();
            $wishlist->save();

            Mage::helper('wishlist')->calculate();
            if (Mage::helper('checkout/cart')->getShouldRedirectToCart()) {
                $redirectUrl = Mage::helper('checkout/cart')->getCartUrl();
            } else if ($this->_getRefererUrl()) {
                $redirectUrl = $this->_getRefererUrl();
            }
        } catch (Mage_Core_Exception $e) {

            $result['error'] = 'false';
            if ($e->getCode() == Mage_Wishlist_Model_Item::EXCEPTION_CODE_NOT_SALABLE) {
                $session->addError(Mage::helper('wishlist')->__('This product(s) is currently out of stock'));
            } else if ($e->getCode() == Mage_Wishlist_Model_Item::EXCEPTION_CODE_HAS_REQUIRED_OPTIONS) {
                $redirectUrl = $item->getProductUrl();
                $item->delete();
            } else if ($e->getCode() == Mage_Wishlist_Model_Item::EXCEPTION_CODE_IS_GROUPED_PRODUCT) {
                $redirectUrl = $item->getProductUrl();
                $item->delete();
            } else {
                $session->addError($e->getMessage());
            }
        } catch (Exception $e) {
            exit('5');
            $session->addException($e, Mage::helper('wishlist')->__('Cannot add item to shopping cart'));
        }

        Mage::helper('wishlist')->calculate();

        $result['redirect'] = $redirectUrl;

        $result['linkwishlist'] = $this->getCountWishlist();
        $result['links'] = $this->getCountItem();

        if(!$this->getRequest()->getParam('acwish')){
            $result['wishlist'] = $this->getWishlistSidebar();
        }else{

            $result['wishlist'] = $this->getWishlistBlock();
        }
        if($result['error'] == 'success'){
            $result['block'] = $this->getBlockSidebar();
        }

        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($result));
        return;

        return $this->_redirectUrl($redirectUrl);
    }

    protected function getBlockSidebar(){
        $this->loadLayout();
        //$block = $this->getLayout()->createBlock('checkout/cart_sidebar')->setTemplate('checkout/cart/sidebar.phtml');
        $block = $this->getLayout()->getBlock('cart_sidebar');
        return $block->toHtml();
    }

    protected function getWishlistSidebar(){
        $this->loadLayout();
        $block = $this->getLayout()->createBlock('wishlist/customer_sidebar')->setTemplate('wishlist/sidebar.phtml');
        return $block->toHtml();
    }

    protected function getLinksBar(){
        exit('!!!!!!');
        $this->loadLayout();
        $block = $this->getLayout()->getBlock('footer_links');
        return $block->toHtml();
    }

    protected function getWishlistBlock(){
        $this->loadLayout();
        $block = $this->getLayout()->createBlock('wishlist/customer_wishlist')->setTemplate('wishlist/view.phtml');
        return $block->toHtml();
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

    protected function getCountWishlist(){
        $count = Mage::helper('wishlist/data')->getItemCount();
        if ($count > 1) {
            $text = $this->__('My Wishlist (%d items)', $count);
        }
        else if ($count == 1) {
            $text = $this->__('My Wishlist (%d item)', $count);
        }
        else {
            $text = $this->__('My Wishlist');
        }
        return $text;
    }


}

<?php
/**
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Block
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */
class Oggetto_AjaxCart_Block_Checkout_Cart_Crosssell extends Mage_Checkout_Block_Cart_Crosssell
{
    /**
    * Retrieve url for add product to cart
    * Will return product view page URL if product has required options
    *
    * @param Mage_Catalog_Model_Product $product
    * @param array $additional
    * @return string
    */
    public function getAddToCartUrl($product, $additional = array())
    {
        //$AddToCartUrl = Mage::helper('ajaxcart')->delSid(parent::getAddToCartUrl($product, $additional));
        $AddToCartUrl = parent::getAddToCartUrl($product, $additional);
        switch ($product['type_id']){
            case 'configurable':{
                return $AddToCartUrl.'?ptype='.$product['type_id'].'&in_cart=1&';
            }
            break;
            case 'simple':{
                $AddToCartUrl = Mage::helper('ajaxcart')->delSid(parent::getAddToCartUrl($product, $additional));
                return $AddToCartUrl.'ptype/'.$product['type_id'].'/';
            }
            break;
            default:

                break;
        }
        return $AddToCartUrl.'ptype/'.$product['type_id'].'/in_cart/1/';
    }


}

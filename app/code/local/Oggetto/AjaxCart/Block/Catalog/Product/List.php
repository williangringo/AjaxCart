<?php
/**
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Block
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */
class Oggetto_AjaxCart_Block_Catalog_Product_List extends Mage_Catalog_Block_Product_List
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
        switch ($product['type_id']){
            case 'configurable':{
                return parent::getAddToCartUrl($product, $additional).'?ptype='.$product['type_id'];
            }
            break;
            case 'simple':{
                return parent::getAddToCartUrl($product, $additional).'ptype/'.$product['type_id'].'/';
            }
            break;
            default:

                break;
        }
        return parent::getAddToCartUrl($product, $additional).'ptype/'.$product['type_id'].'/';
    }

}

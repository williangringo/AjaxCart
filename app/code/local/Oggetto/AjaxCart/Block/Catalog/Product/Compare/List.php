<?php
/**
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Block
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */
class Oggetto_AjaxCart_Block_Catalog_Product_Compare_List extends Mage_Catalog_Block_Product_Compare_List
{

//    public function getAddToCartUrl($_item){
//        return parent::getAddToCartUrl($_item);
//    }

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

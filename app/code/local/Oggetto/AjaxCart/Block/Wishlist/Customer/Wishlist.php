<?php
/**
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Block
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */
class Oggetto_AjaxCart_Block_Wishlist_Customer_Wishlist extends Mage_Wishlist_Block_Customer_Wishlist
{
    public function getItemAddToCartUrl($item){
        $ItemAddToCartUrl = Mage::helper('ajaxcart')->delSid(parent::getItemAddToCartUrl($item));
        return $ItemAddToCartUrl.$this->getTemplateCod().'/1/ptype/'.$item['type_id'].'/acwishlist/1/';
    }

    public function getTemplateCod(){
        $template = $this->getTemplate();
        if (strpos($template,'/item/')!==false){
            return 'item';
        } else if(strpos($template,'wishlist')!==false){
            return 'acwish';
        } else if(strpos($template,'/sidebar/')!==false){
            return 'sidebar';
        } else {
            return 'sidebar';
        }
    }
}

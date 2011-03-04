<?php
/**
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Block
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */
class Oggetto_AjaxCart_Block_Checkout_Cart_Item_Renderer_Configurable extends Mage_Checkout_Block_Cart_Item_Renderer_Configurable
{
    public function getDeleteUrl(){
        $DeleteUrl = Mage::helper('ajaxcart')->delSid(parent::getDeleteUrl());
        return 'javascript:ajaxcartdelete(\''.$DeleteUrl.$this->getTemplateCod().'/1\')';
    }

    public function getTemplateCod(){
        $template = $this->getTemplate();
        if (strpos($template,'/item/')!==false){
            return 'item';
        } else if(strpos($template,'/sidebar/')!==false){
            return 'sidebar';
        } else {
            return 'sidebar';
        }
    }

}

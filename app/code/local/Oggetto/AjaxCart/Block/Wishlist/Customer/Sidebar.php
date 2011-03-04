<?php
/**
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Block
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */
class Oggetto_AjaxCart_Block_Wishlist_Customer_Sidebar extends Mage_Wishlist_Block_Customer_Sidebar
{
    /**
     * Retrieve URL for adding product to shopping cart and remove item from wishlist
     *
     * @deprecated
     * @param Mage_Catalog_Model_Product $product
     * @return string
     */
    public function getAddToCartItemUrl($product)
    {
        $AddToCartItemUrl = Mage::helper('ajaxcart')->delSid(parent::getAddToCartItemUrl($product));
        return 'javascript:setLocation(\''.$AddToCartItemUrl.$this->getTemplateCod().'/ptype/'.$product['type_id'].'/acwishlist/1/\')';
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

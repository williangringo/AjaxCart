<?php
/**
 * Short description of class goes here
 *
 * Long description (if any)
 *
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Helper
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */

/**
 * Data helper
 */
class Oggetto_AjaxCart_Helper_Data extends Mage_Core_Helper_Abstract
{
    public function delSid($url){
        return str_replace('?___SID=U', '', $url);
    }

}


<?php
/**
 * @category   Oggetto
 * @package    Oggetto_AjaxCart
 * @subpackage Controller
 * @author     Sergey Petrov <petrov@oggettoweb.com>
 */
require_once 'Mage/Catalog/controllers/ProductController.php';

class Oggetto_AjaxCart_ProductController extends Mage_Catalog_ProductController
{

    /**
     * Product view action
     */
    public function viewAction()
    {
        if ($product = $this->_initProduct()) {
            Mage::dispatchEvent('catalog_controller_product_view', array('product'=>$product));

            Mage::getSingleton('catalog/session')->setLastViewedProductId($product->getId());
            $this->_initProductLayout($product);
            $this->_initLayoutMessages('catalog/session');
            $this->_initLayoutMessages('tag/session');
            $this->_initLayoutMessages('checkout/session');
            $this->renderLayout();

            if ($this->getRequest()->getParam('options')) {


                /***********/
                if ($this->getRequest()->getParam('ajaxcart')){
                $result['error'] = 'success';

                    switch ($product['type_id']){
                        case 'configurable':{
                            $block = $this->getLayout()->getBlock('product.info.options.wrapper');//->setTemplate('catalog/product/view/options/wrapper.phtml');
                            $result['block_form'] = $block->toHtml();

                            $block = $this->getLayout()->createBlock('catalog/product_view')->setTemplate('ajaxcart/topblock.phtml');
                            $result['block_top'] = $block->toHtml();

                            $block = $this->getLayout()->createBlock('catalog/product_view')->setTemplate('ajaxcart/bottomblock.phtml');
                            $result['block_bottom'] = $block->toHtml();

                            $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($result));
                            
                        }
                        break;
                        case 'bundle':{
                            return false;

                        }
                        break;
                        case 'test':{

                        }
                        break;
                        default:
                            return false;
                            break;

                    }

                    return;

                }
                $notice = $product->getTypeInstance(true)->getSpecifyOptionMessage();
                Mage::getSingleton('catalog/session')->addNotice($notice);
            }
        }
        else {
            if (isset($_GET['store'])  && !$this->getResponse()->isRedirect()) {
                $this->_redirect('');
            } elseif (!$this->getResponse()->isRedirect()) {
                $this->_forward('noRoute');
            }
        }
    }

  
}

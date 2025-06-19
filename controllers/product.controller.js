import {
    createProduct,
    deleteProductByField,
    getAllProducts,
    getProductByField,
    updateProductByField
  } from './../models/product.model.js';
  
  // Create product
  export const createProductController = async (req, res) => {
    try {
      const product = req.body;
      const result = await createProduct(product);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Product creation failed",
        error: error.message
      });
    }
  };
  
  // Update product by dynamic field
  export const updateProductByFieldController = async (req, res) => {
    try {
      const { field, value } = req.query;
      const product = req.body;
  
      if (!field || !value) {
        return res.status(400).json({
          success: false,
          message: "Field and value are required for updating."
        });
      }
  
      const result = await updateProductByField(field, value, product);
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Product update failed",
        error: error.message
      });
    }
  };
  
  // Delete product by dynamic field
  export const deleteProductByFieldController = async (req, res) => {
    try {
      const { field, value } = req.query;
  
      if (!field || !value) {
        return res.status(400).json({
          success: false,
          message: "Field and value are required for deletion."
        });
      }
  
      const result = await deleteProductByField(field, value);
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Product deletion failed",
        error: error.message
      });
    }
  };
  
  // Get all products
  export const getAllProductsController = async (_req, res) => {
    try {
      const result = await getAllProducts();
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Fetching products failed",
        error: error.message
      });
    }
  };
  
  // Get product by dynamic field
  export const getProductByFieldController = async (req, res) => {
    try {
      const { field, value } = req.query;
  
      if (!field || !value) {
        return res.status(400).json({
          success: false,
          message: "Field and value are required to get product."
        });
      }
  
      const result = await getProductByField(field, value);
      res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Product fetching failed",
        error: error.message
      });
    }
  };
  
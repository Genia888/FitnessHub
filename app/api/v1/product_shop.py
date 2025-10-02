from flask import request
from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

api = Namespace("product_shop", description="Product shop operations")

product_model = api.model("Product", {
    "name": fields.String(required=True, max_length=200),
    "description": fields.String(required=True, max_length=2000),
    "picture": fields.String(required=True, max_length=2000),
    "picture2": fields.String(required=True, max_length=2000),
    "picture3": fields.String(required=True, max_length=2000),
    "is_active" : fields.Boolean(required=True, default=False),
    "is_in_stock" : fields.Boolean(required=True, default=False),
    "price": fields.Float(Require=True, default=0)
})


@api.route('/')
class ProductList(Resource):
    @api.expect(product_model, validate=True)
    @api.response(201, 'Product successfully created')
    @api.response(400, 'Email already registered')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Register a new product"""
        product_data = api.payload
       
        new_product = facade.create_product(product_data)
        return {'id': new_product.id, 'name': new_product.name, 'description': new_product.description, 
                "picture": new_product.picture, 'picture2': new_product.picture2,
                "picture3": new_product.picture3, "is_active": new_product.is_active,
                "is_nutrition": new_product.is_in_stock , "price": new_product.price  }, 201

    @api.response(200, 'List of product retrieved successfully')
    def get(self):
        """Retrieve a list of all product"""
        products = facade.get_all_products()
        return [product.to_dict() for product in products], 200
    


@api.route('/<product_id>')
class ProductResource(Resource):
    @api.response(200, 'Product details retrieved successfully')
    @api.response(404, 'Product not found')
    def get(self, product_id):
        """Get product details by ID"""
        product = facade.get_product(product_id)
        if not product:
            return {'error': 'Product not found'}, 404
        return {'id': product.id, 'name': product.name, 'description': product.description, 
                "picture": product.picture, 'picture2': product.picture2,
                "picture3": product.picture3, "is_active": product.is_active,
                "is_nutrition": product.is_in_stock , "price": product.price
                }, 200              
    
    @api.doc(security="token")
    @jwt_required()
    def delete(self, product_id):
        """Delete a product"""
        product_id2 = get_jwt_identity()
        #claims = get_jwt()
        #is_admin = claims.get("is_admin", False)

        try:
            product = facade.get_product(product_id)
            if not product:
                return {'error': 'Product not found'}, 404

            #if user.user_id != user_id and not is_admin:
            #    return {'error': 'Unauthorized action'}, 403
            
            result = facade.delete_product(product_id)
            return result, 200
        except ValueError as e:
            return {'error': str(e)}, 404

    @api.expect(product_model, validate=True)
    @api.response(200, 'Product updated successfully')
    @api.response(404, 'Product not found')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def put(self, product_id):
        """Update product details with ID"""
        product_data = api.payload
        try:
            updated_product = facade.update_product(product_id, product_data)
            return {
                'id': updated_product.id,
                'name': updated_product.name, 'description': updated_product.description, 
                "picture": updated_product.picture, 'picture2': updated_product.picture2,
                "picture3": updated_product.picture3, "is_active": updated_product.is_active,
                "is_nutrition": updated_product.is_in_stock , "price": updated_product.price
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 404
        




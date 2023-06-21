async function cartItem(req,res){
    
        try {
          const { cartId, productId, quantity } = req.body; // Assuming you receive cartId, productId, and quantity from the client
      
          // Create a new cart item entry in the database
          const cartItem = await CartItem.create({ cartId, productId, quantity });
      
          res.status(201).json({ message: 'Cart item created successfully', cartItem });
        } catch (error) {
          console.error('Error creating cart item:', error);
          res.status(500).json({ error: 'Failed to create cart item' });
        }
      
}
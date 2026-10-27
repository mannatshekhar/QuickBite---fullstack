const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

module.exports = [
  { name: 'Smash Cheese Burger', description: 'Double beef patty, melted cheddar, pickles and house sauce in a toasted brioche bun.', price: 249, category: 'Burgers', image: u('photo-1568901346375-23c9450c58cd'), isVeg: false, rating: 4.7, prepTime: 18, featured: true },
  { name: 'Crispy Chicken Burger', description: 'Buttermilk fried chicken, lettuce, tomato and smoky mayo.', price: 229, category: 'Burgers', image: u('photo-1550547660-d9450f859349'), isVeg: false, rating: 4.5, prepTime: 18 },
  { name: 'Aloo Tikki Burger', description: 'Spiced potato patty, mint chutney, onions and cheese slice.', price: 149, category: 'Burgers', image: u('photo-1551782450-a2132b4ba21d'), isVeg: true, rating: 4.2, prepTime: 15 },
  { name: 'Margherita Pizza', description: 'Stone-baked base, San Marzano tomato, fresh mozzarella and basil.', price: 299, category: 'Pizza', image: u('photo-1574071318508-1cdbab80d002'), isVeg: true, rating: 4.6, prepTime: 25, featured: true },
  { name: 'Pepperoni Feast Pizza', description: 'Loaded with pepperoni, mozzarella and a drizzle of chilli oil.', price: 379, category: 'Pizza', image: u('photo-1565299624946-b28f40a0ae38'), isVeg: false, rating: 4.6, prepTime: 25 },
  { name: 'Farmhouse Pizza', description: 'Capsicum, mushrooms, sweet corn, onions and olives.', price: 339, category: 'Pizza', image: u('photo-1513104890138-7c749659a591'), isVeg: true, rating: 4.4, prepTime: 25 },
  { name: 'Hyderabadi Chicken Biryani', description: 'Slow-cooked basmati with tender chicken, saffron and raita.', price: 289, category: 'Biryani', image: u('photo-1563379091339-03b21ab4a4f8'), isVeg: false, rating: 4.8, prepTime: 30, featured: true },
  { name: 'Paneer Tikka Biryani', description: 'Smoky paneer tikka layered with fragrant rice and mint.', price: 259, category: 'Biryani', image: u('photo-1631515243349-e0cb75fb8d3a'), isVeg: true, rating: 4.4, prepTime: 28 },
  { name: 'Peri Peri Fries', description: 'Crispy golden fries tossed in peri peri seasoning with a cheesy dip.', price: 119, category: 'Sides', image: u('photo-1573080496219-bb080dd4f877'), isVeg: true, rating: 4.5, prepTime: 10, featured: true },
  { name: 'Chicken Wings (6 pcs)', description: 'Fried wings glazed in sticky honey-garlic sauce.', price: 199, category: 'Sides', image: u('photo-1567620832903-9fc6debc209f'), isVeg: false, rating: 4.4, prepTime: 18 },
  { name: 'Steamed Veg Momos', description: 'Hand-folded dumplings with spicy red chutney.', price: 129, category: 'Sides', image: u('photo-1534422298391-e4f8c172dddb'), isVeg: true, rating: 4.3, prepTime: 15 },
  { name: 'Grilled Chicken Bowl', description: 'Herb-grilled chicken, brown rice, roasted veggies and tahini.', price: 269, category: 'Healthy', image: u('photo-1546069901-ba9599a7e63c'), isVeg: false, rating: 4.3, prepTime: 20 },
  { name: 'Garden Fresh Salad', description: 'Crunchy greens, cherry tomatoes, cucumber and lemon vinaigrette.', price: 169, category: 'Healthy', image: u('photo-1540189549336-e6e99c3679fe'), isVeg: true, rating: 4.1, prepTime: 10 },
  { name: 'Fluffy Berry Pancakes', description: 'Stack of buttermilk pancakes, fresh berries and maple syrup.', price: 189, category: 'Breakfast', image: u('photo-1567620905732-2d1ec7ab7445'), isVeg: true, rating: 4.6, prepTime: 15 },
  { name: 'Avocado Egg Toast', description: 'Sourdough, smashed avocado, poached egg and chilli flakes.', price: 219, category: 'Breakfast', image: u('photo-1482049016688-2d3e1b311543'), isVeg: false, rating: 4.4, prepTime: 15 },
  { name: 'Choco Lava Cake', description: 'Warm chocolate cake with a molten centre.', price: 109, category: 'Desserts', image: u('photo-1624353365286-3f8d62daad51'), isVeg: true, rating: 4.7, prepTime: 12 },
  { name: 'Vanilla Bean Ice Cream', description: 'Two scoops of creamy Madagascan vanilla with wafer.', price: 99, category: 'Desserts', image: u('photo-1563805042-7684c019e1cb'), isVeg: true, rating: 4.5, prepTime: 5 },
  { name: 'Cold Coffee Frappe', description: 'Chilled, blended and topped with whipped cream.', price: 139, category: 'Beverages', image: u('photo-1461023058943-07fcbe16d735'), isVeg: true, rating: 4.4, prepTime: 8 },
];

const CONFIG = {
  restaurantName: "MY MENU",
  restaurantTag: "DIGITAL TABLE MENU",
  tableLabel: "TABLE 07",
  currencySymbol: "₹",
  cgstRate: 0.025,   // 2.5% CGST
  sgstRate: 0.025,   // 2.5% SGST

  categories: [
    { id: "starters", name: "Starters",  image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=300&auto=format&fit=crop" },
    { id: "tandoor",   name: "Tandoor",   image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=300&auto=format&fit=crop" },
    { id: "mains",     name: "Mains",     image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=300&auto=format&fit=crop" },
    { id: "biryani",   name: "Biryani",   image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop" },
    { id: "breads",    name: "Breads",    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=300&auto=format&fit=crop" },
    { id: "desserts",  name: "Desserts",  image: "https://images.pexels.com/photos/37026352/pexels-photo-37026352.jpeg" },
    { id: "drinks",    name: "Drinks",    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=300&auto=format&fit=crop" }
  ],

  items: [
    // STARTERS
    { id:"s1", category:"starters", name:"Hara Bhara Kebab", note:"Spinach & peas patty, mint chutney", price:240, veg:true, spice:1,
      image:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/34877658/" },
    { id:"s2", category:"starters", name:"Chicken 65", note:"Curry-leaf fried chicken, Chettinad style", price:320, veg:false, spice:3,
      image:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/30044484/" },
    { id:"s3", category:"starters", name:"Paneer Tikka", note:"Char-grilled cottage cheese, smoked masala", price:280, veg:true, spice:2,
      image:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/34877658/" },
    { id:"s4", category:"starters", name:"Amritsari Fish", note:"Carom-spiced batter-fried basa", price:340, veg:false, spice:2,
      image:"https://images.pexels.com/photos/35267289/pexels-photo-35267289.jpeg", video:"https://www.pexels.com/download/video/30044484/" },

    // TANDOOR
    { id:"t1", category:"tandoor", name:"Tandoori Chicken (Half)", note:"Charcoal-clay oven, char-licked skin", price:380, veg:false, spice:2,
      image:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/30044484/" },
    { id:"t2", category:"tandoor", name:"Seekh Kebab", note:"Hand-minced mutton, charcoal skewer", price:360, veg:false, spice:2,
      image:"https://images.unsplash.com/photo-1633237308525-cd587cf71926?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/30044484/" },
    { id:"t3", category:"tandoor", name:"Tandoori Gobi", note:"Cauliflower, yoghurt marinade, char", price:260, veg:true, spice:2,
      image:"https://images.pexels.com/photos/20395278/pexels-photo-20395278.jpeg", video:"https://www.pexels.com/download/video/34877658/" },

    // MAINS / CURRIES
    { id:"m1", category:"mains", name:"Butter Chicken", note:"Tomato-cashew gravy, smoked butter finish", price:380, veg:false, spice:1,
      image:"https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/30044484/" },
    { id:"m2", category:"mains", name:"Paneer Butter Masala", note:"Cottage cheese in velvet tomato gravy", price:320, veg:true, spice:1,
      image:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/34877658/" },
    { id:"m3", category:"mains", name:"Dal Makhani", note:"Slow-simmered black lentils, cream", price:260, veg:true, spice:1,
      image:"https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/34877658/" },
    { id:"m4", category:"mains", name:"Rogan Josh", note:"Kashmiri red-chilli mutton curry", price:420, veg:false, spice:3,
      image:"https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/30044484/" },
    { id:"m5", category:"mains", name:"Chana Masala", note:"Chickpeas, onion-tomato masala", price:240, veg:true, spice:2,
      image:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/34877658/" },

    // BIRYANI & RICE
    { id:"b1", category:"biryani", name:"Hyderabadi Chicken Biryani", note:"Dum-cooked, saffron, fried onions", price:360, veg:false, spice:2,
      image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/30044484/" },
    { id:"b2", category:"biryani", name:"Veg Dum Biryani", note:"Seasonal vegetables, dum-sealed pot", price:300, veg:true, spice:1,
      image:"https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/34877658/" },
    { id:"b3", category:"biryani", name:"Jeera Rice", note:"Basmati tempered with cumin", price:160, veg:true, spice:0,
      image:"https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/34877658/" },

    // BREADS
    { id:"br1", category:"breads", name:"Butter Naan", note:"Tandoor-puffed, brushed with ghee", price:70, veg:true, spice:0,
      image:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/34877658/" },
    { id:"br2", category:"breads", name:"Garlic Naan", note:"Charred garlic & coriander", price:90, veg:true, spice:0,
      image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop", video:"https://www.pexels.com/download/video/34877658/" },
    { id:"br3", category:"breads", name:"Lachha Paratha", note:"Layered, flaky whole-wheat bread", price:80, veg:true, spice:0,
      image:"https://images.pexels.com/photos/20446381/pexels-photo-20446381.jpeg", video:"https://www.pexels.com/download/video/34877658/" },

    // DESSERTS
    { id:"d1", category:"desserts", name:"Gulab Jamun", note:"Milk dumplings in cardamom syrup", price:140, veg:true, spice:0,
      image:"https://images.pexels.com/photos/29259171/pexels-photo-29259171.jpeg", video:"https://www.pexels.com/download/video/31847861/" },
    { id:"d2", category:"desserts", name:"Rasmalai", note:"Saffron-soaked cottage cheese discs", price:160, veg:true, spice:0,
      image:"https://images.pexels.com/photos/18479496/pexels-photo-18479496.png", video:"https://www.pexels.com/download/video/31847861/" },
    { id:"d3", category:"desserts", name:"Gajar Halwa", note:"Slow-roasted carrot, ghee & nuts", price:150, veg:true, spice:0,
      image:"https://images.pexels.com/photos/35532835/pexels-photo-35532835.jpeg", video:"https://www.pexels.com/download/video/31847861/" },

    // BEVERAGES
    { id:"dr1", category:"drinks", name:"Masala Chai", note:"Spiced milk tea, clay-pot brewed", price:90, veg:true, spice:0,
      image:"https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=600&auto=format&fit=crop", video:"" },
    { id:"dr2", category:"drinks", name:"Sweet Lassi", note:"Churned yoghurt, a little rose", price:120, veg:true, spice:0,
      image:"https://images.pexels.com/photos/4475024/pexels-photo-4475024.jpeg", video:"" },
    { id:"dr3", category:"drinks", name:"Nimbu Soda", note:"Fresh lime, soda, black salt", price:100, veg:true, spice:0,
      image:"https://images.pexels.com/photos/36268523/pexels-photo-36268523.jpeg", video:"" }
  ]
};

const upsellItems = [
  { id: 'u1', name: 'Masala Chaas', price: 90, veg: true, image: './assets/chaach.jpg', img: './assets/chaach.jpg', category: 'drinks' },
  { id: 'u3', name: 'French Fries', price: 150, veg: true, image: './assets/fries.jpg', img: './assets/fries.jpg', category: 'starters' },
  { id: 'u4', name: 'Rabdi', price: 80, veg: true, image: './assets/rabdi.jpg', img: './assets/rabdi.jpg', category: 'desserts' }
];

CONFIG.items.push(...upsellItems);

// NEW UPSELL MAPPING CONFIGURATION
CONFIG.upsellMap = {
  // Map by specific item ID
  d1: ['u4'], // When Gulab Jamun (d1) is added, suggest Rabdi (u4)

  // Map by category
  starters: ['u3'],
  tandoor: ['u1', 'u3'],
  mains: ['u1', 'd1'], // Suggest Chaas & actual Gulab Jamun (d1) instead of duplicate
  biryani: ['u1', 'd1'],
  breads: ['u1'],
  desserts: [],
  drinks: [],
  default: ['u1']
};
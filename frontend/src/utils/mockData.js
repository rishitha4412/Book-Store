// Simplified Career-Focused Mock Data for Bookstore
// Reduced to 11 Main High-Quality Technical Books across categories with unique premium cover art

export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Programming', count: 2, slug: 'programming', cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-2', name: 'Web Development', count: 2, slug: 'web-development', cover: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-3', name: 'Data Structures & Algorithms', count: 1, slug: 'data-structures-algorithms', cover: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-4', name: 'Computer Science', count: 1, slug: 'computer-science', cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-5', name: 'Cloud & DevOps', count: 1, slug: 'cloud-devops', cover: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-6', name: 'Artificial Intelligence', count: 1, slug: 'artificial-intelligence', cover: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-7', name: 'Cyber Security', count: 1, slug: 'cyber-security', cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-8', name: 'Aptitude', count: 1, slug: 'aptitude', cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-9', name: 'English', count: 1, slug: 'english', cover: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-10', name: 'Interview Preparation', count: 1, slug: 'interview-preparation', cover: 'https://images.unsplash.com/photo-1521791136368-1a86cd27a3ea?auto=format&fit=crop&w=600&q=80' }
];

export const MOCK_BOOKS = [
  // 1. Programming
  {
    id: 'book-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    price: 44.99,
    discount: 10,
    rating: 4.9,
    reviewCount: 342,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The definitive guide to the architecture, algorithms, and trade-offs of modern data systems. Learn how to build highly reliable, scalable, and maintainable SaaS and enterprise backends.',
    category: 'Programming',
    genre: 'System Architecture',
    publisher: "O'Reilly Media",
    language: 'English',
    publishedDate: '2017-03-16',
    pages: 611,
    isbn: '978-1449373320',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 45,
    tags: ['database', 'distributed systems', 'backend'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false
  },
  {
    id: 'book-4',
    title: 'The C Programming Language',
    author: 'Brian W. Kernighan & Dennis M. Ritchie',
    price: 35.00,
    discount: 5,
    rating: 4.8,
    reviewCount: 92,
    coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The legendary tutorial on C programming, co-authored by Dennis Ritchie, the creator of C. Essential for memory management fundamentals and low-level development.',
    category: 'Programming',
    genre: 'C programming',
    publisher: 'Prentice Hall',
    language: 'English',
    publishedDate: '1988-04-01',
    pages: 272,
    isbn: '978-0131103627',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 20,
    tags: ['c', 'pointer', 'system programming'],
    featured: false,
    bestSeller: false,
    trending: false,
    newArrival: false
  },

  // 2. Web Development
  {
    id: 'book-13',
    title: 'HTML and CSS: Design and Build Websites',
    author: 'Jon Duckett',
    price: 29.99,
    discount: 5,
    rating: 4.8,
    reviewCount: 310,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The visual dictionary of web design. Learn structural layouts, semantic styling, responsive grid alignment, and basic web styling strategies.',
    category: 'Web Development',
    genre: 'HTML & CSS',
    publisher: 'John Wiley & Sons',
    language: 'English',
    publishedDate: '2011-11-08',
    pages: 490,
    isbn: '978-1118008188',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 35,
    tags: ['html', 'css', 'design', 'frontend'],
    featured: false,
    bestSeller: true,
    trending: false,
    newArrival: false
  },
  {
    id: 'book-15',
    title: 'Learning React',
    author: 'Alex Banks & Eve Porcello',
    price: 39.99,
    discount: 8,
    rating: 4.7,
    reviewCount: 118,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'Build functional React components using React hooks, routing, Context stores, global state trackers, and async data mutations.',
    category: 'Web Development',
    genre: 'React',
    publisher: "O'Reilly Media",
    language: 'English',
    publishedDate: '2020-06-12',
    pages: 290,
    isbn: '978-1492051466',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 25,
    tags: ['react', 'frontend', 'spa'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false
  },

  // 3. Data Structures & Algorithms
  {
    id: 'book-2',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest & Clifford Stein',
    price: 95.00,
    discount: 10,
    rating: 4.9,
    reviewCount: 520,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The world-famous "CLRS" algorithm textbook. Covers rigorous analyses of dynamic programming, heap structures, flow networks, red-black trees, and recursion models.',
    category: 'Data Structures & Algorithms',
    genre: 'Algorithms theory',
    publisher: 'MIT Press',
    language: 'English',
    publishedDate: '2022-04-05',
    pages: 1312,
    isbn: '978-0262046305',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 35,
    tags: ['algorithms', 'theory', 'graphs', 'recursion'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false
  },

  // 4. Computer Science
  {
    id: 'book-26',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz, Peter B. Galvin & Greg Gagne',
    price: 85.00,
    discount: 10,
    rating: 4.8,
    reviewCount: 165,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The official "Dinosaur Book" for computer science students. Master virtual memory management, CPU scheduling, thread pools, process synchronizations, and kernel layouts.',
    category: 'Computer Science',
    genre: 'Operating Systems',
    publisher: 'John Wiley & Sons',
    language: 'English',
    publishedDate: '2018-01-15',
    pages: 1020,
    isbn: '978-1119456339',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 25,
    tags: ['operating system', 'threads', 'virtual memory'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false
  },

  // 5. Cloud & DevOps
  {
    id: 'book-31',
    title: 'AWS Certified Solutions Architect Study Guide',
    author: 'Ben Piper & David Clinton',
    price: 49.99,
    discount: 10,
    rating: 4.7,
    reviewCount: 110,
    coverImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'Pass the AWS SAA-C03 exam. Master Amazon EC2 hosting, VPC subnets, AWS Lambda serverless queries, RDS relational structures, and IAM security controls.',
    category: 'Cloud & DevOps',
    genre: 'Cloud computing',
    publisher: 'Sybex',
    language: 'English',
    publishedDate: '2022-07-28',
    pages: 528,
    isbn: '978-1119859291',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 24,
    tags: ['aws', 'cloud', 'sysops'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false
  },

  // 6. Artificial Intelligence
  {
    id: 'book-35',
    title: 'Hands-On Machine Learning',
    author: 'Aurélien Géron',
    price: 59.99,
    discount: 15,
    rating: 4.9,
    reviewCount: 280,
    coverImage: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'Use Scikit-Learn, Keras, and TensorFlow to build classification, regression, random forests, vector machines, neural networks, and GANs.',
    category: 'Artificial Intelligence',
    genre: 'Machine Learning',
    publisher: "O'Reilly Media",
    language: 'English',
    publishedDate: '2022-10-04',
    pages: 850,
    isbn: '978-1492032649',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 20,
    tags: ['machine learning', 'tensorflow', 'python'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false
  },

  // 7. Cyber Security
  {
    id: 'book-38',
    title: 'Ethical Hacking: A Hands-on Introduction',
    author: 'Daniel G. Graham',
    price: 39.99,
    discount: 8,
    rating: 4.8,
    reviewCount: 88,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'Learn modern whitehat hacking: network packet sniffing, buffer overflow exploitation, shellcode generation, port scanning, and cryptography basics.',
    category: 'Cyber Security',
    genre: 'Penetration testing',
    publisher: 'No Starch Press',
    language: 'English',
    publishedDate: '2021-09-12',
    pages: 350,
    isbn: '978-1718501089',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 22,
    tags: ['ethical hacking', 'security', 'exploits'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false
  },

  // 8. Aptitude
  {
    id: 'book-41',
    title: 'Quantitative Aptitude for Competitive Examinations',
    author: 'Dr. R.S. Aggarwal',
    price: 24.50,
    discount: 10,
    rating: 4.8,
    reviewCount: 320,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The standard study guide for campus recruitment placements. Practice formulas for speed/distance, time/work, percentages, dynamic graphs, and statistics.',
    category: 'Aptitude',
    genre: 'Quantitative Aptitude',
    publisher: 'S. Chand',
    language: 'English',
    publishedDate: '2020-01-01',
    pages: 960,
    isbn: '978-9352535324',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 90,
    tags: ['aptitude', 'quantitative', 'placements'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false
  },

  // 9. English
  {
    id: 'book-44',
    title: 'Word Power Made Easy',
    author: 'Norman Lewis',
    price: 9.99,
    discount: 0,
    rating: 4.9,
    reviewCount: 680,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The world-famous handbook to master English vocabulary. Learn etymology roots, vocabulary metrics, correct sentence meanings, and grammatical rules.',
    category: 'English',
    genre: 'Vocabulary builder',
    publisher: 'Pocket Books',
    language: 'English',
    publishedDate: '1979-11-01',
    pages: 528,
    isbn: '978-0671741907',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 150,
    tags: ['vocabulary', 'english', 'communication'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false
  },

  // 10. Interview Preparation
  {
    id: 'book-47',
    title: 'System Design Interview – Insider\'s Guide',
    author: 'Alex Xu',
    price: 36.99,
    discount: 10,
    rating: 4.9,
    reviewCount: 450,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The ultimate guide to passing scale backend system design interviews. Covers content delivery networks (CDNs), rate limiters, key-value stores, and database partitioners.',
    category: 'Interview Preparation',
    genre: 'System design prep',
    publisher: 'ByteByteGo',
    language: 'English',
    publishedDate: '2020-06-12',
    pages: 320,
    isbn: '978-1736049112',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 60,
    tags: ['system design', 'distributed systems', 'interview'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    bookId: 'book-1',
    userName: 'Sarah Jenkins',
    rating: 5,
    date: '2026-06-10',
    comment: 'The definitive guide to distributed data systems. Highly detailed diagrams and solid historical perspectives on trade-offs.'
  },
  {
    id: 'rev-2',
    bookId: 'book-1',
    userName: 'David Miller',
    rating: 5,
    date: '2026-05-24',
    comment: 'Every software engineer who wants to move to a Senior or Principal role should treat this book like a Bible.'
  },
  {
    id: 'rev-3',
    bookId: 'book-2',
    userName: 'Elena Rostova',
    rating: 4,
    date: '2026-06-01',
    comment: 'Great actionable advice. Some themes are repeated, but the execution models are outstanding.'
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-84920',
    date: '2026-07-02',
    status: 'Delivered',
    total: 54.98,
    items: [
      { id: 'book-1', title: 'Designing Data-Intensive Applications', quantity: 1, price: 44.99 },
      { id: 'book-44', title: 'Word Power Made Easy', quantity: 1, price: 9.99 }
    ],
    shippingAddress: '123 Stripe Way, Silicon Valley, CA 94025',
    paymentMethod: 'Apple Pay (•••• 4920)'
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'not-1', title: 'Order Shipped!', message: 'Your order ORD-84920 has been shipped and is on its way.', date: '2026-07-03', read: false },
  { id: 'not-2', title: 'New Arrival', message: 'Martin Kleppmann just released an update on distributed systems.', date: '2026-07-05', read: true },
  { id: 'not-3', title: 'Special Promo Alert', message: 'Get 15% off on Tech books this weekend with code DEV15.', date: '2026-07-12', read: false }
];

export const MOCK_COUPONS = [
  { code: 'DEV15', discount: 0.15, type: 'percentage', description: '15% off for developers' },
  { code: 'SAVE10', discount: 10, type: 'fixed', description: '$10 off on orders above $50' }
];

export const MOCK_STATS = {
  readers: { value: 48500, suffix: '+', label: 'Happy Readers' },
  books: { value: 11, suffix: '', label: 'Books Available' },
  authors: { value: 15, suffix: '', label: 'Partner Authors' },
  reviews: { value: 2400, suffix: '+', label: '5-Star Reviews' }
};

export const MOCK_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Sarah Jenkins',
    role: 'Principal Frontend Engineer',
    company: 'Stripe',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    quote: 'BookHaven is where I source all my engineering reference textbooks. The UX is incredibly smooth, and shipping is insanely fast. Feels exactly like Stripe.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Guillermo V.',
    role: 'Founder',
    company: 'Vercel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    quote: 'The design details and loading experiences of BookHaven set the standard for modern e-commerce. Excellent catalog speed and beautiful typography throughout.',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Michael Carter',
    role: 'Staff Product Designer',
    company: 'Linear',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    quote: 'Extremely clean presentation. The filter toggles, details sheets, and cart mechanics feel instantaneous. A highly premium purchasing experience.',
    rating: 5
  },
  {
    id: 'test-4',
    name: 'Emily Watson',
    role: 'Author & Lecturer',
    company: 'MIT Press',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    quote: 'Partnering with BookHaven has been spectacular. Their platform highlights books with the prominence and focus they deserve, encouraging deep learning.',
    rating: 4.8
  }
];

export const MOCK_FAQS = [
  {
    question: 'How fast is delivery?',
    answer: 'We offer free express delivery (2-3 business days) for all orders over $35. For orders below $35, shipping is a flat rate of $4.99.'
  },
  {
    question: 'Are payments secure?',
    answer: 'Yes, absolutely. We do not store credit card details. All transactions are securely processed via Stripe checkout integrations.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We support easy 30-day returns. If you are not satisfied with your purchase, you can generate a free return shipping label from your dashboard.'
  },
  {
    question: 'Can I integrate my reader device?',
    answer: 'Yes. Upon purchase, electronic copies of supported textbooks are available to download instantly in PDF, EPUB, and MOBI formats.'
  },
  {
    question: 'Do you offer bulk enterprise pricing?',
    answer: 'Yes. For developer teams, university cohorts, or corporations, contact our helpdesk. We offer customized coupon codes and billing sheets.'
  }
];

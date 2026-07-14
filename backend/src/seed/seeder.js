import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Book from '../models/Book.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';
import Address from '../models/Address.js';
import Order from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env configuration
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Strict mapping of mock IDs to stable MongoDB ObjectIds to maintain referential integrity
const CATEGORY_IDS = {
  'programming': '60d5ec49e4b0c9a4f4d2f8f1',
  'web-development': '60d5ec49e4b0c9a4f4d2f8f2',
  'data-structures-algorithms': '60d5ec49e4b0c9a4f4d2f8f3',
  'computer-science': '60d5ec49e4b0c9a4f4d2f8f4',
  'cloud-devops': '60d5ec49e4b0c9a4f4d2f8f5',
  'artificial-intelligence': '60d5ec49e4b0c9a4f4d2f8f6',
  'cyber-security': '60d5ec49e4b0c9a4f4d2f8f7',
  'aptitude': '60d5ec49e4b0c9a4f4d2f8f8',
  'english': '60d5ec49e4b0c9a4f4d2f8f9',
  'interview-preparation': '60d5ec49e4b0c9a4f4d2f8fa',
};

const BOOK_IDS = {
  'book-1': '60d5ec49e4b0c9a4f4d2f8e1',
  'book-4': '60d5ec49e4b0c9a4f4d2f8e2',
  'book-13': '60d5ec49e4b0c9a4f4d2f8e3',
  'book-15': '60d5ec49e4b0c9a4f4d2f8e4',
  'book-2': '60d5ec49e4b0c9a4f4d2f8e5',
  'book-26': '60d5ec49e4b0c9a4f4d2f8e6',
  'book-31': '60d5ec49e4b0c9a4f4d2f8e7',
  'book-35': '60d5ec49e4b0c9a4f4d2f8e8',
  'book-38': '60d5ec49e4b0c9a4f4d2f8e9',
  'book-41': '60d5ec49e4b0c9a4f4d2f8ea',
  'book-44': '60d5ec49e4b0c9a4f4d2f8eb',
  'book-47': '60d5ec49e4b0c9a4f4d2f8ec',
};

const USER_IDS = {
  'admin': '60d5ec49e4b0c9a4f4d2f801',
  'customer': '60d5ec49e4b0c9a4f4d2f802',
  'reviewer1': '60d5ec49e4b0c9a4f4d2f803',
  'reviewer2': '60d5ec49e4b0c9a4f4d2f804',
  'reviewer3': '60d5ec49e4b0c9a4f4d2f805',
};

const MOCK_CATEGORIES_DATA = [
  { slug: 'programming', name: 'Programming', cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80' },
  { slug: 'web-development', name: 'Web Development', cover: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80' },
  { slug: 'data-structures-algorithms', name: 'Data Structures & Algorithms', cover: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80' },
  { slug: 'computer-science', name: 'Computer Science', cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80' },
  { slug: 'cloud-devops', name: 'Cloud & DevOps', cover: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80' },
  { slug: 'artificial-intelligence', name: 'Artificial Intelligence', cover: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80' },
  { slug: 'cyber-security', name: 'Cyber Security', cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80' },
  { slug: 'aptitude', name: 'Aptitude', cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80' },
  { slug: 'english', name: 'English', cover: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80' },
  { slug: 'interview-preparation', name: 'Interview Preparation', cover: 'https://images.unsplash.com/photo-1521791136368-1a86cd27a3ea?auto=format&fit=crop&w=600&q=80' }
];

const MOCK_BOOKS_DATA = [
  {
    mockId: 'book-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    price: 44.99,
    discount: 10,
    rating: 4.9,
    reviewCount: 342,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The definitive guide to the architecture, algorithms, and trade-offs of modern data systems. Learn how to build highly reliable, scalable, and maintainable SaaS and enterprise backends.',
    category: 'Programming',
    categorySlug: 'programming',
    genre: 'System Architecture',
    publisher: "O'Reilly Media",
    language: 'English',
    publishedDate: new Date('2017-03-16'),
    pages: 611,
    isbn: '978-1449373320',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 45,
    tags: ['database', 'distributed systems', 'backend'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false,
    authorBio: 'Martin Kleppmann is a highly respected researcher in distributed systems at the University of Cambridge.'
  },
  {
    mockId: 'book-4',
    title: 'The C Programming Language',
    author: 'Brian W. Kernighan & Dennis M. Ritchie',
    price: 35.00,
    discount: 5,
    rating: 4.8,
    reviewCount: 92,
    coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The legendary tutorial on C programming, co-authored by Dennis Ritchie, the creator of C. Essential for memory management fundamentals and low-level development.',
    category: 'Programming',
    categorySlug: 'programming',
    genre: 'C programming',
    publisher: 'Prentice Hall',
    language: 'English',
    publishedDate: new Date('1988-04-01'),
    pages: 272,
    isbn: '978-0131103627',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 20,
    tags: ['c', 'pointer', 'system programming'],
    featured: false,
    bestSeller: false,
    trending: false,
    newArrival: false,
    authorBio: 'Dennis Ritchie was an American computer scientist who created the C programming language.'
  },
  {
    mockId: 'book-13',
    title: 'HTML and CSS: Design and Build Websites',
    author: 'Jon Duckett',
    price: 29.99,
    discount: 5,
    rating: 4.8,
    reviewCount: 310,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The visual dictionary of web design. Learn structural layouts, semantic styling, responsive grid alignment, and basic web styling strategies.',
    category: 'Web Development',
    categorySlug: 'web-development',
    genre: 'HTML & CSS',
    publisher: 'John Wiley & Sons',
    language: 'English',
    publishedDate: new Date('2011-11-08'),
    pages: 490,
    isbn: '978-1118008188',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 35,
    tags: ['html', 'css', 'design', 'frontend'],
    featured: false,
    bestSeller: true,
    trending: false,
    newArrival: false,
    authorBio: 'Jon Duckett has over 15 years of experience design and building websites for global brands.'
  },
  {
    mockId: 'book-15',
    title: 'Learning React',
    author: 'Alex Banks & Eve Porcello',
    price: 39.99,
    discount: 8,
    rating: 4.7,
    reviewCount: 118,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'Build functional React components using React hooks, routing, Context stores, global state trackers, and async data mutations.',
    category: 'Web Development',
    categorySlug: 'web-development',
    genre: 'React',
    publisher: "O'Reilly Media",
    language: 'English',
    publishedDate: new Date('2020-06-12'),
    pages: 290,
    isbn: '978-1492051466',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 25,
    tags: ['react', 'frontend', 'spa'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false,
    authorBio: 'Alex Banks and Eve Porcello are instructors who run Moon Highway, a training studio.'
  },
  {
    mockId: 'book-2',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest & Clifford Stein',
    price: 95.00,
    discount: 10,
    rating: 4.9,
    reviewCount: 520,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The world-famous "CLRS" algorithm textbook. Covers rigorous analyses of dynamic programming, heap structures, flow networks, red-black trees, and recursion models.',
    category: 'Data Structures & Algorithms',
    categorySlug: 'data-structures-algorithms',
    genre: 'Algorithms theory',
    publisher: 'MIT Press',
    language: 'English',
    publishedDate: new Date('2022-04-05'),
    pages: 1312,
    isbn: '978-0262046305',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 35,
    tags: ['algorithms', 'theory', 'graphs', 'recursion'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false,
    authorBio: 'Thomas H. Cormen is Professor of Computer Science Emeritus at Dartmouth College.'
  },
  {
    mockId: 'book-26',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz, Peter B. Galvin & Greg Gagne',
    price: 85.00,
    discount: 10,
    rating: 4.8,
    reviewCount: 165,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The official "Dinosaur Book" for computer science students. Master virtual memory management, CPU scheduling, thread pools, process synchronizations, and kernel layouts.',
    category: 'Computer Science',
    categorySlug: 'computer-science',
    genre: 'Operating Systems',
    publisher: 'John Wiley & Sons',
    language: 'English',
    publishedDate: new Date('2018-01-15'),
    pages: 1020,
    isbn: '978-1119456339',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 25,
    tags: ['operating system', 'threads', 'virtual memory'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false,
    authorBio: 'Avi Silberschatz is a computer scientist at Yale University.'
  },
  {
    mockId: 'book-31',
    title: 'AWS Certified Solutions Architect Study Guide',
    author: 'Ben Piper & David Clinton',
    price: 49.99,
    discount: 10,
    rating: 4.7,
    reviewCount: 110,
    coverImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'Pass the AWS SAA-C03 exam. Master Amazon EC2 hosting, VPC subnets, AWS Lambda serverless queries, RDS relational structures, and IAM security controls.',
    category: 'Cloud & DevOps',
    categorySlug: 'cloud-devops',
    genre: 'Cloud computing',
    publisher: 'Sybex',
    language: 'English',
    publishedDate: new Date('2022-07-28'),
    pages: 528,
    isbn: '978-1119859291',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 24,
    tags: ['aws', 'cloud', 'sysops'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false,
    authorBio: 'Ben Piper is an IT consultant who has authored multiple books on cloud architecture.'
  },
  {
    mockId: 'book-35',
    title: 'Hands-On Machine Learning',
    author: 'Aurélien Géron',
    price: 59.99,
    discount: 15,
    rating: 4.9,
    reviewCount: 280,
    coverImage: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'Use Scikit-Learn, Keras, and TensorFlow to build classification, regression, random forests, vector machines, neural networks, and GANs.',
    category: 'Artificial Intelligence',
    categorySlug: 'artificial-intelligence',
    genre: 'Machine Learning',
    publisher: "O'Reilly Media",
    language: 'English',
    publishedDate: new Date('2022-10-04'),
    pages: 850,
    isbn: '978-1492032649',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 20,
    tags: ['machine learning', 'tensorflow', 'python'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false,
    authorBio: 'Aurélien Géron is a Machine Learning consultant and former product manager at Google.'
  },
  {
    mockId: 'book-38',
    title: 'Ethical Hacking: A Hands-on Introduction',
    author: 'Daniel G. Graham',
    price: 39.99,
    discount: 8,
    rating: 4.8,
    reviewCount: 88,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'Learn modern whitehat hacking: network packet sniffing, buffer overflow exploitation, shellcode generation, port scanning, and cryptography basics.',
    category: 'Cyber Security',
    categorySlug: 'cyber-security',
    genre: 'Penetration testing',
    publisher: 'No Starch Press',
    language: 'English',
    publishedDate: new Date('2021-09-12'),
    pages: 350,
    isbn: '978-1718501089',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 22,
    tags: ['ethical hacking', 'security', 'exploits'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false,
    authorBio: 'Daniel G. Graham is an Assistant Professor of Computer Science at the University of Virginia.'
  },
  {
    mockId: 'book-41',
    title: 'Quantitative Aptitude for Competitive Examinations',
    author: 'Dr. R.S. Aggarwal',
    price: 24.50,
    discount: 10,
    rating: 4.8,
    reviewCount: 320,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The standard study guide for campus recruitment placements. Practice formulas for speed/distance, time/work, percentages, dynamic graphs, and statistics.',
    category: 'Aptitude',
    categorySlug: 'aptitude',
    genre: 'Quantitative Aptitude',
    publisher: 'S. Chand',
    language: 'English',
    publishedDate: new Date('2020-01-01'),
    pages: 960,
    isbn: '978-9352535324',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 90,
    tags: ['aptitude', 'quantitative', 'placements'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false,
    authorBio: 'Dr. R.S. Aggarwal has written more than 75 books on competitive exams and logic math.'
  },
  {
    mockId: 'book-44',
    title: 'Word Power Made Easy',
    author: 'Norman Lewis',
    price: 9.99,
    discount: 0,
    rating: 4.9,
    reviewCount: 680,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The world-famous handbook to master English vocabulary. Learn etymology roots, vocabulary metrics, correct sentence meanings, and grammatical rules.',
    category: 'English',
    categorySlug: 'english',
    genre: 'Vocabulary builder',
    publisher: 'Pocket Books',
    language: 'English',
    publishedDate: new Date('1979-11-01'),
    pages: 528,
    isbn: '978-0671741907',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 150,
    tags: ['vocabulary', 'english', 'communication'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false,
    authorBio: 'Norman Lewis was a leading lexicographer and author of English grammar guides.'
  },
  {
    mockId: 'book-47',
    title: 'System Design Interview – Insider\'s Guide',
    author: 'Alex Xu',
    price: 36.99,
    discount: 10,
    rating: 4.9,
    reviewCount: 450,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=700&q=80',
    description: 'The ultimate guide to passing scale backend system design interviews. Covers CDNs, rate limiters, key-value stores, and database partitioners.',
    category: 'Interview Preparation',
    categorySlug: 'interview-preparation',
    genre: 'System design prep',
    publisher: 'ByteByteGo',
    language: 'English',
    publishedDate: new Date('2020-06-12'),
    pages: 320,
    isbn: '978-1736049112',
    inStock: true,
    stockStatus: 'In Stock',
    stock: 60,
    tags: ['system design', 'distributed systems', 'interview'],
    featured: true,
    bestSeller: true,
    trending: true,
    newArrival: false,
    authorBio: 'Alex Xu is a founder of ByteByteGo and a former engineering lead at major tech firms.'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log(`Connecting to MongoDB URI: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to Database. Dropping existing collections...');

    // Drop existing collections to perform a clean refresh
    await User.deleteMany({});
    await Book.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    await Notification.deleteMany({});
    await Wishlist.deleteMany({});
    await Cart.deleteMany({});
    await Address.deleteMany({});
    await Order.deleteMany({});
    console.log('All collections cleared.');

    // 1. Seed Categories
    console.log('Seeding Categories...');
    const seededCategories = [];
    for (const cat of MOCK_CATEGORIES_DATA) {
      const dbCat = await Category.create({
        _id: new mongoose.Types.ObjectId(CATEGORY_IDS[cat.slug]),
        name: cat.name,
        slug: cat.slug,
        cover: cat.cover,
        count: MOCK_BOOKS_DATA.filter((b) => b.categorySlug === cat.slug).length,
      });
      seededCategories.push(dbCat);
    }
    console.log(`Seeded ${seededCategories.length} categories.`);

    // 2. Seed Users
    console.log('Seeding Users...');
    // Seed Admin (passwords will be automatically hashed by our User Mongoose pre-save hook)
    const adminUser = await User.create({
      _id: new mongoose.Types.ObjectId(USER_IDS['admin']),
      name: 'System Administrator',
      email: 'admin@bookstore.com',
      password: 'adminpassword123', // Clean password (hashed automatically)
      role: 'admin',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    });

    // Seed General Customer
    const mainCustomer = await User.create({
      _id: new mongoose.Types.ObjectId(USER_IDS['customer']),
      name: 'Jane Doe',
      email: 'customer@bookstore.com',
      password: 'customerpassword123',
      role: 'customer',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    });

    // Seed Reviewers
    const reviewerNames = ['Sarah Jenkins', 'David Miller', 'Elena Rostova'];
    const reviewerKeys = ['reviewer1', 'reviewer2', 'reviewer3'];
    const reviewers = [];

    for (let i = 0; i < reviewerNames.length; i++) {
      const user = await User.create({
        _id: new mongoose.Types.ObjectId(USER_IDS[reviewerKeys[i]]),
        name: reviewerNames[i],
        email: `${reviewerKeys[i]}@bookstore.com`,
        password: 'password123',
        role: 'customer',
        isVerified: true,
        avatar: i === 0 
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          : i === 1 
            ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      });
      reviewers.push(user);
    }
    console.log(`Seeded ${5} total users (1 admin, 4 customers).`);

    // 3. Seed Books
    console.log('Seeding Books...');
    const seededBooks = [];
    for (const book of MOCK_BOOKS_DATA) {
      const dbBook = await Book.create({
        _id: new mongoose.Types.ObjectId(BOOK_IDS[book.mockId]),
        title: book.title,
        author: book.author,
        price: book.price,
        discount: book.discount,
        rating: book.rating,
        reviewCount: book.reviewCount,
        coverImage: book.coverImage,
        gallery: [
          book.coverImage,
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80'
        ],
        description: book.description,
        category: book.category,
        categoryRef: new mongoose.Types.ObjectId(CATEGORY_IDS[book.categorySlug]),
        genre: book.genre,
        publisher: book.publisher,
        language: book.language,
        publishedDate: book.publishedDate,
        pages: book.pages,
        isbn: book.isbn,
        inStock: book.inStock,
        stockStatus: book.stockStatus,
        stock: book.stock,
        tags: book.tags,
        featured: book.featured,
        bestSeller: book.bestSeller,
        trending: book.trending,
        newArrival: book.newArrival,
        authorBio: book.authorBio,
      });
      seededBooks.push(dbBook);
    }
    console.log(`Seeded ${seededBooks.length} books.`);

    // 4. Seed Reviews
    console.log('Seeding Reviews...');
    const reviewsData = [
      {
        book: new mongoose.Types.ObjectId(BOOK_IDS['book-1']),
        user: new mongoose.Types.ObjectId(USER_IDS['reviewer1']),
        userName: 'Sarah Jenkins',
        rating: 5,
        comment: 'The definitive guide to distributed data systems. Highly detailed diagrams and solid historical perspectives on trade-offs.',
        company: 'Stripe',
        role: 'Principal Frontend Engineer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        book: new mongoose.Types.ObjectId(BOOK_IDS['book-1']),
        user: new mongoose.Types.ObjectId(USER_IDS['reviewer2']),
        userName: 'David Miller',
        rating: 5,
        comment: 'Every software engineer who wants to move to a Senior or Principal role should treat this book like a Bible.',
        company: 'Microsoft',
        role: 'Software Developer',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        book: new mongoose.Types.ObjectId(BOOK_IDS['book-2']),
        user: new mongoose.Types.ObjectId(USER_IDS['reviewer3']),
        userName: 'Elena Rostova',
        rating: 4,
        comment: 'Great actionable advice. Some themes are repeated, but the execution models are outstanding.',
        company: 'Linear',
        role: 'Product Designer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ];

    for (const rev of reviewsData) {
      await Review.create(rev);
    }
    console.log('Seeded initial reviews.');

    // 5. Seed Coupons
    console.log('Seeding Coupons...');
    await Coupon.create({
      code: 'DEV15',
      discountType: 'percentage',
      discountAmount: 15,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
      isActive: true,
      maxRedemptions: 1000,
    });
    
    await Coupon.create({
      code: 'SAVE10',
      discountType: 'flat',
      discountAmount: 10.0,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
      maxRedemptions: 500,
    });
    console.log('Seeded promotional coupons.');

    // 6. Seed Notifications
    console.log('Seeding Notifications...');
    await Notification.create({
      user: new mongoose.Types.ObjectId(USER_IDS['customer']),
      title: 'Order Shipped!',
      message: 'Your order ORD-84920 has been shipped and is on its way.',
      type: 'order',
      isRead: false,
    });

    await Notification.create({
      user: new mongoose.Types.ObjectId(USER_IDS['customer']),
      title: 'New Arrival',
      message: 'Martin Kleppmann just released an update on distributed systems.',
      type: 'system',
      isRead: true,
    });

    await Notification.create({
      user: new mongoose.Types.ObjectId(USER_IDS['customer']),
      title: 'Special Promo Alert',
      message: 'Get 15% off on Tech books this weekend with code DEV15.',
      type: 'coupon',
      isRead: false,
    });
    console.log('Seeded initial notifications.');

    // 7. Seed default Address
    console.log('Seeding Default Address...');
    await Address.create({
      user: new mongoose.Types.ObjectId(USER_IDS['customer']),
      name: 'Jane Doe',
      phone: '+919988776655',
      street: '123 Stripe Way, Silicon Valley',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500081',
      country: 'India',
      isDefault: true,
    });

    // 8. Seed default Order
    console.log('Seeding default Order...');
    await Order.create({
      _id: new mongoose.Types.ObjectId('60d5ec49e4b0c9a4f4d2f8d1'),
      user: new mongoose.Types.ObjectId(USER_IDS['customer']),
      orderItems: [
        {
          book: new mongoose.Types.ObjectId(BOOK_IDS['book-1']),
          title: 'Designing Data-Intensive Applications',
          coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&h=700&q=80',
          quantity: 1,
          price: 44.99,
        },
        {
          book: new mongoose.Types.ObjectId(BOOK_IDS['book-44']),
          title: 'Word Power Made Easy',
          coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&h=700&q=80',
          quantity: 1,
          price: 9.99,
        },
      ],
      shippingAddress: {
        name: 'Jane Doe',
        phone: '+919988776655',
        street: '123 Stripe Way, Silicon Valley',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500081',
        country: 'India',
      },
      paymentInfo: {
        id: 'pay_mock_12345',
        status: 'Succeeded',
        method: 'Card',
      },
      taxPrice: 0.0,
      shippingPrice: 0.0,
      discountPrice: 0.0,
      totalPrice: 54.98,
      orderStatus: 'Delivered',
      paidAt: new Date('2026-07-02'),
      deliveredAt: new Date('2026-07-03'),
    });
    console.log('Seeded default order histories.');

    console.log('Database Seeding finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed with error:', error);
    process.exit(1);
  }
};

seedDB();

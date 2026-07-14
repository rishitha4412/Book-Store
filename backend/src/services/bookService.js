import Book from '../models/Book.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Query list of books with search, filters, pagination and sorting
export const queryBooks = async (filter = {}) => {
  const queryObj = {};

  // 1. Text Search Filter (Title, Author, Genre, Tags)
  if (filter.search) {
    const q = filter.search.trim();
    queryObj.$or = [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
      { genre: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } },
    ];
  }

  // 2. Category Filter (Case insensitive match or Slug check)
  if (filter.category) {
    const cat = filter.category.trim();
    queryObj.category = { $regex: `^${cat}$`, $options: 'i' };
  }

  // 3. String Field Filters
  if (filter.author) {
    queryObj.author = { $regex: filter.author.trim(), $options: 'i' };
  }
  if (filter.publisher) {
    queryObj.publisher = { $regex: filter.publisher.trim(), $options: 'i' };
  }
  if (filter.language) {
    queryObj.language = { $regex: `^${filter.language.trim()}$`, $options: 'i' };
  }

  // 4. Max Price Filter (Dynamically calculated based on price and discount)
  if (filter.maxPrice) {
    const maxP = parseFloat(filter.maxPrice);
    queryObj.$expr = {
      $lte: [
        {
          $multiply: [
            '$price',
            { $subtract: [1, { $divide: ['$discount', 100] }] },
          ],
        },
        maxP,
      ],
    };
  }

  // 5. Star Rating Filter
  if (filter.rating) {
    queryObj.rating = { $gte: parseFloat(filter.rating) };
  }

  // 6. In-Stock Filter
  if (filter.inStock === 'true' || filter.inStock === true) {
    queryObj.inStock = true;
  }

  // 7. Sorting Configuration
  let sortStr = '-createdAt'; // Default sorting
  if (filter.sort) {
    switch (filter.sort) {
      case 'newest':
        sortStr = '-publishedDate';
        break;
      case 'bestSelling':
        sortStr = '-bestSeller -reviewCount';
        break;
      case 'priceAsc':
        sortStr = 'price';
        break;
      case 'priceDesc':
        sortStr = '-price';
        break;
      case 'ratingDesc':
        sortStr = '-rating';
        break;
      case 'titleAsc':
        sortStr = 'title';
        break;
      default:
        sortStr = '-createdAt';
    }
  }

  // 8. Pagination Options
  const page = parseInt(filter.page, 10) || 1;
  const limit = parseInt(filter.limit, 10) || 9;
  const skip = (page - 1) * limit;

  // Execute database query with lean parsing for performance
  const books = await Book.find(queryObj)
    .sort(sortStr)
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Book.countDocuments(queryObj);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    books,
    totalPages,
    totalCount,
    currentPage: page,
  };
};

// Fetch details for a single book
export const getBookById = async (id) => {
  const book = await Book.findById(id).populate('categoryRef');
  if (!book) {
    throw new AppError('Book not found', HTTP_STATUS.NOT_FOUND);
  }
  return book;
};

// Fetch categories catalog list
export const queryCategories = async () => {
  return await Category.find({}).sort('name');
};

// Fetch books flagged for home page sections
export const getFeaturedBooks = async () => {
  return await Book.find({ featured: true }).limit(6).lean();
};

export const getBestSellers = async () => {
  return await Book.find({ bestSeller: true }).limit(6).lean();
};

export const getTrendingBooks = async () => {
  return await Book.find({ trending: true }).limit(6).lean();
};

export const getNewArrivals = async () => {
  return await Book.find({ newArrival: true }).limit(6).lean();
};

// Fetch distinct sidebar filters metadata
export const getFilterMetadata = async () => {
  const authors = await Book.distinct('author');
  const publishers = await Book.distinct('publisher');
  const languages = await Book.distinct('language');

  const maxPriceBook = await Book.findOne({}).sort('-price').lean();
  const maxPrice = maxPriceBook ? Math.ceil(maxPriceBook.price) : 200;

  return {
    authors: authors.sort(),
    publishers: publishers.sort(),
    languages: languages.sort(),
    maxPrice,
  };
};

// Mock testimonials matching landing page needs
export const getTestimonials = async () => {
  return [
    {
      id: 'test-1',
      name: 'Sarah Jenkins',
      role: 'Principal Frontend Engineer',
      company: 'Stripe',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'BookHaven is where I source all my engineering reference textbooks. The UX is incredibly smooth, and shipping is insanely fast. Feels exactly like Stripe.',
      rating: 5,
    },
    {
      id: 'test-2',
      name: 'Guillermo V.',
      role: 'Founder',
      company: 'Vercel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'The design details and loading experiences of BookHaven set the standard for modern e-commerce. Excellent catalog speed and beautiful typography throughout.',
      rating: 5,
    },
    {
      id: 'test-3',
      name: 'Michael Carter',
      role: 'Staff Product Designer',
      company: 'Linear',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'Extremely clean presentation. The filter toggles, details sheets, and cart mechanics feel instantaneous. A highly premium purchasing experience.',
      rating: 5,
    },
    {
      id: 'test-4',
      name: 'Emily Watson',
      role: 'Author & Lecturer',
      company: 'MIT Press',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'Partnering with BookHaven has been spectacular. Their platform highlights books with the prominence and focus they deserve, encouraging deep learning.',
      rating: 4.8,
    },
  ];
};

// Landing banner numerical statistics counts
export const getStats = async () => {
  const booksCount = await Book.countDocuments({});
  const authorsCount = (await Book.distinct('author')).length;
  const reviewsCount = await Review.countDocuments({});

  return {
    readers: { value: 48500, suffix: '+', label: 'Happy Readers' },
    books: { value: booksCount, suffix: '', label: 'Books Available' },
    authors: { value: authorsCount, suffix: '', label: 'Partner Authors' },
    reviews: { value: reviewsCount > 0 ? reviewsCount : 2400, suffix: '+', label: 'Verified Reviews' },
  };
};

// Mock FAQs matching landing page needs
export const getFaqs = async () => {
  return [
    {
      question: 'How fast is delivery?',
      answer: 'We offer free express delivery (2-3 business days) for all orders over $35. For orders below $35, shipping is a flat rate of $4.99.',
    },
    {
      question: 'Are payments secure?',
      answer: 'Yes, absolutely. We do not store credit card details. All transactions are securely processed via Stripe checkout integrations.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We support easy 30-day returns. If you are not satisfied with your purchase, you can generate a free return shipping label from your dashboard.',
    },
    {
      question: 'Can I integrate my reader device?',
      answer: 'Yes. Upon purchase, electronic copies of supported textbooks are available to download instantly in PDF, EPUB, and MOBI formats.',
    },
    {
      question: 'Do you offer bulk enterprise pricing?',
      answer: 'Yes. For developer teams, university cohorts, or corporations, contact our helpdesk. We offer customized coupon codes and billing sheets.',
    },
  ];
};

// Admin operation: create a new book
export const createBook = async (bookData) => {
  // Verify category exists
  let categoryObj = await Category.findOne({ name: bookData.category });
  if (!categoryObj) {
    // Generate slug for new category
    const slug = bookData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    categoryObj = await Category.create({
      name: bookData.category,
      slug,
      cover: bookData.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    });
  }

  const newBook = new Book({
    ...bookData,
    categoryRef: categoryObj._id,
  });

  await newBook.save();
  return newBook;
};

// Admin operation: edit an existing book
export const updateBook = async (id, updateData) => {
  const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) {
    throw new AppError('Book not found to update', HTTP_STATUS.NOT_FOUND);
  }
  return updatedBook;
};

// Admin operation: delete a book
export const deleteBook = async (id) => {
  const deletedBook = await Book.findByIdAndDelete(id);
  if (!deletedBook) {
    throw new AppError('Book not found to delete', HTTP_STATUS.NOT_FOUND);
  }
  return deletedBook;
};

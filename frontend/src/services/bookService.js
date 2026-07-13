import { 
  MOCK_BOOKS, 
  MOCK_CATEGORIES, 
  MOCK_STATS, 
  MOCK_TESTIMONIALS, 
  MOCK_FAQS,
  MOCK_REVIEWS
} from '../utils/mockData';

const simulateNetworkDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredBooks = () => {
  const saved = localStorage.getItem('bookstore_books');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const containsOldCategory = parsed.some(b => b.category === 'Fiction' || b.category === 'Self-Improvement');
      if (!containsOldCategory) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse catalog cache, resetting:", e);
    }
  }
  localStorage.setItem('bookstore_books', JSON.stringify(MOCK_BOOKS));
  return MOCK_BOOKS;
};

const getStoredReviews = () => {
  const saved = localStorage.getItem('bookstore_reviews');
  if (saved) return JSON.parse(saved);
  localStorage.setItem('bookstore_reviews', JSON.stringify(MOCK_REVIEWS));
  return MOCK_REVIEWS;
};

const REVIEW_TEMPLATES = [
  "An absolute masterpiece! It changed how I approach my daily work. Highly recommend to everyone in the industry.",
  "Very well written and structured. The concepts are easy to grasp but carry deep meaning and practical value.",
  "Superb quality and print. The insights shared in this book are worth ten times the cover price. Easily a 5-star read.",
  "Solid content with great practical case studies. The author explains complex themes in a simplified manner.",
  "Decent read, though some sections felt a bit redundant. Still, there are plenty of golden nuggets of wisdom here.",
];

const REVIEWERS = [
  { name: "John Doe", company: "Meta", role: "Senior Engineer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
  { name: "Alice Smith", company: "Google", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
  { name: "Bob Miller", company: "Microsoft", role: "Software Developer", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
  { name: "Claire Davies", company: "Netflix", role: "Design Lead", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
  { name: "David Kim", company: "Apple", role: "Systems Architect", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
];

export const bookService = {
  getBooks: async (filter = {}) => {
    await simulateNetworkDelay(500);
    let books = [...getStoredBooks()];
    
    // 1. Text Search Filter
    if (filter.search) {
      const q = filter.search.toLowerCase();
      books = books.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) ||
        (b.genre && b.genre.toLowerCase().includes(q))
      );
    }
    
    // 2. Category Filter (exact category slug or name check)
    if (filter.category) {
      const catSlug = filter.category.toLowerCase();
      books = books.filter(b => {
        const bookSlug = b.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return bookSlug === catSlug || b.category.toLowerCase().includes(catSlug);
      });
    }
    
    // 3. Author Filter
    if (filter.author) {
      const auth = filter.author.toLowerCase();
      books = books.filter(b => b.author.toLowerCase().includes(auth));
    }

    // 4. Publisher Filter
    if (filter.publisher) {
      const pub = filter.publisher.toLowerCase();
      books = books.filter(b => b.publisher.toLowerCase().includes(pub));
    }

    // 5. Language Filter
    if (filter.language) {
      const lang = filter.language.toLowerCase();
      books = books.filter(b => b.language.toLowerCase() === lang);
    }

    // 6. Max Price Filter
    if (filter.maxPrice) {
      const maxP = parseFloat(filter.maxPrice);
      books = books.filter(b => {
        const finalPrice = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
        return finalPrice <= maxP;
      });
    }

    // 7. Star Rating Filter
    if (filter.rating) {
      const ratingVal = parseFloat(filter.rating);
      books = books.filter(b => b.rating >= ratingVal);
    }

    // 8. In-Stock Filter
    if (filter.inStock === 'true') {
      books = books.filter(b => b.stockStatus === 'In Stock');
    }

    // 9. Sorting Mappings
    if (filter.sort) {
      switch (filter.sort) {
        case 'newest':
          books.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
          break;
        case 'bestSelling':
          // Sort bestSeller = true first, then by review count
          books.sort((a, b) => {
            if (a.bestSeller && !b.bestSeller) return -1;
            if (!a.bestSeller && b.bestSeller) return 1;
            return b.reviewCount - a.reviewCount;
          });
          break;
        case 'priceAsc':
          books.sort((a, b) => {
            const pA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
            const pB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
            return pA - pB;
          });
          break;
        case 'priceDesc':
          books.sort((a, b) => {
            const pA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
            const pB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
            return pB - pA;
          });
          break;
        case 'ratingDesc':
          books.sort((a, b) => b.rating - a.rating);
          break;
        case 'titleAsc':
          books.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }
    }

    // 10. Client Pagination
    const page = parseInt(filter.page) || 1;
    const limit = parseInt(filter.limit) || 9;
    const startIndex = (page - 1) * limit;
    const totalCount = books.length;
    
    const paginatedBooks = books.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      books: paginatedBooks,
      totalPages,
      totalCount,
      currentPage: page
    };
  },

  getBookById: async (id) => {
    await simulateNetworkDelay(250);
    const books = getStoredBooks();
    const book = books.find(b => b.id === id);
    if (!book) throw new Error('Book not found');
    
    const isbn = book.isbn || `978-${Math.floor(100 + Math.random() * 899)}-${Math.floor(10 + Math.random() * 89)}-${Math.floor(100000 + Math.random() * 899999)}-${Math.floor(1 + Math.random() * 8)}`;
    
    const gallery = [
      book.coverImage,
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
    ];

    const authorBio = `${book.author} is a highly respected expert and thought leader in their field. With over two decades of professional experience, they have authored multiple bestsellers, lectured at top-tier universities, and served as a keynote speaker at global conferences. Their work focuses on building bridges between complex technical paradigms and human-centered design.`;

    return {
      ...book,
      isbn,
      gallery,
      authorBio
    };
  },

  getReviewsByBookId: async (bookId) => {
    await simulateNetworkDelay(150);
    const reviews = getStoredReviews();
    const specificReviews = reviews.filter(r => r.bookId === bookId);
    
    if (specificReviews.length > 0) {
      return specificReviews;
    }
    
    // Otherwise, generate 3 high-quality fallback reviews dynamically
    const count = 3;
    const generated = [];
    const dateOffset = [2, 10, 30];
    
    for (let i = 0; i < count; i++) {
      const reviewer = REVIEWERS[i % REVIEWERS.length];
      const comment = REVIEW_TEMPLATES[i % REVIEW_TEMPLATES.length];
      const date = new Date(Date.now() - dateOffset[i] * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      generated.push({
        id: `gen-rev-${bookId}-${i}`,
        bookId,
        userName: reviewer.name,
        company: reviewer.company,
        role: reviewer.role,
        avatar: reviewer.avatar,
        rating: i === 0 ? 5 : i === 1 ? 4 : 5,
        date,
        comment
      });
    }
    return generated;
  },

  getCategories: async () => {
    await simulateNetworkDelay(200);
    return MOCK_CATEGORIES;
  },

  getFeaturedBooks: async () => {
    await simulateNetworkDelay(300);
    const books = getStoredBooks();
    return books.filter(b => b.featured);
  },

  getBestSellers: async () => {
    await simulateNetworkDelay(300);
    const books = getStoredBooks();
    return books.filter(b => b.bestSeller);
  },

  getTrendingBooks: async () => {
    await simulateNetworkDelay(300);
    const books = getStoredBooks();
    return books.filter(b => b.trending);
  },

  getNewArrivals: async () => {
    await simulateNetworkDelay(300);
    const books = getStoredBooks();
    return books.filter(b => b.newArrival);
  },

  getTestimonials: async () => {
    await simulateNetworkDelay(200);
    return MOCK_TESTIMONIALS;
  },

  getStats: async () => {
    await simulateNetworkDelay(200);
    return MOCK_STATS;
  },

  getFaqs: async () => {
    await simulateNetworkDelay(150);
    return MOCK_FAQS;
  },

  getFilterMetadata: async () => {
    await simulateNetworkDelay(200);
    const books = getStoredBooks();
    const authors = [...new Set(books.map(b => b.author))].sort();
    const publishers = [...new Set(books.map(b => b.publisher))].sort();
    const languages = [...new Set(books.map(b => b.language))].sort();
    
    const maxPrice = books.reduce((max, b) => {
      const finalPrice = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
      return finalPrice > max ? finalPrice : max;
    }, 0);

    return {
      authors,
      publishers,
      languages,
      maxPrice: Math.ceil(maxPrice)
    };
  },

  // Admin DB save methods
  saveBooks: async (booksList) => {
    localStorage.setItem('bookstore_books', JSON.stringify(booksList));
    return true;
  },

  addReview: async (review) => {
    const reviews = getStoredReviews();
    const newReviews = [review, ...reviews];
    localStorage.setItem('bookstore_reviews', JSON.stringify(newReviews));
    return true;
  }
};

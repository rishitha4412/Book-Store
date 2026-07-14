import api from '../utils/api.js';

export const bookService = {
  // Query catalog list
  getBooks: async (filter = {}) => {
    const response = await api.get('/books', { params: filter });
    return response.data.data;
  },

  // Query single book details
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data.data;
  },

  // Query reviews written for a book
  getReviewsByBookId: async (bookId) => {
    const response = await api.get(`/reviews/book/${bookId}`);
    return response.data.data;
  },

  // Query categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },

  // Landing page listings
  getFeaturedBooks: async () => {
    const response = await api.get('/books/featured');
    return response.data.data;
  },

  getBestSellers: async () => {
    const response = await api.get('/books/best-sellers');
    return response.data.data;
  },

  getTrendingBooks: async () => {
    const response = await api.get('/books/trending');
    return response.data.data;
  },

  getNewArrivals: async () => {
    const response = await api.get('/books/new-arrivals');
    return response.data.data;
  },

  getTestimonials: async () => {
    const response = await api.get('/books/testimonials');
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get('/books/stats');
    return response.data.data;
  },

  getFaqs: async () => {
    const response = await api.get('/books/faqs');
    return response.data.data;
  },

  getFilterMetadata: async () => {
    const response = await api.get('/books/filters-metadata');
    return response.data.data;
  },

  // Submit a customer review
  addReview: async (review) => {
    const response = await api.post('/reviews', {
      bookId: review.bookId,
      rating: review.rating,
      comment: review.comment,
    });
    return response.data;
  },

  // State-synchronizer that diffs new local book lists with the database catalog
  saveBooks: async (booksList) => {
    try {
      // 1. Fetch current database catalog state
      const dbResponse = await api.get('/books?limit=100');
      const dbBooks = dbResponse.data.data.books;

      const dbBooksMap = new Map(dbBooks.map((b) => [b._id.toString(), b]));

      // 2. Identify additions and updates
      for (const localBook of booksList) {
        const isNew = !localBook.id || localBook.id.startsWith('book-');

        if (isNew) {
          // If the book does not exist in database, POST it
          const formattedBook = {
            title: localBook.title,
            author: localBook.author,
            price: parseFloat(localBook.price),
            discount: parseInt(localBook.discount) || 0,
            coverImage: localBook.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
            description: localBook.description || 'No description provided.',
            category: localBook.category,
            genre: localBook.genre || 'General',
            publisher: localBook.publisher || 'Unknown Publisher',
            publishedDate: localBook.publishedDate || new Date().toISOString().split('T')[0],
            pages: localBook.pages || 100,
            isbn: '978' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
            stock: localBook.stock || 10,
            tags: localBook.tags || [],
            featured: localBook.featured || false,
            bestSeller: localBook.bestSeller || false,
            trending: localBook.trending || false,
            newArrival: localBook.newArrival || false,
            authorBio: localBook.authorBio || '',
          };
          await api.post('/books', formattedBook);
        } else {
          // If fields changed, PUT update it
          const matchingDbBook = dbBooksMap.get(localBook.id);

          if (matchingDbBook) {
            const needsUpdate =
              matchingDbBook.title !== localBook.title ||
              matchingDbBook.author !== localBook.author ||
              matchingDbBook.price !== localBook.price ||
              matchingDbBook.category !== localBook.category ||
              matchingDbBook.discount !== localBook.discount;

            if (needsUpdate) {
              await api.put(`/books/${matchingDbBook._id}`, {
                title: localBook.title,
                author: localBook.author,
                price: parseFloat(localBook.price),
                category: localBook.category,
                discount: parseInt(localBook.discount) || 0,
                coverImage: localBook.coverImage,
                description: localBook.description || matchingDbBook.description,
                isbn: localBook.isbn || matchingDbBook.isbn,
                publishedDate: localBook.publishedDate || matchingDbBook.publishedDate,
                pages: localBook.pages || matchingDbBook.pages,
              });
            }
          }
        }
      }

      // 3. Identify deletions
      const localIds = new Set(booksList.map((b) => b.id).filter((id) => id && !id.startsWith('book-')));
      for (const dbBook of dbBooks) {
        if (!localIds.has(dbBook._id.toString())) {
          // If it is in DB but missing locally, DELETE it
          await api.delete(`/books/${dbBook._id}`);
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to sync book lists with database:', error);
      throw error;
    }
  },
};

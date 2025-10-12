import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Service, ServiceCategory, ServiceFilters, SearchQuery } from '../../types';

interface ServiceState {
  services: Service[];
  categories: ServiceCategory[];
  featuredServices: Service[];
  searchResults: Service[];
  filters: ServiceFilters;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: ServiceState = {
  services: [],
  categories: [],
  featuredServices: [],
  searchResults: [],
  filters: {},
  searchQuery: '',
  isLoading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
};

// Async thunks
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params: { page?: number; filters?: ServiceFilters } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, filters = {} } = params;
      // TODO: Implement API call
      const response = await fetch(`/api/services?page=${page}&filters=${JSON.stringify(filters)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch services');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'services/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement API call
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

export const searchServices = createAsyncThunk(
  'services/searchServices',
  async (query: SearchQuery, { rejectWithValue }) => {
    try {
      // TODO: Implement API call
      const response = await fetch('/api/services/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Search failed');
    }
  }
);

export const fetchFeaturedServices = createAsyncThunk(
  'services/fetchFeaturedServices',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement API call
      const response = await fetch('/api/services/featured');
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured services');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch featured services');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ServiceFilters>) => {
      state.filters = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        const { services, hasMore, page } = action.payload;
        
        if (page === 1) {
          state.services = services;
        } else {
          state.services = [...state.services, ...services];
        }
        
        state.hasMore = hasMore;
        state.currentPage = page;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search Services
      .addCase(searchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Featured Services
      .addCase(fetchFeaturedServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredServices = action.payload;
        state.error = null;
      })
      .addCase(fetchFeaturedServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  setSearchQuery,
  clearSearchResults,
  clearError,
  resetPagination,
} = serviceSlice.actions;

export default serviceSlice.reducer;
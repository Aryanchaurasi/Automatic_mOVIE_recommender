import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MovieCard } from '@/components/MovieCard';
import { moviesApi, usersApi, Movie } from '@/lib/api';
import { useUserStore } from '@/store/userStore';

export function DashboardPage() {
  const { user, logout } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: () => moviesApi.getRecommendations(user!.id),
    enabled: !!user?.id,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await moviesApi.getSimilarMovies(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  const handleRate = async (movieId: number, rating: number) => {
    if (!user) return;
    
    try {
      await usersApi.createRating(user.id, movieId, rating);
      // Optionally refetch recommendations
    } catch (error) {
      console.error('Rating failed:', error);
    }
  };

  const displayMovies = searchResults.length > 0 ? searchResults : recommendations?.data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">MovieRecommender Pro</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Search for similar movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">
            {searchResults.length > 0 
              ? `Movies similar to "${searchQuery}"` 
              : 'Recommended for You'
            }
          </h2>
          <p className="text-muted-foreground">
            {searchResults.length > 0 
              ? `Found ${searchResults.length} similar movies`
              : 'Personalized recommendations based on your preferences'
            }
          </p>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-96"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MovieCard
                  movie={movie}
                  onRate={(rating) => handleRate(movie.id, rating)}
                  onViewDetails={() => {
                    // Navigate to movie details
                    console.log('View details for:', movie.title);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {displayMovies.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchResults.length === 0 && searchQuery 
                ? 'No similar movies found. Try a different search term.'
                : 'No recommendations available at the moment.'
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
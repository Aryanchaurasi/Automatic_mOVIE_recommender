import { motion } from 'framer-motion';
import { Star, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Movie } from '@/lib/api';

interface MovieCardProps {
  movie: Movie;
  onRate?: (rating: number) => void;
  onViewDetails?: () => void;
}

export function MovieCard({ movie, onRate, onViewDetails }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full max-w-sm"
    >
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={movie.poster_url || '/placeholder-movie.jpg'}
            alt={movie.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-movie.jpg';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="icon"
              className="opacity-0 hover:opacity-100 transition-opacity"
              onClick={onViewDetails}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">
              {movie.vote_average?.toFixed(1) || 'N/A'}
            </span>
            {movie.similarity_score && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {Math.round(movie.similarity_score * 100)}% match
              </span>
            )}
          </div>
          
          {movie.genre && (
            <p className="text-xs text-muted-foreground mb-2">{movie.genre}</p>
          )}
          
          {movie.reason && (
            <p className="text-xs text-blue-600 mb-3">{movie.reason}</p>
          )}
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {movie.overview}
          </p>
          
          {onRate && (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  onClick={() => onRate(rating)}
                  className="p-1"
                >
                  <Star className="h-4 w-4" />
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
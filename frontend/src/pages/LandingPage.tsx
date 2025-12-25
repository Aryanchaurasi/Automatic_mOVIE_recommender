import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Star, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MovieRecommender Pro
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover your next favorite movie with AI-powered recommendations tailored just for you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose MovieRecommender Pro?</h2>
          <p className="text-xl text-muted-foreground">
            Advanced AI algorithms meet intuitive design for the perfect movie discovery experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="h-8 w-8 text-blue-500" />,
              title: "AI-Powered Recommendations",
              description: "Our advanced machine learning algorithms analyze your preferences to suggest movies you'll love"
            },
            {
              icon: <Star className="h-8 w-8 text-yellow-500" />,
              title: "Personalized Experience",
              description: "Rate movies, build your profile, and get increasingly accurate recommendations over time"
            },
            {
              icon: <Users className="h-8 w-8 text-green-500" />,
              title: "Community Driven",
              description: "Discover what others with similar tastes are watching and share your own recommendations"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-8">See It In Action</h2>
          <div className="bg-card rounded-lg p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-4">Smart Movie Discovery</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary" />
                    Content-based filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary" />
                    Collaborative filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary" />
                    Hybrid recommendation engine
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary" />
                    Real-time similarity scoring
                  </li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg p-6">
                <div className="text-sm text-muted-foreground mb-2">Sample Recommendation</div>
                <div className="bg-background rounded p-4">
                  <div className="font-semibold">The Dark Knight</div>
                  <div className="text-sm text-muted-foreground">95% match • Action, Crime, Drama</div>
                  <div className="text-xs text-blue-600 mt-1">Similar to your highly rated movies</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Discover Your Next Favorite Movie?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of movie lovers who trust our recommendations
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link to="/register">Start Watching Now</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
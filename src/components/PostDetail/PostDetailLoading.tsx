
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PostDetailLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-primary animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>
          <p className="text-muted-foreground">Cargando publicación...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetailLoading;

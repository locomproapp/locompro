
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUserPostDetail } from '@/hooks/useUserPostDetail';
import PostDetailLoading from '@/components/PostDetail/PostDetailLoading';
import PostDetailError from '@/components/PostDetail/PostDetailError';
import UserPostInformation from '@/components/PostDetail/UserPostInformation';
import PostImage from '@/components/PostDetail/PostImage';

const UserPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useUserPostDetail(id);

  if (isLoading) {
    return <PostDetailLoading />;
  }

  if (error || !post) {
    return <PostDetailError />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <Button variant="ghost" asChild className="mb-4 self-start">
          <Link to="/market" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al mercado
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <UserPostInformation post={post as any} />
          <PostImage images={post.images} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserPostDetail;

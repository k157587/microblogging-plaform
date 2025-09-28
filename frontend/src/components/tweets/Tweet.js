import React, { useState } from 'react';
import TweetActions from './TweetActions';
import CommentSection from './CommentSection';

const Tweet = ({ tweet, onLike, onRetweet }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const formatTime = (timestamp) => {
    const now = new Date();
    const tweetTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - tweetTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const handleShowComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setLoadingComments(true);
    try {
      const response = await fetch(`http://localhost:3001/api/tweets/${tweet.id}/comments`);
      const data = await response.json();
      setComments(data);
      setShowComments(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (content) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tweets/${tweet.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '1', // This should come from auth context
          content: content
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments(prev => [newComment.comment, ...prev]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        <img
          className="h-10 w-10 rounded-full flex-shrink-0"
          src={tweet.avatar}
          alt={tweet.name}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 truncate">{tweet.name}</h3>
            <span className="text-gray-500">@{tweet.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{formatTime(tweet.timestamp)}</span>
          </div>
          
          <div className="mt-2">
            <p className="text-gray-900 whitespace-pre-wrap">{tweet.content}</p>
          </div>
          
          <TweetActions
            tweet={tweet}
            onLike={onLike}
            onRetweet={onRetweet}
            onShowComments={handleShowComments}
            showComments={showComments}
            loadingComments={loadingComments}
          />
          
          {showComments && (
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tweet;

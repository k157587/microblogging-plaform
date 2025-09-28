import React, { useState, useEffect } from 'react';
import TweetComposer from './tweets/TweetComposer';
import TweetList from './tweets/TweetList';
import Sidebar from './layout/Sidebar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTweet, setNewTweet] = useState('');

  useEffect(() => {
    fetchTweets();
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(fetchTweets, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/tweets');
      const data = await response.json();
      setTweets(data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTweetSubmit = async (content) => {
    try {
      const response = await fetch('http://localhost:3001/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          content: content
        }),
      });

      if (response.ok) {
        const newTweet = await response.json();
        setTweets(prevTweets => [newTweet.tweet, ...prevTweets]);
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
    }
  };

  const handleLike = async (tweetId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tweets/${tweetId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setTweets(prevTweets =>
          prevTweets.map(tweet =>
            tweet.id === tweetId
              ? { ...tweet, likes: data.likes }
              : tweet
          )
        );
      }
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  };

  const handleRetweet = async (tweetId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tweets/${tweetId}/retweet`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setTweets(prevTweets =>
          prevTweets.map(tweet =>
            tweet.id === tweetId
              ? { ...tweet, retweets: data.retweets }
              : tweet
          )
        );
      }
    } catch (error) {
      console.error('Error retweeting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Home</h1>
              </div>
              
              {/* Tweet Composer */}
              <div className="p-6 border-b border-gray-200">
                <TweetComposer onSubmit={handleTweetSubmit} />
              </div>
              
              {/* Tweet List */}
              <div>
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-twitter-blue mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading tweets...</p>
                  </div>
                ) : (
                  <TweetList 
                    tweets={tweets} 
                    onLike={handleLike}
                    onRetweet={handleRetweet}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

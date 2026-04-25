import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useUser } from '@/lib/UserContext';

const LIKED_KEY = (email) => `liked_posts_${email}`;

const getLikedPosts = (email) => {
  try { return JSON.parse(localStorage.getItem(LIKED_KEY(email)) || '[]'); } catch { return []; }
};
const saveLikedPost = (email, postId) => {
  const liked = getLikedPosts(email);
  if (!liked.includes(postId)) {
    localStorage.setItem(LIKED_KEY(email), JSON.stringify([...liked, postId]));
  }
};

export default function PostCard({ post, likeMutation }) {
  const { user } = useUser();
  const qc = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(() => user?.email ? getLikedPosts(user.email).includes(post.id) : false);

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => base44.entities.PostComment.filter({ post_id: post.id }, 'created_date', 100),
    enabled: showComments,
    initialData: [],
  });

  const addComment = useMutation({
    mutationFn: (data) => base44.entities.PostComment.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', post.id] });
      setCommentText('');
    },
  });

  const deleteComment = useMutation({
    mutationFn: (id) => base44.entities.PostComment.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', post.id] }),
  });

  const handleLike = () => {
    if (liked || !user?.email) return;
    setLiked(true);
    saveLikedPost(user.email, post.id);
    likeMutation.mutate({ id: post.id, likes: (post.likes || 0) + 1 });
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment.mutate({
      post_id: post.id,
      text: commentText.trim(),
      author_name: user?.display_name || user?.full_name || 'anonymous cutie',
      author_email: user?.email || '',
      avatar_emoji: user?.avatar_emoji || '🌸',
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
      {/* Author */}
      <div className="flex items-center gap-3 p-5 pb-3">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-2xl">
          {post.avatar_emoji || '🌸'}
        </div>
        <div>
          <div className="font-semibold text-sm">{post.author_name || 'anonymous cutie'}</div>
          <div className="text-[11px] text-muted-foreground">
            {new Date(post.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Photo */}
      {post.photo_url && (
        <img src={post.photo_url} alt="progress" className="w-full max-h-80 object-cover" />
      )}

      {/* Caption + tags */}
      <div className="p-5 pt-3">
        <p className="text-sm leading-relaxed text-foreground mb-3">{post.caption}</p>
        {(post.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map(t => (
              <span key={t} className="text-[11px] text-primary">#{t}</span>
            ))}
          </div>
        )}

        {/* Actions row */}
        <div className="flex items-center gap-4 border-t border-border pt-3 mt-1">
          {/* Heart */}
          <motion.button
            whileTap={{ scale: 1.4 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
          >
            <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-primary text-primary' : ''}`} />
            <span>{(post.likes || 0) + (liked ? 1 : 0)}</span>
          </motion.button>

          {/* Comments toggle */}
          <button
            onClick={() => setShowComments(v => !v)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{showComments ? 'hide' : 'comments'}</span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-5 space-y-3">
              {comments.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">no comments yet — be the first! 🌸</p>
              )}
              {comments.map(c => (
                <div key={c.id} className="flex items-start gap-2.5 group">
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-sm shrink-0">
                    {c.avatar_emoji || '🌸'}
                  </div>
                  <div className="flex-1 bg-muted/50 rounded-2xl px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-foreground">{c.author_name || 'cutie'}</span>
                      {c.author_email === user?.email && (
                        <button
                          onClick={() => deleteComment.mutate(c.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-foreground mt-0.5 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}

              {/* Comment input */}
              <div className="flex items-center gap-2 pt-1">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-sm shrink-0">
                  {user?.avatar_emoji || '🌸'}
                </div>
                <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleComment(); } }}
                    placeholder="add a comment..."
                    className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim() || addComment.isPending}
                    className="text-primary disabled:opacity-40 transition-opacity"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
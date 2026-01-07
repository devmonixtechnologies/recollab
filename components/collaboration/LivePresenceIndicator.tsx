'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Edit3, Sparkles, Clock } from 'lucide-react';
import { useOthers, useSelf } from '@liveblocks/react';
import { cn } from '@/lib/utils';

interface LivePresenceIndicatorProps {
  className?: string;
}

export function LivePresenceIndicator({ className }: LivePresenceIndicatorProps) {
  const others = useOthers();
  const self = useSelf();
  const [activeUsers, setActiveUsers] = useState(others.length + 1);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    setActiveUsers(others.length + 1);
    
    // Simulate recent activity
    const activities = others.map(other => 
      `${other.info?.name || 'Anonymous'} is ${other.presence?.isEditing ? 'editing' : 'viewing'}`
    );
    setRecentActivity(activities);
  }, [others]);

  const getPresenceColor = (userId: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-yellow-500', 'bg-red-500'
    ];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getPresenceIcon = (isEditing: boolean) => {
    return isEditing ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex items-center gap-3 p-2 bg-background border rounded-lg",
        className
      )}
    >
      {/* Active Users Count */}
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{activeUsers}</span>
        <span className="text-xs text-muted-foreground">active</span>
      </div>

      {/* User Avatars */}
      <div className="flex items-center -space-x-2">
        {/* Self */}
        <div className="relative">
          <div 
            className={cn(
              "w-6 h-6 rounded-full border-2 border-background flex items-center justify-center",
              getPresenceColor(self.id)
            )}
          >
            <span className="text-xs text-white font-medium">
              {(self.info?.name || 'Y')[0].toUpperCase()}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background" />
        </div>

        {/* Others */}
        {others.slice(0, 3).map((other) => (
          <div key={other.id} className="relative">
            <div 
              className={cn(
                "w-6 h-6 rounded-full border-2 border-background flex items-center justify-center",
                getPresenceColor(other.id)
              )}
            >
              <span className="text-xs text-white font-medium">
                {(other.info?.name || 'A')[0].toUpperCase()}
              </span>
            </div>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-background",
              other.presence?.isEditing ? "bg-yellow-500" : "bg-gray-400"
            )}>
              {getPresenceIcon(!!other.presence?.isEditing)}
            </div>
          </div>
        ))}

        {/* More users indicator */}
        {others.length > 3 && (
          <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
            <span className="text-xs font-medium">+{others.length - 3}</span>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="max-w-32 truncate">
            {recentActivity[0]}
          </span>
        </div>
      )}

      {/* AI Indicator */}
      <div className="flex items-center gap-1 text-xs text-primary">
        <Sparkles className="w-3 h-3" />
        <span>AI</span>
      </div>
    </motion.div>
  );
}

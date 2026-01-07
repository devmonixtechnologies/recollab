'use client';

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import ActiveCollaborators from './ActiveCollaborators';
import { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';
import Loader from './Loader';
import ShareModal from './ShareModal';
import { useAuth } from '@/components/auth/AuthProvider';
import LogoutButton from '@/components/auth/LogoutButton';
import Link from 'next/link';
import { AIAssistant } from './ai/AIAssistant';
import { VersionHistory } from './version/VersionHistory';
import { VersionComparison } from './version/VersionComparison';
import { UserType } from '@/types/auth';

interface CollaborativeRoomProps {
  roomId: string;
  roomMetadata: any;
  users: any[];
  currentUserType: UserType;
}

const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
  const { user } = useAuth();
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [comparisonVersions, setComparisonVersions] = useState<{v1: number, v2: number} | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleApplySuggestion = (suggestion: string) => {
    // This will be handled by the Lexical editor plugin
    console.log('Applying suggestion:', suggestion);
  };

  const handleImproveFormatting = (improvedContent: string) => {
    // This will be handled by the Lexical editor plugin
    console.log('Improving formatting:', improvedContent);
  };

  const handleUpdateTitle = (title: string) => {
    setDocumentTitle(title);
    updateDocument(roomId, title);
  };

  const handleRestoreVersion = async (version: number) => {
    try {
      const response = await fetch(`/api/versions/${roomId}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version })
      });
      
      if (response.ok) {
        // Reload the page to show restored content
        window.location.reload();
      }
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  const handleCompareVersions = (v1: number, v2: number) => {
    setComparisonVersions({ v1, v2 });
  };

  const handleCloseComparison = () => {
    setComparisonVersions(null);
  };

  const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setLoading(true);

      try {
        if(documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);
          
          if(updatedDocument) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false);
        updateDocument(roomId, documentTitle);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [roomId, documentTitle])

  useEffect(() => {
    if(editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing])
  

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
              {editing && !loading ? (
                <Input 
                  type="text"
                  value={documentTitle}
                  ref={inputRef}
                  placeholder="Enter title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disabled={!editing}
                  className="document-title-input"
                />
              ) : (
                <p className="document-title">{documentTitle}</p>
              )}

              {currentUserType === 'editor' && !editing && (
                <Image 
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className="pointer"
                />
              )}

              {currentUserType !== 'editor' && !editing && (
                <p className="view-only-tag">View only</p>
              )}

              {loading && <p className="text-sm text-gray-400">saving...</p>}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />

              <ShareModal 
                roomId={roomId}
                collaborators={users}
                creatorId={roomMetadata.creatorId}
                currentUserType={currentUserType}
              />

              {user ? (
                <LogoutButton size="sm" variant="secondary" />
              ) : (
                <Link href="/sign-in" className="text-sm text-blue-400 underline">
                  Sign in
                </Link>
              )}
            </div>
          </Header>
        <Editor roomId={roomId} currentUserType={currentUserType} />
        <AIAssistant 
          content={documentContent}
          onApplySuggestion={handleApplySuggestion}
          onImproveFormatting={handleImproveFormatting}
          onUpdateTitle={handleUpdateTitle}
        />
        <VersionHistory 
          roomId={roomId}
          onRestoreVersion={handleRestoreVersion}
          onCompareVersions={handleCompareVersions}
        />
        {comparisonVersions && (
          <VersionComparison
            roomId={roomId}
            version1={comparisonVersions.v1}
            version2={comparisonVersions.v2}
            onClose={handleCloseComparison}
          />
        )}
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom
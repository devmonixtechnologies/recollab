import { DocumentVersion, IDocumentVersion } from './models/DocumentVersion';
import crypto from 'crypto';

export class VersionHistoryService {
  // Generate content hash for change detection
  private generateContentHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Create a new version snapshot
  async createVersion({
    roomId,
    title,
    content,
    author,
    authorName,
    authorAvatar,
    changeDescription
  }: {
    roomId: string;
    title: string;
    content: string;
    author: string;
    authorName?: string;
    authorAvatar?: string;
    changeDescription?: string;
  }): Promise<IDocumentVersion> {
    try {
      // Get the latest version number for this room
      const latestVersion = await DocumentVersion
        .findOne({ roomId })
        .sort({ version: -1 })
        .select('version contentHash');

      const contentHash = this.generateContentHash(content);
      
      // Check if content has actually changed
      if (latestVersion && latestVersion.contentHash === contentHash) {
        return latestVersion; // Return existing version if no changes
      }

      const newVersion = new DocumentVersion({
        roomId,
        title,
        content,
        version: (latestVersion?.version || 0) + 1,
        author,
        authorName,
        authorAvatar,
        changeDescription: changeDescription || this.generateChangeDescription(latestVersion?.content || '', content),
        contentHash
      });

      return await newVersion.save();
    } catch (error) {
      console.error('Error creating version:', error);
      throw error;
    }
  }

  // Get all versions for a document
  async getVersions(roomId: string, limit: number = 50): Promise<IDocumentVersion[]> {
    try {
      return await DocumentVersion
        .find({ roomId })
        .sort({ version: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error getting versions:', error);
      throw error;
    }
  }

  // Get a specific version
  async getVersion(roomId: string, version: number): Promise<IDocumentVersion | null> {
    try {
      return await DocumentVersion.findOne({ roomId, version }).lean();
    } catch (error) {
      console.error('Error getting version:', error);
      throw error;
    }
  }

  // Restore document to a specific version
  async restoreVersion(roomId: string, version: number): Promise<IDocumentVersion | null> {
    try {
      const versionToRestore = await this.getVersion(roomId, version);
      if (!versionToRestore) {
        throw new Error('Version not found');
      }

      // Create a new version with the restored content
      return await this.createVersion({
        roomId,
        title: versionToRestore.title,
        content: versionToRestore.content,
        author: versionToRestore.author,
        authorName: versionToRestore.authorName,
        authorAvatar: versionToRestore.authorAvatar,
        changeDescription: `Restored to version ${version}`
      });
    } catch (error) {
      console.error('Error restoring version:', error);
      throw error;
    }
  }

  // Compare two versions and generate diff
  async compareVersions(roomId: string, version1: number, version2: number): Promise<{
    version1: IDocumentVersion | null;
    version2: IDocumentVersion | null;
    diff: string;
  }> {
    try {
      const [v1, v2] = await Promise.all([
        this.getVersion(roomId, version1),
        this.getVersion(roomId, version2)
      ]);

      if (!v1 || !v2) {
        throw new Error('One or both versions not found');
      }

      // Simple diff implementation (you might want to use a more sophisticated diff library)
      const diff = this.generateSimpleDiff(v1.content, v2.content);

      return {
        version1: v1,
        version2: v2,
        diff
      };
    } catch (error) {
      console.error('Error comparing versions:', error);
      throw error;
    }
  }

  // Delete old versions (keep only last N versions)
  async cleanupOldVersions(roomId: string, keepCount: number = 20): Promise<void> {
    try {
      const versions = await DocumentVersion
        .find({ roomId })
        .sort({ version: -1 })
        .skip(keepCount)
        .select('_id');

      if (versions.length > 0) {
        await DocumentVersion.deleteMany({
          _id: { $in: versions.map(v => v._id) }
        });
      }
    } catch (error) {
      console.error('Error cleaning up versions:', error);
      throw error;
    }
  }

  // Generate a simple change description
  private generateChangeDescription(oldContent: string, newContent: string): string {
    const oldLength = oldContent.length;
    const newLength = newContent.length;
    const diff = newLength - oldLength;

    if (diff > 100) {
      return 'Major content addition';
    } else if (diff < -100) {
      return 'Major content removal';
    } else if (Math.abs(diff) > 0) {
      return 'Content updated';
    } else {
      return 'Minor edits';
    }
  }

  // Simple diff implementation (for demonstration)
  private generateSimpleDiff(oldContent: string, newContent: string): string {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    let diff = '';
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';
      
      if (oldLine !== newLine) {
        diff += `Line ${i + 1}:\n`;
        if (oldLine) diff += `- ${oldLine}\n`;
        if (newLine) diff += `+ ${newLine}\n`;
        diff += '\n';
      }
    }
    
    return diff || 'No differences found';
  }

  // Get version statistics
  async getVersionStats(roomId: string): Promise<{
    totalVersions: number;
    lastModified: Date | null;
    authors: Array<{ author: string; authorName?: string; count: number }>;
  }> {
    try {
      const stats = await DocumentVersion.aggregate([
        { $match: { roomId } },
        {
          $group: {
            _id: '$author',
            authorName: { $first: '$authorName' },
            count: { $sum: 1 },
            lastModified: { $max: '$createdAt' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const totalVersions = await DocumentVersion.countDocuments({ roomId });
      const lastModified = await DocumentVersion
        .findOne({ roomId })
        .sort({ createdAt: -1 })
        .select('createdAt');

      return {
        totalVersions,
        lastModified: lastModified?.createdAt || null,
        authors: stats.map(s => ({
          author: s._id,
          authorName: s.authorName,
          count: s.count
        }))
      };
    } catch (error) {
      console.error('Error getting version stats:', error);
      throw error;
    }
  }
}

export const versionHistoryService = new VersionHistoryService();

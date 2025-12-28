/**
 * DATABASE MIGRATION SCRIPT
 * Fixes existing blog posts that have email strings as author instead of ObjectIds
 */

"use server";

import connectToDatabase from "@/lib/db";
import BlogPost from "@/models/blog";
import User from "@/models/User";

export async function migrateBlogAuthors() {
  try {
    await connectToDatabase();

    // Find all posts where author is a string (email)
    const postsWithStringAuthors = await BlogPost.find({
      author: { $type: "string" }
    });

    console.log(`Found ${postsWithStringAuthors.length} posts with string authors`);

    for (const post of postsWithStringAuthors) {
      const authorEmail = post.author;
      
      // Find user by email
      const user = await User.findOne({ email: authorEmail });
      
      if (user) {
        // Update post with ObjectId
        await BlogPost.updateOne(
          { _id: post._id },
          { author: user._id }
        );
        console.log(`✅ Updated post "${post.title}" - author: ${authorEmail} -> ${user._id}`);
      } else {
        // Create a placeholder user or set to null
        console.log(`❌ No user found for email: ${authorEmail}`);
        await BlogPost.updateOne(
          { _id: post._id },
          { author: null }
        );
      }
    }

    return { success: true, message: `Migrated ${postsWithStringAuthors.length} posts` };
  } catch (error) {
    console.error("Migration error:", error);
    return { success: false, error: error.message };
  }
}

// Also fix comments with string authors
export async function migrateCommentAuthors() {
  try {
    await connectToDatabase();

    const posts = await BlogPost.find({
      "comments.author": { $type: "string" }
    });

    console.log(`Found ${posts.length} posts with string comment authors`);

    for (const post of posts) {
      let updated = false;
      
      for (const comment of post.comments) {
        if (typeof comment.author === 'string') {
          const user = await User.findOne({ email: comment.author });
          if (user) {
            comment.author = user._id;
            updated = true;
          } else {
            comment.author = null;
            updated = true;
          }
        }
      }
      
      if (updated) {
        await post.save();
        console.log(`✅ Updated comments for post: ${post.title}`);
      }
    }

    return { success: true, message: `Migrated comments in ${posts.length} posts` };
  } catch (error) {
    console.error("Comment migration error:", error);
    return { success: false, error: error.message };
  }
}
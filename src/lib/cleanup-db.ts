/**
 * QUICK DATABASE FIX
 * Run this once to clean up invalid author fields
 */

"use server";

import connectToDatabase from "@/lib/db";
import BlogPost from "@/models/blog";
import User from "@/models/User";

export async function cleanupDatabase() {
  try {
    await connectToDatabase();

    // Find posts with string authors
    const invalidPosts = await BlogPost.find({ author: { $type: "string" } });
    
    console.log(`Found ${invalidPosts.length} posts with invalid authors`);

    for (const post of invalidPosts) {
      const emailAuthor = post.author;
      
      // Try to find the user by email
      const user = await User.findOne({ email: emailAuthor });
      
      if (user) {
        // Update with correct ObjectId
        await BlogPost.updateOne(
          { _id: post._id },
          { author: user._id }
        );
        console.log(`✅ Fixed: ${post.title} -> ${user.username}`);
      } else {
        // Remove invalid author field
        await BlogPost.updateOne(
          { _id: post._id },
          { $unset: { author: 1 } }
        );
        console.log(`❌ Removed invalid author from: ${post.title}`);
      }
    }

    return {
      success: true,
      message: `Cleaned up ${invalidPosts.length} posts`
    };

  } catch (error) {
    console.error("Cleanup error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
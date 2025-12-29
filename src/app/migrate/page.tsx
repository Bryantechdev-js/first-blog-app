import { migrateBlogAuthors, migrateCommentAuthors } from "@/actions/migrate-db";

export default async function MigrationPage() {
  // Run migrations
  const blogResult = await migrateBlogAuthors();
  const commentResult = await migrateCommentAuthors();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Migration Results</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Blog Authors Migration</h2>
          <p className={blogResult.success ? "text-green-600" : "text-red-600"}>
            {blogResult.success ? blogResult.message : blogResult.error}
          </p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Comment Authors Migration</h2>
          <p className={commentResult.success ? "text-green-600" : "text-red-600"}>
            {commentResult.success ? commentResult.message : commentResult.error}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <p className="text-sm">
          <strong>Next Steps:</strong>
          <br />
          1. Check the results above
          <br />
          2. Go back to your home page
          <br />
          3. The ObjectId cast error should be fixed
          <br />
          4. Delete this migration page after successful migration
        </p>
      </div>
    </div>
  );
}
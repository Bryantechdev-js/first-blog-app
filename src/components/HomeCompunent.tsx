import React from 'react';
type postTypes={
            _id:string,
            title:string,
            media: string,
            author: {
                _id:string,
                name:string,
            },
            category: string,
            createdAt: string,
        }[]
function HomeCompunent({post}:postTypes) {
    console.log("the post:",post);
    
  return <main className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
      {post?.map((post)=><div className='min-h-20 shadow' key={post._id}>{post.title}</div>)}
  </main>
}

export default HomeCompunent;

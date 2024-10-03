import React from 'react'

const Post: React.FC<{ params: { postId: string } }> = ({ params }) => {
  return (
    <div>{params.postId}</div>
  )
}

export default Post
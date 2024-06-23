
export default function About() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex justify-center flex-col max-w-2xl items-center w-full mx-auto  gap-8">
        <div className="">
          <h1 className="text-3xl font-bold text-sky-900 text-cente dark:text-gray-200">About {"Taichi's"} Blog</h1>
        </div>
        <div className="flex gap-6 text-center text-gray-500 flex-col">
        <p>
          Welcome to {"Taichi's"} Blog! This blog was created by me as a personal project to share thoughts and ideas with the world. I am a passionate developer who loves to write about technology, coding, and everything in between.
        </p>
        <p>
          On this blog, {"you'll"} find weekly articles and tutorials on topics such as web development, software engineering, and programming languages. I am always learning and exploring new technologies, so be sure to check back often for new content!
        </p>
        <p>
          We encourage you to leave comments on our posts and engage with other readers. You can like other {"people's"} comments and reply to them as well. We believe that a community of learners can help each other grow and improve.
        </p>
        </div>
      </div>
    </div>
  )
}

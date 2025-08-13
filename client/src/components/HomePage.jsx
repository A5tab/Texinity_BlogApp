import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-primary-bg text-text-light min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-secondary-bg">
        <div className="max-w-4xl mx-auto">
          <img
            src="https://cdn.pixabay.com/photo/2018/06/13/09/33/technology-3472299_1280.jpg"
            alt="Hero"
            className="rounded-lg mb-8 w-full h-96 object-cover shadow-lg"
          />
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Share Your Ideas with the World
          </h2>
          <p className="text-lg text-text-muted mb-8">
            A clean, fast, and secure blog platform built for creators.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-hover"
            >
              Start Writing
            </Link>
            <Link
              to="/dashboard/blogs"
              className="border border-border-accent text-accent px-6 py-3 rounded-lg font-medium hover:bg-accent-hover hover:text-white"
            >
              Browse Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h3 className="text-3xl font-semibold text-center mb-12">
          Why Choose Blogify?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-secondary-bg p-6 rounded-lg shadow hover:shadow-xl transition">
            <img
              src="https://cdn.pixabay.com/photo/2014/02/13/07/28/wordpress-265132_1280.jpg"
              alt="Editor"
              className="w-full h-40 object-contain rounded mb-4"
            />
            <h4 className="text-xl font-semibold mb-2 text-white">
              Simple Editor
            </h4>
            <p className="text-text-muted">
              Write with ease using our clean, markdown-supported editor.
            </p>
          </div>
          <div className="bg-secondary-bg p-6 rounded-lg shadow hover:shadow-xl transition">
            <img
              src="https://cdn.pixabay.com/photo/2019/05/26/23/00/remote-control-4231492_1280.jpg"
              alt="Control"
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h4 className="text-xl font-semibold mb-2 text-white">
              Full Control
            </h4>
            <p className="text-text-muted">
              Edit, publish, delete — you're in control of your content.
            </p>
          </div>
          <div className="bg-secondary-bg p-6 rounded-lg shadow hover:shadow-xl transition">
            <img
              src="https://media.istockphoto.com/id/2149503039/photo/cybersecurity-concept-online-data-protection-and-information-security-concept.jpg?s=2048x2048&w=is&k=20&c=HqEyvfJGZ7r2LDRAwMLbj5usTOAXUqwle_CoadpkhT8="
              alt="Security"
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h4 className="text-xl font-semibold mb-2 text-white">
              Fast & Secure
            </h4>
            <p className="text-text-muted">
              Built with the latest web tech, ensuring speed and safety.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Posts Preview (Static for now) */}
      <section className="bg-secondary-bg py-16 px-6">
        <h3 className="text-3xl font-semibold text-center mb-12">
          Latest Posts
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "How to Start Blogging",
              img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=400&q=80",
            },
            {
              title: "Top 10 Writing Tips",
              img: "https://images.unsplash.com/photo-1558478551-1a378f63328e?auto=format&fit=crop&w=400&q=80",
            },
            {
              title: "React vs Vue for Blogs",
              img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80",
            },
          ].map((post, idx) => (
            <div
              key={idx}
              className="bg-secondary-bg rounded-lg shadow p-4 hover:shadow-xl transition"
            >
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
              <p className="text-text-muted text-sm mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </p>
              <Link
                to="/dashboard/blogs"
                className="text-accent hover:underline text-sm font-medium"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

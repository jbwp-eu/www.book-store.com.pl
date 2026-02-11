import { Link } from "react-router";

const AboutPreview = () => {
  return (
    <section className="mt-12 p-10 flex flex-col md:flex-row items-center gap-8 bg-gray-900">
      <img
        src="/images/profile.jpg"
        alt="profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
      />
      <div>
        <div className="h2 text-2xl font-bold text-white mb-2">👋 About Me</div>
        <p className="text-gray-200 mb-4 max-w-4xl">
          My name is Jarek — I'm a self-taught programmer with a passion for
          creating user-friendly digital experiences.
        </p>
        <Link
          to="/about"
          className="inline-block text-blue-400 hover:underline text-sm"
        >
          Learn More About Me
        </Link>
      </div>
    </section>
  );
};

export default AboutPreview;

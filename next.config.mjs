const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const repoName = "bookreviews";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubPagesBuild ? `/${repoName}` : "",
  assetPrefix: isGithubPagesBuild ? `/${repoName}/` : "",
};

export default nextConfig;


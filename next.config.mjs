/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Reduz bundle inicial carregando apenas os icones usados
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

import { defineConfig } from 'astro/config';
export default defineConfig({ output:'static', base:'/flow', trailingSlash:'always', build:{format:'directory'}, server:{port:4330} });

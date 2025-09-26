import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Spring Taogen Docs",
    description: "Docs for spring-taogen",
    srcDir: 'src',
    srcExclude: [
        'someDir/**',
        'someFile',
    ],
    // Whether to get the last updated timestamp for each page using Git.
    lastUpdated: true,
    // favicon of the website
    head: [
        // ['link', {rel: 'shortcut icon', type: "image/jpeg", href: '/Spring.svg'}],
        // // These two are what you want to use by default
        // ['link', {rel: 'apple-touch-icon', type: "image/jpeg", href: '/Spring.svg'}],
        // ['link', {rel: 'apple-touch-icon', type: "image/jpeg", sizes: "72x72", href: '/Spring.svg'}],
        // ['link', {rel: 'apple-touch-icon', type: "image/jpeg", sizes: "114x114", href: '/Spring.svg'}],
        // ['link', {rel: 'apple-touch-icon', type: "image/jpeg", sizes: "144x144", href: '/Spring.svg'}],
        // ['link', {rel: 'apple-touch-icon-precomposed', type: "image/jpeg", href: '/Spring.svg'}],
        // // This one works for anything below iOS 4.2
        // ['link', {rel: 'apple-touch-icon-precomposed apple-touch-icon', type: "image/jpeg", href: '/Spring.svg'}],
    ],
    themeConfig: {
        nav: nav(),
        sidebar: {
            '/example/': sidebarExample()
        },
        // Logo in the upper left corner of the homepage
        logo: {src: '/Spring.svg', width: 24, height: 24},
        search: {
            provider: 'local'
        },
        outline: {
            level: "deep"
        },
    }
})

function nav(): DefaultTheme.NavItem[] {
    return [
        {text: 'Home', link: '/'},
        {text: 'Example', link: '/example/'},
    ];
}

function sidebarExample(): DefaultTheme.SidebarItem[] {
    return [
       {text: 'Examples', link: '/example/index.md'},
    ]
}

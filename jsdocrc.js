module.exports = {
    plugins: ['plugins/markdown'],
    recurseDepth: 2,
    sourceType: 'module',
    source: {
        include: ['index.js'],
        exclude: [__filename, 'test.*', 'node_modules/']
    },
    tags: {
        allowUnknownTags: true
    },
    opts: {
        template: 'node_modules/docdash',
        encoding: 'utf8',
        destination: './docs',
        readme: './README.md',
        package: './package.json',
        recurse: true,
        verbose: true
    },
    templates: {
        cleverLinks: false,
        monospaceLinks: false
    },
    docdash: {
        sort: true,
        private: false,
        search: true,
        collapse: true,
        menu: {
            'GitHub Repo': {
                href: 'https://github.com/mitsuki31/temppath.git',
                target: '_blank',
                class: 'menu-item',
                id: 'project_git_repo'
            }
        }
    }
};

export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/angular-billboard.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'ng.angularBillboard',
    globals: {
        '@angular/core': 'ng.core',
        'billboard.js/dist/billboard': 'ng.billboard'
    }
}

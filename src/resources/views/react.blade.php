<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <!-- SEO Meta Tags -->
        <title>Valentine - Kirim Surat Cinta Digital Romantis</title>
        <meta name="description" content="Buat dan kirim surat cinta digital yang romantis untuk orang tersayang. Ekspresikan perasaanmu dengan surat cinta online yang indah dan berkesan." />
        <meta name="keywords" content="surat cinta, valentine, surat cinta digital, kartu valentine, pesan romantis, ekspresikan cinta, hadiah valentine, surat cinta online" />
        <meta name="author" content="Valentine App" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#ff6b9d" />
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="{{ url()->current() }}" />
        <meta property="og:title" content="Valentine - Kirim Surat Cinta Digital Romantis" />
        <meta property="og:description" content="Buat dan kirim surat cinta digital yang romantis untuk orang tersayang. Ekspresikan perasaanmu dengan cara yang berkesan." />
        <meta property="og:image" content="{{ asset('image/heart.svg') }}" />
        <meta property="og:locale" content="id_ID" />
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="{{ url()->current() }}" />
        <meta name="twitter:title" content="Valentine - Kirim Surat Cinta Digital Romantis" />
        <meta name="twitter:description" content="Buat dan kirim surat cinta digital yang romantis untuk orang tersayang." />
        <meta name="twitter:image" content="{{ asset('image/heart.svg') }}" />
        
        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="{{ asset('image/heart.svg') }}" />
        <link rel="apple-touch-icon" href="{{ asset('image/heart.svg') }}" />
        
        <!-- Canonical URL -->
        <link rel="canonical" href="{{ url()->current() }}" />
        
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>

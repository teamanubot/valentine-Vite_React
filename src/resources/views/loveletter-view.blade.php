<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Love Letter for {{ ucfirst($recipient) }} - {{ config('app.name', 'Laravel') }}</title>
        @vite(['resources/css/app.css', 'resources/js/app-loveletter-view.jsx'])
    </head>
    <body>
        <div id="root" data-recipient="{{ $recipient }}"></div>
    </body>
</html>

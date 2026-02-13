<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoveLetterController;

Route::get('/', function () {
    return view('react');
});

Route::get('/react', function () {
    return view('welcome-react');
});

Route::get('/welcome', function () {
    return view('welcome');
});

Route::get('/love-letter', function () {
    return view('loveletter-create');
});

Route::get('/love-letter/{recipient}', function ($recipient) {
    return view('loveletter-view', ['recipient' => strtolower($recipient)]);
});

// API Routes for Love Letter
Route::post('/api/love-letter', [LoveLetterController::class, 'store']);
Route::get('/api/love-letter/{recipient}', [LoveLetterController::class, 'show']);
Route::get('/api/love-letter/{recipient}/images', [LoveLetterController::class, 'getImages']);

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LoveLetterController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'recipientName' => 'required|string|max:255',
            'senderName' => 'required|string|max:255',
            'message' => 'required|string',
            'youtubeUrl' => 'nullable|url',
            'images.*' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120', // max 5MB per image
        ]);

        $recipientName = Str::slug($request->recipientName);
        
        // Create directory for this recipient
        $recipientDir = "love-letters/{$recipientName}";
        
        // Handle image uploads
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs($recipientDir, $filename, 'public');
                $imageUrls[] = Storage::url($path);
            }
        }

        // Save letter data
        $letterData = [
            'recipientName' => $request->recipientName,
            'senderName' => $request->senderName,
            'message' => $request->message,
            'youtubeUrl' => $request->youtubeUrl,
            'images' => $imageUrls,
            'createdAt' => now()->toISOString(),
        ];

        // Save to JSON file
        Storage::disk('public')->put(
            "{$recipientDir}/letter.json",
            json_encode($letterData, JSON_PRETTY_PRINT)
        );

        return response()->json([
            'success' => true,
            'recipient' => $recipientName,
            'message' => 'Love letter created successfully!',
        ]);
    }

    public function show($recipient)
    {
        $recipientSlug = Str::slug($recipient);
        $letterPath = "love-letters/{$recipientSlug}/letter.json";

        if (!Storage::disk('public')->exists($letterPath)) {
            return response()->json([
                'success' => false,
                'message' => 'Love letter not found',
            ], 404);
        }

        $letterData = json_decode(Storage::disk('public')->get($letterPath), true);

        return response()->json([
            'success' => true,
            'data' => $letterData,
        ]);
    }

    public function getImages($recipient)
    {
        $recipientSlug = Str::slug($recipient);
        $recipientDir = "love-letters/{$recipientSlug}";

        if (!Storage::disk('public')->exists($recipientDir)) {
            return response()->json([
                'success' => false,
                'images' => [],
            ]);
        }

        $files = Storage::disk('public')->files($recipientDir);
        $images = array_filter($files, function ($file) {
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            return in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif', 'webp']);
        });

        $imageUrls = array_map(function ($path) {
            return Storage::url($path);
        }, array_values($images));

        return response()->json([
            'success' => true,
            'images' => $imageUrls,
        ]);
    }
}

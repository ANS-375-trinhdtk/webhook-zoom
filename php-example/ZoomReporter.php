<?php
namespace App\Helpers;

use Throwable;
use Illuminate\Support\Facades\Http;

class ZoomReporter
{
    public static function report(Throwable $e)
    {
        // Collect error information
        $errorInfo = [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'message' => $e->getMessage(),
        ];

        // URL provided by 3rd party
        $url = env('ZOOM_URL', '');
        $jwtToken = env('ZOOM_JWT_TOKEN', '');

        if(empty($url) || empty($jwtToken)) {
            return;
        }

        // Send error information to the URL with headers
        // Send error information to the URL with headers asynchronously
        Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => $jwtToken,
        ])->post($url, $errorInfo);
    }
}

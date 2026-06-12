<?php

namespace App\Middleware;

class RateLimitMiddleware
{
    private int $maxRequests;
    private int $timeWindow;

    public function __construct(int $maxRequests = 60, int $timeWindow = 60)
    {
        $this->maxRequests = $maxRequests;
        $this->timeWindow = $timeWindow;
    }

    public function handle(): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $key = 'rate_limit_' . $ip;
        $requests = $_SESSION[$key] ?? ['count' => 0, 'time' => time()];

        if (time() - $requests['time'] > $this->timeWindow) {
            $requests = ['count' => 0, 'time' => time()];
        }

        $requests['count']++;
        $_SESSION[$key] = $requests;

        if ($requests['count'] > $this->maxRequests) {
            http_response_code(429);
            echo json_encode(['error' => 'Too many requests. Please try again later.']);
            exit;
        }
    }
}

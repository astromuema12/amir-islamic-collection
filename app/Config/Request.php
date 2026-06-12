<?php

namespace App\Config;

class Request
{
    private array $params;
    private array $query;
    private array $body;
    private array $files;
    private array $server;

    public function __construct(array $params = [])
    {
        $this->params = $params;
        $this->query = $_GET;
        $this->body = $_POST;
        $this->files = $_FILES;
        $this->server = $_SERVER;
    }

    public function getParam(string $key, $default = null)
    {
        return $this->params[$key] ?? $default;
    }

    public function getParams(): array
    {
        return $this->params;
    }

    public function query(string $key, $default = null)
    {
        return $this->query[$key] ?? $default;
    }

    public function input(string $key, $default = null)
    {
        return $this->body[$key] ?? $default;
    }

    public function all(): array
    {
        return array_merge($this->query, $this->body);
    }

    public function only(array $keys): array
    {
        $result = [];
        $data = $this->all();
        foreach ($keys as $key) {
            $result[$key] = $data[$key] ?? null;
        }
        return $result;
    }

    public function file(string $key): ?array
    {
        return $this->files[$key] ?? null;
    }

    public function hasFile(string $key): bool
    {
        return isset($this->files[$key]) && $this->files[$key]['error'] === UPLOAD_ERR_OK;
    }

    public function method(): string
    {
        return strtoupper($this->server['REQUEST_METHOD']);
    }

    public function uri(): string
    {
        if (isset($_GET['url'])) {
            $uri = '/' . ltrim($_GET['url'], '/');
        } else {
            $uri = $this->server['REQUEST_URI'] ?? '/';
            $uri = parse_url($uri, PHP_URL_PATH);

            $scriptName = $this->server['SCRIPT_NAME'] ?? '';
            $dirName = dirname(dirname($scriptName));
            if ($dirName !== '/' && $dirName !== '.' && $dirName !== '\\' && strpos($uri, $dirName) === 0) {
                $uri = substr($uri, strlen($dirName));
            }
        }
        return rtrim($uri, '/') ?: '/';
    }

    public function isAjax(): bool
    {
        return isset($this->server['HTTP_X_REQUESTED_WITH']) &&
            strtolower($this->server['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }

    public function isPost(): bool
    {
        return $this->method() === 'POST';
    }

    public function isGet(): bool
    {
        return $this->method() === 'GET';
    }

    public function ip(): string
    {
        return $this->server['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    public function userAgent(): string
    {
        return $this->server['HTTP_USER_AGENT'] ?? '';
    }

    public function getJson(): array
    {
        $content = file_get_contents('php://input');
        return json_decode($content, true) ?? [];
    }
}

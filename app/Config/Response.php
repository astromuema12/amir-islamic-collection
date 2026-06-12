<?php

namespace App\Config;

class Response
{
    private int $statusCode = 200;
    private array $headers = [];
    private string $body = '';

    public function setStatusCode(int $code): self
    {
        $this->statusCode = $code;
        http_response_code($code);
        return $this;
    }

    public function setHeader(string $name, string $value): self
    {
        $this->headers[$name] = $value;
        header("{$name}: {$value}");
        return $this;
    }

    public function json(array $data, int $statusCode = 200): void
    {
        $this->setStatusCode($statusCode);
        $this->setHeader('Content-Type', 'application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public function redirect(string $url, int $statusCode = 302): void
    {
        $this->setStatusCode($statusCode);
        header("Location: {$url}");
        exit;
    }

    public function back(): void
    {
        $referer = $_SERVER['HTTP_REFERER'] ?? SITE_URL;
        $this->redirect($referer);
    }

    public function with(string $key, $value): self
    {
        $_SESSION[$key] = $value;
        return $this;
    }

    public function withInput(): self
    {
        $_SESSION['_old_input'] = $_POST;
        return $this;
    }

    public function withErrors(array $errors): self
    {
        $_SESSION['_errors'] = $errors;
        return $this;
    }

    public function download(string $filePath, string $fileName = null): void
    {
        if (!file_exists($filePath)) {
            $this->setStatusCode(404);
            echo "File not found";
            exit;
        }

        $fileName = $fileName ?? basename($filePath);
        $this->setHeader('Content-Type', mime_content_type($filePath));
        $this->setHeader('Content-Disposition', 'attachment; filename="' . $fileName . '"');
        $this->setHeader('Content-Length', filesize($filePath));
        readfile($filePath);
        exit;
    }

    public function render(string $view, array $data = []): void
    {
        extract($data);
        $viewFile = VIEWS_PATH . '/' . $view . '.php';

        if (!file_exists($viewFile)) {
            throw new \RuntimeException("View not found: {$view}");
        }

        ob_start();
        require $viewFile;
        $this->body = ob_get_clean();
        echo $this->body;
    }

    public function getBody(): string
    {
        return $this->body;
    }
}

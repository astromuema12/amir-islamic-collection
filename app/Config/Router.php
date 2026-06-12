<?php

namespace App\Config;

class Router
{
    private static array $routes = [];
    private static array $middleware = [];

    public static function get(string $uri, string $controller, string $action, array $middleware = []): void
    {
        self::$routes['GET'][$uri] = ['controller' => $controller, 'action' => $action, 'middleware' => $middleware];
    }

    public static function post(string $uri, string $controller, string $action, array $middleware = []): void
    {
        self::$routes['POST'][$uri] = ['controller' => $controller, 'action' => $action, 'middleware' => $middleware];
    }

    public static function put(string $uri, string $controller, string $action, array $middleware = []): void
    {
        self::$routes['PUT'][$uri] = ['controller' => $controller, 'action' => $action, 'middleware' => $middleware];
    }

    public static function delete(string $uri, string $controller, string $action, array $middleware = []): void
    {
        self::$routes['DELETE'][$uri] = ['controller' => $controller, 'action' => $action, 'middleware' => $middleware];
    }

    public static function group(array $attributes, callable $callback): void
    {
        $callback();
    }

    public static function middleware(string $name, callable $handler): void
    {
        self::$middleware[$name] = $handler;
    }

    public static function dispatch(string $method, string $uri): void
    {
        $uri = parse_url($uri, PHP_URL_PATH);
        $uri = rtrim($uri, '/');
        $uri = $uri ?: '/';

        $method = strtoupper($method);

        if ($method === 'POST' && isset($_POST['_method'])) {
            $method = strtoupper($_POST['_method']);
        }

        $routes = self::$routes[$method] ?? [];

        $matchedRoute = null;
        $params = [];

        foreach ($routes as $routeUri => $routeConfig) {
            $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $routeUri);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                $matchedRoute = $routeConfig;
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                break;
            }
        }

        if ($matchedRoute === null) {
            http_response_code(404);
            require VIEWS_PATH . '/Frontend/404.php';
            return;
        }

        $controllerClass = $matchedRoute['controller'];
        $action = $matchedRoute['action'];
        $routeMiddleware = $matchedRoute['middleware'];

        if (!class_exists($controllerClass)) {
            throw new \RuntimeException("Controller {$controllerClass} not found");
        }

        $controller = new $controllerClass();

        foreach ($routeMiddleware as $mw) {
            if (isset(self::$middleware[$mw])) {
                call_user_func(self::$middleware[$mw]);
            } elseif (class_exists($mw)) {
                (new $mw())->handle();
            }
        }

        $request = new Request($params);
        $response = new Response();

        $controller->$action($request, $response, ...array_values($params));
    }

    public static function getRoutes(): array
    {
        return self::$routes;
    }
}

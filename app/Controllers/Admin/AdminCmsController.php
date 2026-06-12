<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Config\Database;

class AdminCmsController
{
    public function index(Request $request, Response $response): void
    {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("SELECT * FROM site_content ORDER BY page, sort_order");
        $contents = $stmt->fetchAll(\PDO::FETCH_OBJ);

        $response->render('Admin/cms/index', [
            'page_title' => 'CMS Management - Admin',
            'contents' => $contents
        ]);
    }

    public function update(Request $request, Response $response): void
    {
        $db = Database::getInstance()->getConnection();
        $page = $request->input('page');
        $section = $request->input('section');
        $title = $request->input('title');
        $content = $request->input('content');

        $driver = \App\Config\Database::getInstance()->getDriver();
        if ($driver === 'pgsql') {
            $stmt = $db->prepare("
                INSERT INTO site_content (page, section, title, content, status)
                VALUES (?, ?, ?, ?, 'active')
                ON CONFLICT (page, section) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content
            ");
        } else {
            $stmt = $db->prepare("
                INSERT INTO site_content (page, section, title, content, status)
                VALUES (?, ?, ?, ?, 'active')
                ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)
            ");
        }
        $stmt->execute([$page, $section, $title, $content]);

        $_SESSION['success'] = 'Content updated';
        $response->back();
    }
}

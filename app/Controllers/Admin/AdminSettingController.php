<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Config\Database;

class AdminSettingController
{
    public function index(Request $request, Response $response): void
    {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("SELECT * FROM settings ORDER BY setting_group, setting_key");
        $settings = $stmt->fetchAll(\PDO::FETCH_OBJ);

        $grouped = [];
        foreach ($settings as $setting) {
            $grouped[$setting->setting_group][] = $setting;
        }

        $response->render('Admin/settings/index', [
            'page_title' => 'Settings - Admin',
            'settings' => $settings,
            'grouped' => $grouped
        ]);
    }

    public function update(Request $request, Response $response): void
    {
        $data = $request->all();
        $db = Database::getInstance()->getConnection();

        foreach ($data as $key => $value) {
            if ($key === CSRF_TOKEN_NAME || $key === '_method') continue;
            $stmt = $db->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = ?");
            $stmt->execute([$value, $key]);
        }

        $_SESSION['success'] = 'Settings updated successfully';
        $response->back();
    }
}

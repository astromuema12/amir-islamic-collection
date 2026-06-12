<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\Banner;

class AdminBannerController
{
    public function index(Request $request, Response $response): void
    {
        $banners = Banner::query("SELECT * FROM banners ORDER BY placement, sort_order");
        $response->render('Admin/banners/index', [
            'page_title' => 'Banners - Admin',
            'banners' => $banners
        ]);
    }

    public function store(Request $request, Response $response): void
    {
        $banner = new Banner([
            'title' => $request->input('title'),
            'subtitle' => $request->input('subtitle'),
            'description' => $request->input('description'),
            'link' => $request->input('link'),
            'btn_text' => $request->input('btn_text'),
            'sort_order' => (int) ($request->input('sort_order', 0)),
            'placement' => $request->input('placement', 'hero'),
            'status' => $request->input('status', 'active')
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'banner_' . time() . '.' . $ext;
            move_uploaded_file($file['tmp_name'], PUBLIC_PATH . '/uploads/general/' . $filename);
            $banner->image = 'general/' . $filename;
        }

        $banner->save();
        $_SESSION['success'] = 'Banner created';
        $response->back();
    }

    public function delete(Request $request, Response $response, string $id): void
    {
        $banner = Banner::find((int)$id);
        if ($banner) {
            $banner->delete();
            $_SESSION['success'] = 'Banner deleted';
        }
        $response->back();
    }
}

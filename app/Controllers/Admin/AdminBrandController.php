<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\Brand;

class AdminBrandController
{
    public function index(Request $request, Response $response): void
    {
        $brands = Brand::query("SELECT * FROM brands ORDER BY name ASC");
        $response->render('Admin/brands/index', [
            'page_title' => 'Brands - Admin',
            'brands' => $brands
        ]);
    }

    public function store(Request $request, Response $response): void
    {
        $brand = new Brand([
            'name' => $request->input('name'),
            'slug' => slugify($request->input('name')),
            'description' => $request->input('description'),
            'website' => $request->input('website'),
            'status' => $request->input('status', 'active')
        ]);
        $brand->save();

        $_SESSION['success'] = 'Brand created';
        $response->back();
    }

    public function update(Request $request, Response $response, string $id): void
    {
        $brand = Brand::find((int)$id);
        if ($brand) {
            $brand->name = $request->input('name');
            $brand->slug = slugify($request->input('name'));
            $brand->description = $request->input('description');
            $brand->website = $request->input('website');
            $brand->status = $request->input('status', 'active');
            $brand->save();
            $_SESSION['success'] = 'Brand updated';
        }
        $response->back();
    }

    public function delete(Request $request, Response $response, string $id): void
    {
        $brand = Brand::find((int)$id);
        if ($brand) {
            $brand->delete();
            $_SESSION['success'] = 'Brand deleted';
        }
        $response->back();
    }
}

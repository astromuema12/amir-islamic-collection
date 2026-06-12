<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Models\Product;
use App\Models\Category;
use App\Models\Banner;
use App\Models\Blog;
use App\Models\Review;

class HomeController
{
    public function index(Request $request, Response $response): void
    {
        $featuredProducts = Product::getFeatured(8);
        $bestsellers = Product::getBestsellers(8);
        $trending = Product::getTrending(4);
        $newArrivals = Product::getNewArrivals(4);
        $categories = Category::getParentCategories();
        $heroBanners = Banner::getActive('hero');
        $promoBanners = Banner::getActive('promo');
        $blogs = Blog::getPublished(3);

        $testimonials = [
            (object)['name' => 'Aisha Mohamed', 'rating' => 5, 'comment' => 'Excellent quality Qurans and fast delivery. Highly recommended!', 'avatar' => ''],
            (object)['name' => 'Fatima Hassan', 'rating' => 5, 'comment' => 'Beautiful hijabs at great prices. My go-to Islamic store.', 'avatar' => ''],
            (object)['name' => 'Ahmed Ali', 'rating' => 4, 'comment' => 'Great selection of attars. Authentic products and fair pricing.', 'avatar' => ''],
        ];

        $response->render('Frontend/home', [
            'page_title' => SITE_NAME,
            'meta_description' => 'Your Trusted Islamic Marketplace for Qurans, Islamic Books, Clothing, Attars & more',
            'featuredProducts' => $featuredProducts,
            'bestsellers' => $bestsellers,
            'trending' => $trending,
            'newArrivals' => $newArrivals,
            'categories' => $categories,
            'heroBanners' => $heroBanners,
            'promoBanners' => $promoBanners,
            'blogs' => $blogs,
            'testimonials' => $testimonials
        ]);
    }
}
